import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
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
// import { Switch } from "@/components/ui/switch"
import { ArrowUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
// import { calculatePLOScore, calculateDiemPLOMax } from "@/api-new/api-ketqua"
import {
  calculatePLOScore,
  getAllStudentPLOScoresForProgramme,
} from "@/api-new/api-ketqua";
// import { getStudentsInClass } from "@/api-new/api-lophocphan"
// import { useParams } from "react-router-dom"
import { getFilteredPLOs } from "@/api-new/api-plo";
import Layout from "./Layout";
import { getFilteredStudents } from "@/api-new/api-student";
import ResultTable from "@/components/ResultTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { getAllProgrammes } from "@/api-new/api-programme";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { getStudentById } from "@/api-new/api-student";
import { getRole, getStudentId } from "@/utils/storage";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ComboBox } from "@/components/ComboBox";
import { PercentageChart } from "@/components/PercentageChart";
import { getPLOPassedPercentages } from "@/api-new/api-ketqua";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { StudentPIScore } from "@/components/StudentPIScore";
import MaxPkScoreTable from "@/components/MaxPkScoreTable";

// const PLOs = [
//   {
//     "id": 1,
//     "name": "PLO 1",
//     "description": "Kỹ Năng Làm Việc Nhóm",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 9,
//     "name": "PLO 2",
//     "description": "Kỹ Năng Ngoại Ngữ",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 10,
//     "name": "PLO 3",
//     "description": "Kỹ Năng Giao Tiếp",
//     "lopHocPhanId": 1
//   }
// ]

// const sinhViens = [
//   {
//     "id": 8,
//     "name": "Lê Phan Phú Việt"
//   },
//   {
//     "id": 9,
//     "name": "Huỳnh Duy Tin"
//   },
//   {
//     "id": 10,
//     "name": "Hà Ngọc Hưng"
//   },
//   {
//     "id": 11,
//     "name": "Phạm Minh Quân"
//   }
// ]

// const createColumns = (PLOs, listDiemPkMax, isBase10, diemDat) => [

