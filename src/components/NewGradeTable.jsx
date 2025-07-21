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
import { upsertKetQua, confirmKetQua, acceptKetQua } from "@/api-new/api-ketqua";
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

export function NewGradeTable({
  data,
  fetchData,
  components,
  questions,
  isGiangVienMode,
  isConfirmed,
  useTemporaryScore = true, // Default to true
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
  const hasHigherPermission = role === "Admin" || role === "AcademicAffairs";
  console.log("hasHigherPermission", hasHigherPermission);
  console.log("isConfirmed", isConfirmed);
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
      console.log("componentQuestions", componentQuestions);
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
                onChange={(value) => {
                  const newData = [...tableData];
                  console.log("newData", newData);
                  const rowIndex = row.index;
                  const [componentId, questionId] = column.id.split("_");

                  if (!newData[rowIndex].grades[componentId]) {
                    newData[rowIndex].grades[componentId] = {};
                  }

                  newData[rowIndex].grades[componentId][questionId] = value;
                  // const ketQuaId = newData[rowIndex].ketQuas[componentId][questionId];
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
                  console.log("modifiedRecord", modifiedRecord);
                  console.log(
                    "modifiedDiemDinhChinhRecord",
                    modifiedDiemDinhChinhRecord
                  );
                  // upsertKetQua(modifiedRecord);
                  if (modifiedRecord.temporaryScore !== null) {
                    setModifiedRecords([...modifiedRecords, modifiedRecord]);
                  }

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
                isEditing={isEditing}
              />
            ),
          })),
          // {
          //   id: `${component.type}_total`,
          //   header: "Tổng",
          //   size: 80,
          //   accessorFn: (row) => {
          //     const grades = row.grades[component.type] || {};
          //     return Object.values(grades).reduce(
          //       (sum, score) => sum + score,
          //       0
          //     );
          //   },
          // },
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

function EditableCell({ value, maxValue, onChange, isEditing }) {
  const [editValue, setEditValue] = React.useState(value.toString());

  React.useEffect(() => {
    setEditValue(value.toString());
  }, [value]);

  if (!isEditing) {
    return <span>{value}</span>;
  }

  console.log("maxValue", maxValue);

  return (
    <Input
      type="text"
      value={editValue}
      onChange={(e) => {
        const newValue = e.target.value;
        if (
          newValue === "" ||
          (/^\d*\.?\d{0,2}$/.test(newValue) && parseFloat(newValue) <= maxValue)
        ) {
          setEditValue(newValue);
        }
      }}
      onBlur={() => {
        const numValue = parseFloat(editValue);
        if (!isNaN(numValue)) {
          onChange(numValue);
        }
      }}
      className="h-8 w-16 text-center"
    />
  );
}
