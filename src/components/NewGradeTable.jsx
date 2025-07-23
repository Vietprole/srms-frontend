import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  upsertKetQua,
  confirmKetQua,
  acceptKetQua,
} from "@/api-new/api-ketqua";
import { upsertDiemDinhChinh } from "@/api-new/api-diemdinhchinh";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { getRole } from "@/utils/storage";
import { useParams, useSearchParams } from "react-router-dom";
import {
  importGradeFromExcel,
  exportScoreComponent,
} from "../api/api-export-excel";

export function NewGradeTable({
  data,
  fetchData,
  components,
  questions,
  isGiangVienMode,
  isConfirmed,
  useTemporaryScore = true,
}) {
  const role = getRole();
  const [tableData, setTableData] = React.useState(data);
  const [isEditing, setIsEditing] = React.useState(false);
  const [modifiedRecords, setModifiedRecords] = React.useState([]);
  const [modifiedDiemDinhChinhRecords, setModifiedDiemDinhChinhRecords] =
    React.useState([]);
  const [modifiedOfficialScoreRecords, setModifiedOfficialScoreRecords] =
    React.useState([]);
  const [isAccepted, setIsAccepted] = React.useState(false);
  const [confirmationStatus, setConfirmationStatus] =
    React.useState(isConfirmed);
  const [focusedCell, setFocusedCell] = React.useState(null); // Add this state
  const hasHigherPermission = role === "Admin" || role === "AcademicAffairs";

  const { lopHocPhanId } = useParams();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("examId");

  const fileInputRef = React.useRef(null);

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Class ID:", lopHocPhanId);
    console.log("Exam ID:", examId);

    try {
      const res = await importGradeFromExcel(
        parseInt(lopHocPhanId),
        parseInt(examId),
        file
      );
      toast.success(res.message || "Nhập điểm thành công");
      fetchData(); // làm mới dữ liệu
    } catch (error) {
      console.error("Lỗi khi nhập điểm từ Excel:", error);
      if (error.response?.data?.message) {
        toast.error(`Lỗi: ${error.response.data.message}`);
      } else {
        toast.error("Lỗi khi nhập điểm từ Excel");
      }
    }
  };
  const handleDownloadExcelTemplate = () => {
    if (!lopHocPhanId || !examId) {
      toast.error("Không tìm thấy classId hoặc examId");
      return;
    }

    exportScoreComponent(
      parseInt(lopHocPhanId),
      parseInt(examId),
      useTemporaryScore
    );
  };

  React.useEffect(() => {
    setTableData(data);
    const hasNullChinhThucGrades = tableData.some(
      (record) =>
        Object.values(record.officialScores) // Get all grade objects
          .flatMap((gradeObj) => Object.values(gradeObj)) // Flatten values into single array
          .some((grade) => grade === null) // Check for null
    );
    setConfirmationStatus(isConfirmed);
    setIsAccepted(!hasNullChinhThucGrades);
  }, [data, tableData, isConfirmed]);

  // Add keyboard navigation handler
  const handleKeyDown = React.useCallback(
    (e, rowIndex, columnId) => {
      if (!isEditing) return;

      const editableCells = [];

      // Build array of editable cell coordinates
      tableData.forEach((_, rIdx) => {
        components.forEach((component) => {
          const componentQuestions = questions[component.id.toString()] || [];
          componentQuestions.forEach((question) => {
            editableCells.push({
              rowIndex: rIdx,
              columnId: `${component.type}_${question.id}`,
            });
          });
        });
      });

      const currentIndex = editableCells.findIndex(
        (cell) => cell.rowIndex === rowIndex && cell.columnId === columnId
      );

      let newIndex = currentIndex;

      switch (e.key) {
        case "ArrowUp": {
          e.preventDefault();
          let targetRowIndex = -1;
          for (const cell of editableCells) {
            if (cell.columnId === columnId && cell.rowIndex < rowIndex) {
              if (cell.rowIndex > targetRowIndex) {
                targetRowIndex = cell.rowIndex;
              }
            }
          }

          if (targetRowIndex !== -1) {
            newIndex = editableCells.findIndex(
              (cell) =>
                cell.columnId === columnId && cell.rowIndex === targetRowIndex
            );
          }
          break;
        }
        case "ArrowDown":
          e.preventDefault();
          newIndex = editableCells.findIndex(
            (cell) => cell.columnId === columnId && cell.rowIndex > rowIndex
          );
          break;
        case "ArrowLeft":
          e.preventDefault();
          newIndex = Math.max(0, currentIndex - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          newIndex = Math.min(editableCells.length - 1, currentIndex + 1);
          break;
        case "Enter":
          e.preventDefault();
          newIndex = editableCells.findIndex(
            (cell) => cell.columnId === columnId && cell.rowIndex > rowIndex
          );
          if (newIndex === -1) newIndex = currentIndex;
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            newIndex = Math.max(0, currentIndex - 1);
          } else {
            newIndex = Math.min(editableCells.length - 1, currentIndex + 1);
          }
          break;
        default:
          return;
      }

      if (newIndex !== -1 && newIndex !== currentIndex) {
        const newCell = editableCells[newIndex];
        setFocusedCell(newCell);

        // Focus the input after state update
        setTimeout(() => {
          const input = document.querySelector(
            `input[data-cell="${newCell.rowIndex}-${newCell.columnId}"]`
          );
          if (input) {
            input.focus();
            // input.select(); // Select all text for immediate replacement
          }
        }, 0);
      }
    },
    [isEditing, tableData, components, questions]
  );

  const columns = React.useMemo(() => {
    const cols = [
      {
        accessorKey: "index",
        header: "STT",
        size: 60,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      },
      {
        accessorKey: "code",
        header: "MSSV",
        size: 120,
      },
      {
        accessorKey: "name",
        header: "Họ và tên",
        size: 200,
      },
    ];

    // Add columns for each component and its questions
    components.forEach((component) => {
      const componentQuestions = questions[component.id.toString()] || [];
      cols.push({
        id: component.type,
        header: `${component.type} (${component.weight * 100}%)`,
        columns: [
          ...componentQuestions.map((question) => ({
            accessorFn: (row) =>
              row.grades[component.type]?.[question.id.toString()] ?? "",
            id: `${component.type}_${question.id}`,
            header: () => (
              <div>
                <div>{question.name}</div>
                <div>{question.weight * 100}%</div>
              </div>
            ),
            size: 80,
            cell: ({ row, column }) => (
              <EditableCell
                value={row.getValue(column.id)}
                maxValue={question.scale}
                rowIndex={row.index}
                columnId={column.id}
                isEditing={isEditing}
                isFocused={
                  focusedCell?.rowIndex === row.index &&
                  focusedCell?.columnId === column.id
                }
                onKeyDown={handleKeyDown}
                onChange={(value) => {
                  const newData = [...tableData];
                  const rowIndex = row.index;
                  const [componentId, questionId] = column.id.split("_");

                  if (!newData[rowIndex].grades[componentId]) {
                    newData[rowIndex].grades[componentId] = {};
                  }

                  newData[rowIndex].grades[componentId][questionId] = value;

                  const modifiedRecord = {
                    studentId: newData[rowIndex].id,
                    questionId: parseInt(questionId),
                    temporaryScore: value,
                  };

                  const modifiedDiemDinhChinhRecord = {
                    studentId: newData[rowIndex].id,
                    questionId: parseInt(questionId),
                    newScore: value,
                  };

                  const modifiedOfficialScoreRecord = {
                    studentId: newData[rowIndex].id,
                    questionId: parseInt(questionId),
                    officialScore: value,
                  };

                  // if (modifiedRecord.temporaryScore !== null) {
                  //   setModifiedRecords([...modifiedRecords, modifiedRecord]);
                  // }

                  setModifiedRecords([...modifiedRecords, modifiedRecord]);

                  if (modifiedDiemDinhChinhRecord.diemMoi !== null) {
                    setModifiedDiemDinhChinhRecords([
                      ...modifiedDiemDinhChinhRecords,
                      modifiedDiemDinhChinhRecord,
                    ]);
                  }

                  if (modifiedOfficialScoreRecord.officialScore !== null) {
                    setModifiedOfficialScoreRecords([
                      ...modifiedOfficialScoreRecords,
                      modifiedOfficialScoreRecord,
                    ]);
                  }
                  setTableData(newData);
                }}
              />
            ),
          })),
          {
            id: `${component.type}_total`,
            header: "Tổng",
            size: 80,
            accessorFn: (row) => {
              const grades = row.grades[component.type] || {};
              return Object.values(grades).reduce(
                (sum, score) => parseFloat((sum + score).toFixed(2)),
                0
              );
            },
          },
        ],
      });
    });

    return cols;
  }, [
    components,
    questions,
    isEditing,
    tableData,
    modifiedRecords,
    modifiedDiemDinhChinhRecords,
    modifiedOfficialScoreRecords,
    focusedCell,
    handleKeyDown,
  ]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSaveChanges = async () => {
    setIsEditing(false);
    try {
      for (let i = 0; i < modifiedRecords.length; i++) {
        console.log("modifiedRecords[i]", modifiedRecords[i]);
        await upsertKetQua(modifiedRecords[i]);
      }
      toast.success("Đã cập nhật điểm");
      fetchData();
    } catch (error) {
      toast.error(`Lỗi lưu điểm: ${error.message}`);
    }
  };

  const handleSaveDinhChinh = async () => {
    setIsEditing(false);
    try {
      for (let i = 0; i < modifiedDiemDinhChinhRecords.length; i++) {
        console.log(
          "modifiedDiemDinhChinhRecords[i]",
          modifiedDiemDinhChinhRecords[i]
        );
        await upsertDiemDinhChinh(modifiedDiemDinhChinhRecords[i]);
      }
      toast.success(
        "Đã cập nhật điểm đính chính. Xem điểm đính chính đã tạo ở mục Điểm Đính Chính"
      );
      fetchData();
    } catch (error) {
      toast.error(`Lỗi lưu điểm đính chính: ${error.message}`);
    }
  };
  console.log("components, questions", components, questions);

  const handleConfirm = async () => {
    try {
      const hasNullGrades = tableData.some(
        (record) =>
          Object.values(record.grades) // Get all grade objects
            .flatMap((gradeObj) => Object.values(gradeObj)) // Flatten values into single array
            .some((grade) => grade === null) // Check for null
      );

      if (hasNullGrades) {
        toast.error(
          "Chưa nhập đủ điểm. Vui lòng nhập đủ điểm cho tất cả sinh viên trước khi xác nhận"
        );
        return;
      }

      const confirmKetQuaDTOs = tableData.flatMap((record) =>
        record.cauHois.map((questionId) => ({
          studentId: record.id,
          questionId: questionId,
        }))
      );

      await Promise.all(confirmKetQuaDTOs.map((dto) => confirmKetQua(dto)));

      toast.success(
        "Đã xác nhận điểm. Điểm đã được xác nhận và không thể chỉnh sửa"
      );

      await fetchData();
    } catch (error) {
      console.error("Error confirming records:", error);
      toast.error(`Lỗi xác nhận điểm: ${error.message}`);
    }
  };

  const handleAccept = async () => {
    try {
      const latestScoreCorrectionDeadline = new Date(
        Math.max(
          ...components.map(
            (component) => new Date(component.scoreCorrectionDeadline)
          )
        )
      );

      if (!isDatePassed(latestScoreCorrectionDeadline)) {
        toast.error(
          "Chưa hết hạn đính chính điểm. Hãy duyệt sau khi hết hạn đính chính điểm"
        );
        return;
      }

      if (!isAccepted) {
        const hasNullGrades = tableData.some(
          (record) =>
            Object.values(record.grades) // Get all grade objects
              .flatMap((gradeObj) => Object.values(gradeObj)) // Flatten values into single array
              .some((grade) => grade === null) // Check for null
        );

        if (hasNullGrades) {
          toast.error(
            "Điểm chưa đầy đủ. Vui lòng đảm bảo điểm đã có cho tất cả sinh viên trước khi duyệt"
          );
          return;
        }

        console.log("tableData 252", tableData);

        const acceptKetQuaDTOs = tableData.flatMap((record) =>
          record.cauHois.map((questionId) => ({
            studentId: record.id,
            questionId: questionId,
          }))
        );

        acceptKetQuaDTOs.forEach(async (acceptKetQuaDTO) => {
          await acceptKetQua(acceptKetQuaDTO);
          console.log(acceptKetQuaDTO);
        });

        toast.success("Duyệt điểm thành công");
      }
    } catch (error) {
      console.error("Error accepting records:", error);
      toast.error(`Lỗi duyệt điểm: ${error.message}`);
    }
    fetchData();
  };

  // function that compare date to today and return the result
  const isDatePassed = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getTime() < today.getTime();
  };

  const canEditDiem =
    !isGiangVienMode ||
    (isGiangVienMode &&
      isDatePassed(components[0].scoreEntryStartDate) &&
      !isDatePassed(components[0].scoreEntryDeadline));
  const canDinhChinhDiem =
    isGiangVienMode &&
    !isDatePassed(components[0].scoreCorrectionDeadline) &&
    confirmationStatus;

  const handleSaveOfficialScores = async () => {
    setIsEditing(false);
    try {
      for (let i = 0; i < modifiedOfficialScoreRecords.length; i++) {
        console.log(
          "modifiedOfficialScoreRecords[i]",
          modifiedOfficialScoreRecords[i]
        );
        await upsertKetQua(modifiedOfficialScoreRecords[i]);
      }
      toast.success("Đã cập nhật điểm chính thức.");
      fetchData();
    } catch (error) {
      toast.error(`Lỗi lưu điểm chính thức: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-1">
        <Button onClick={handleDownloadExcelTemplate}>Tải Mẫu Excel</Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={confirmationStatus || !canEditDiem}
        >
          Nhập từ Excel
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          className="hidden"
          onChange={handleExcelUpload}
        />

        <Button
          disabled={confirmationStatus || !canEditDiem}
          onClick={() => (isEditing ? handleSaveChanges() : setIsEditing(true))}
        >
          {isEditing ? "Lưu" : "Nhập Điểm"}
        </Button>
        {hasHigherPermission && (
          <Button
            disabled={isEditing || isAccepted || !confirmationStatus}
            onClick={handleAccept}
          >
            {!isAccepted ? "Duyệt" : "Đã Duyệt"}
          </Button>
        )}
        {console.log("!useTemporaryScore", !useTemporaryScore)}
        {console.log("!isAccepted", !isAccepted)}
        {console.log(
          "!isAccepted && !useTemporaryScore)",
          !isAccepted && !useTemporaryScore
        )}
        {hasHigherPermission && (
          <Button
            disabled={!isAccepted || useTemporaryScore}
            onClick={() =>
              isEditing ? handleSaveOfficialScores() : setIsEditing(true)
            }
          >
            {isEditing ? "Lưu điểm phúc khảo" : "Nhập điểm phúc khảo"}
          </Button>
        )}
        <Dialog>
          <DialogTrigger asChild>
            {isGiangVienMode && (
              <Button
                disabled={confirmationStatus}
                // onClick={handleConfirm}
              >
                {confirmationStatus ? "Đã Xác Nhận" : "Xác Nhận"}
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận điểm</DialogTitle>
              <DialogDescription>Xác nhận điểm của sinh viên</DialogDescription>
            </DialogHeader>
            <p>
              Điểm đã xác nhận thì không thể chỉnh sửa, bạn có muốn xác nhận?
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" onClick={() => handleConfirm()}>
                  Xác nhận
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isGiangVienMode && (
          <Button
            disabled={!canDinhChinhDiem}
            onClick={() =>
              isEditing ? handleSaveDinhChinh() : setIsEditing(true)
            }
          >
            {isEditing ? "Lưu Đính Chính" : "Đính Chính Điểm"}
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="text-center px-1 border">
                TT
              </TableHead>
              {/* <TableHead rowSpan={2} className="text-center">MSSV</TableHead> */}
              <TableHead rowSpan={2} className="text-center px-1 border">
                Mã số sinh viên
              </TableHead>
              <TableHead rowSpan={2} className="text-center px-1 border">
                Họ và tên
              </TableHead>
              {components.map((component) => (
                <TableHead
                  key={component.id}
                  colSpan={questions[component.id.toString()]?.length}
                  className="text-center border"
                >
                  {component.type} ({component.weight * 100}%)
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {components.flatMap((component) => [
                ...(questions[component.id.toString()] || []).map(
                  (question) => (
                    <TableHead
                      key={`${component.type}_${question.id}`}
                      className="text-center px-1 border"
                    >
                      <div>{question.name}</div>
                      <div>TS: {question.weight}</div>
                      <div>TĐ: {question.scale}</div>
                    </TableHead>
                  )
                ),
                <TableHead
                  key={`${component.loai}_total`}
                  className="text-center px-1 border"
                >
                  Tổng
                </TableHead>,
              ])}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center px-1 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// interface EditableCellProps {
//   value: number
//   onChange: (value: number) => void
//   isEditing: boolean
// }

// Updated EditableCell component
function EditableCell({
  value,
  maxValue,
  rowIndex,
  columnId,
  isEditing,
  isFocused,
  onKeyDown,
  onChange,
}) {
  const [editValue, setEditValue] = React.useState(value.toString());
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    setEditValue(value.toString());
  }, [value]);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
      // inputRef.current.select();
    }
  }, [isFocused]);

  if (!isEditing) {
    return <span>{value}</span>;
  }

  return (
    <Input
      ref={inputRef}
      type="text"
      value={editValue}
      data-cell={`${rowIndex}-${columnId}`}
      onChange={(e) => {
        const newValue = e.target.value;

        // Allow empty string
        if (newValue === "") {
          setEditValue(newValue);
          onChange(null);
          return;
        }

        // Improved regex to allow decimal input
        // Allows: digits, one decimal point, up to 2 decimal places
        if (/^\d*\.?\d{0,2}$/.test(newValue)) {
          // Only validate max value if it's a complete number (not ending with decimal point)
          if (newValue.endsWith(".")) {
            // Allow typing decimal point
            setEditValue(newValue);
          } else {
            const numValue = parseFloat(newValue);
            if (!isNaN(numValue) && numValue <= maxValue) {
              setEditValue(newValue);
              onChange(numValue);
            } else if (isNaN(numValue)) {
              // This handles edge cases
              setEditValue(newValue);
            }
          }
        }
      }}
      onKeyDown={(e) => onKeyDown(e, rowIndex, columnId)}
      onBlur={() => {
        // Handle final validation on blur
        const numValue = parseFloat(editValue);
        if (!isNaN(numValue)) {
          if (numValue > maxValue) {
            // Reset to max value if exceeded
            setEditValue(maxValue.toString());
            onChange(maxValue);
          } else {
            onChange(numValue);
          }
        } else if (editValue === "" || editValue === ".") {
          setEditValue("");
          onChange(null);
        }
      }}
      className="h-8 w-16 text-center"
    />
  );
}