export default function XetChuanDauRaPage() {
  const [data, setData] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [PLOs, setPLOs] = React.useState([]);
  const [diemDat, setDiemDat] = React.useState(5.0);
  const [inputValue, setInputValue] = React.useState(diemDat);
  const [comboBoxItems, setComboBoxItems] = React.useState([]);
  const [searchParams] = useSearchParams();
  const programmeIdParam = searchParams.get("programmeId");
  const [nganhId, setNganhId] = React.useState(programmeIdParam);
  const [useTemporaryScore, setUseTemporaryScore] = React.useState(true);
  const [comboBoxItemId, setComboBoxItemId] = React.useState(programmeIdParam);
  const studentId = getStudentId();
  const navigate = useNavigate();
  const [chartData, setChartData] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedStudentId, setSelectedStudentId] = React.useState(null);
  const [selectedPLOId, setSelectedPLOId] = React.useState(null);
  const [passedTarget, setPassedTarget] = React.useState(50);
  const [inputValue2, setInputValue2] = React.useState(passedTarget);

  const createColumns = (PLOs, diemDat) => [
    {
      accessorKey: "tt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            TT
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.index + 1}</div>,
    },
    {
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            MSSV
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.getValue("name")}</div>,
    },
    ...PLOs.map((plo) => ({
      accessorKey: `plo_${plo.id}`,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full px-0"
          >
            {plo.name}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const score = row.original[`plo_${plo.id}`];
        const formattedScore =
          score !== null && score !== "" && !isNaN(score)
            ? Number(score).toFixed(2)
            : score;
        const cellClass =
          score >= diemDat
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white";

        const studentId = row.original.id;
        return (
          <button
            className={cellClass + " w-full text-center"}
            onClick={() => openPLOBreakdownModal(studentId, plo.id)}
          >
            {formattedScore}
          </button>
        );
      },
    })),
  ];

  const openPLOBreakdownModal = (studentId, ploId) => {
    console.log("Opening modal for studentId:", studentId, "and ploId:", ploId);
    setSelectedStudentId(studentId);
    setSelectedPLOId(ploId);
    setDialogOpen(true);
  };

  React.useEffect(() => {
    const fetchProgrammeData = async () => {
      const comboBoxItems = await getAllProgrammes();
      const mappedComboBoxItems = comboBoxItems.map((nganh) => ({
        label: `${nganh.code} - ${nganh.name}`,
        value: nganh.id,
      }));
      setComboBoxItems(mappedComboBoxItems);
    };
    fetchProgrammeData();
  }, [nganhId, useTemporaryScore, studentId]);

  console.log("nganhId: ", nganhId);

  React.useEffect(() => {
    const fetchChartData = async () => {
      const chartData = await getPLOPassedPercentages(
        nganhId,
        diemDat / 10,
        useTemporaryScore
      );
      // Add threshold: 50 to each record in chartData
      const chartDataWithThreshold = chartData.map((record) => ({
        ...record,
        threshold: 50,
      }));

      setChartData(chartDataWithThreshold);
      console.log("Chart Data with threshold: ", chartDataWithThreshold);
    };
    fetchChartData();
  }, [diemDat, useTemporaryScore, nganhId]);

  React.useEffect(() => {
    const fetchScoreData = async () => {
      let sinhViens = await getFilteredStudents(null, nganhId, null);
      if (studentId) {
        sinhViens = await getStudentById(studentId).then((sv) => [sv]);
        setNganhId(sinhViens[0].nganhId);
      }
      let PLOs = await getFilteredPLOs(nganhId, null, null);

      const ploScores = await getAllStudentPLOScoresForProgramme(
        nganhId,
        useTemporaryScore
      );

      console.log("PLO Scores: ", ploScores);

      const newData = sinhViens.map((sv) => {
        // Create an object with all PI scores for this student
        const studentPLOScores = {};

        PLOs.forEach((plo) => {
          // Find the score for this student and PI
          const scoreObj = ploScores.find(
            (item) => item.studentId === sv.id && item.ploId === plo.id
          );
          // Add it to the student's scores object
          studentPLOScores[`plo_${plo.id}`] = scoreObj?.ploScore;
        });

        // Return student with their PI scores
        return { ...sv, ...studentPLOScores };
      });

      setData(newData);

      // const newData = await Promise.all(
      //   sinhViens.map(async (sv) => {
      //     const ploScores = await Promise.all(
      //       PLOs.map(async (plo) => {
      //         let score = 0;
      //         try {
      //           score = await calculatePLOScore(
      //             sv.id,
      //             plo.id,
      //             useTemporaryScore
      //           );
      //         } catch (error) {
      //           score = null;
      //         }
      //         console.log("calculatePLOScore", sv.id, plo.id, score);
      //         return { [`plo_${plo.id}`]: score };
      //       })
      //     );
      //     return { ...sv, ...Object.assign({}, ...ploScores) };
      //   })
      // );

      // const listDiemPkMax = await Promise.all(PLOs.map(async (plo) => {
      //   const maxScore = await calculateDiemPLOMax(plo.id);
      //   return maxScore;
      // }));

      setData(newData);
      setPLOs(PLOs);
      // setListDiemPLOMax(listDiemPkMax)
    };
    if (nganhId) {
      fetchScoreData();
    } else {
      setData([]);
      setPLOs([]);
      // setListDiemPIMax([])
    }
  }, [nganhId, studentId, useTemporaryScore]);
  // const columns = createColumns(PLOs, listDiemPLOMax, isBase10, diemDat);
  const columns = createColumns(PLOs, diemDat);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });

  const handleGoClick = () => {
    setNganhId(comboBoxItemId);
    if (!comboBoxItemId) {
      navigate(`/xetchuandaura`);
      return;
    }
    navigate(`/xetchuandaura?programmeId=${comboBoxItemId}`);
  };

  const chartConfig = {
    passedPercentage: {
      label: "Tỷ lệ đạt",
      color: "#2563eb",
    },

    ploName: {
      label: "PLO",
      color: "#4b5563",
    },
  };
  const dataKey = "ploName";

  return (
    <Layout>
      <div className="overflow-y-auto h-full">
        <h1>Tính điểm đạt chuẩn đầu ra của CTĐT của Sinh Viên</h1>
        <div className="flex gap-1">
          <ComboBox
            items={comboBoxItems}
            setItemId={setComboBoxItemId}
            initialItemId={comboBoxItemId}
            placeholder="Chọn CTĐT"
            width="500px"
          />
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <div>
          <div className="flex items-center py-1">
            <Input
              placeholder="Tìm kiếm..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center py-1">
            <Label htmlFor="DiemDat">Nhập điểm đạt hệ 10: </Label>
            <Input
              id="DiemDat"
              placeholder="5.0..."
              className="w-16 ml-2 mr-2"
              type="number"
              value={inputValue}
              min={0}
              max={10}
              step={1}
              onChange={(e) => setInputValue(parseFloat(e.target.value))}
            />
            <Button type="button" onClick={() => setDiemDat(inputValue)}>
              Go
            </Button>
          </div>
          <div className="flex items-center py-1">
            <Label htmlFor="PassedTarget">Nhập chỉ tiêu đạt (%): </Label>
            <Input
              id="PassedTarget"
              placeholder="50..."
              className="w-16 ml-2 mr-2"
              type="number"
              value={inputValue2}
              min={0}
              max={100}
              step={10}
              onChange={(e) => setInputValue2(parseFloat(e.target.value))}
            />
            <Button type="button" onClick={() => setPassedTarget(inputValue2)}>
              Go
            </Button>
          </div>
          <PercentageChart
            chartData={chartData}
            chartConfig={chartConfig}
            dataKey={dataKey}
            passedTarget={passedTarget}
          />
          <div className="flex items-center space-x-2">
            <Label htmlFor="diem-mode">Điểm tạm</Label>
            <Switch
              id="diem-mode"
              onCheckedChange={(check) => {
                setUseTemporaryScore(!check);
              }}
            />
            <Label htmlFor="diem-mode">Điểm chính thức</Label>
          </div>
          <ResultTable table={table} columns={columns} />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-fit">
              <DialogHeader>
                <DialogTitle>Chi tiết điểm Pk học phần cấu thành điểm PLO</DialogTitle>
              </DialogHeader>
              <MaxPkScoreTable
                studentId={selectedStudentId}
                ploId={selectedPLOId}
                useTemporaryScore={useTemporaryScore}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
