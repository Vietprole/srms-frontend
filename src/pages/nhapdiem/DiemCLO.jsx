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
import { Switch } from "@/components/ui/switch";
import { ArrowUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  calculateCLOScore,
  calculateCLOScoreMax,
  getAllStudentCLOScoresForClass,
  getCLOPassedPercentages,
} from "@/api-new/api-ketqua";
import { getFilteredStudents } from "@/api-new/api-student";
import { useParams } from "react-router-dom";
import { getCLOsByClassId } from "@/api-new/api-clo";
import ResultTable from "@/components/ResultTable";
import { PercentageChart } from "@/components/PercentageChart";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";

// const CLOs = [
//   {
//     "id": 1,
//     "name": "CLO 1",
//     "description": "Kỹ Năng Làm Việc Nhóm",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 9,
//     "name": "CLO 2",
//     "description": "Kỹ Năng Ngoại Ngữ",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 10,
//     "name": "CLO 3",
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

const createColumns = (CLOs, listDiemCLOMax, isBase10, diemDat) => [
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
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4">{row.getValue("name")}</div>,
  },
  ...CLOs.map((clo, index) => ({
    accessorKey: `clo_${clo.id}`,
    header: ({ column }) => {
      const diemCLOMax = listDiemCLOMax[index];
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full px-0"
        >
          <div>
            <div>{clo.name}</div>
            {isBase10 ? <div>10</div> : <div>{diemCLOMax}</div>}
          </div>
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const base10Score = parseFloat(
        row.original[`clo_${clo.id}`] === 0
          ? 0
          : (row.original[`clo_${clo.id}`] / listDiemCLOMax[index]) * 10
      ).toFixed(2);
      const score = isBase10 ? base10Score : row.original[`clo_${clo.id}`];
      const formattedScore =
        score !== null && score !== "" && !isNaN(score)
          ? Number(score).toFixed(2)
          : score;
      const cellClass =
        base10Score >= diemDat
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white";
      return <div className={cellClass + " text-center"}>{formattedScore}</div>;
    },
  })),
];

export default function DiemCLO() {
  const [data, setData] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const { lopHocPhanId } = useParams();
  const [CLOs, setCLOs] = React.useState([]);
  const [listDiemCLOMax, setListDiemCLOMax] = React.useState([]);
  const [isBase10, setIsBase10] = React.useState(false);
  const [diemDat, setDiemDat] = React.useState(5.0);
  const [inputValue, setInputValue] = React.useState(diemDat);
  const [useTemporaryScore, setUseTemporaryScore] = React.useState(true);
  const [chartData, setChartData] = React.useState([]);
  const [passedTarget, setPassedTarget] = React.useState(50);
  const [inputValue2, setInputValue2] = React.useState(passedTarget);

  React.useEffect(() => {
    const fetchData = async () => {
      //   const lopHocPhan = await getLopHocPhanById(lopHocPhanId);
      // const hocPhanId = lopHocPhan.hocPhanId;
      const [sinhViens, CLOs] = await Promise.all([
        getFilteredStudents(null, null, lopHocPhanId),
        getCLOsByClassId(lopHocPhanId),
      ]);

      console.log("CLOs: ", CLOs);
      console.log("lopHocPhanId: ", lopHocPhanId);

      const cloScores = await getAllStudentCLOScoresForClass(
        lopHocPhanId,
        useTemporaryScore
      );

      console.log("CLO Scores: ", cloScores);
      // const newData = await Promise.all(
      //   sinhViens.map(async (sv) => {
      //     const cloScores = await Promise.all(
      //       CLOs.map(async (clo) => {
      //         const score = await calculateCLOScore(
      //           sv.id,
      //           lopHocPhanId,
      //           clo.id,
      //           useTemporaryScore
      //         );
      //         console.log("score: ", score);
      //         return { [`clo_${clo.id}`]: score };
      //       })
      //     );
      //     return { ...sv, ...Object.assign({}, ...cloScores) };
      //   })
      // );

      const newData = sinhViens.map((sv) => {
        // Create an object with all CLO scores for this student
        const studentCloScores = {};

        CLOs.forEach((clo) => {
          // Find the score for this student and CLO
          const scoreObj = cloScores.find(
            (item) => item.studentId === sv.id && item.cloId === clo.id
          );
          // Add it to the student's scores object
          studentCloScores[`clo_${clo.id}`] = scoreObj?.cloScore;
        });

        // Return student with their CLO scores
        return { ...sv, ...studentCloScores };
      });

      console.log("newData: ", newData);

      const listDiemCLOMax = await Promise.all(
        CLOs.map(async (clo) => {
          const maxScore = await calculateCLOScoreMax(clo.id, lopHocPhanId);
          return maxScore;
        })
      );

      console.log("listDiemCLOMax: ", listDiemCLOMax);

      setData(newData);
      setCLOs(CLOs);
      setListDiemCLOMax(listDiemCLOMax);
    };
    fetchData();
  }, [lopHocPhanId, useTemporaryScore]);

  React.useEffect(() => {
    const fetchChartData = async () => {
      const chartData = await getCLOPassedPercentages(
        lopHocPhanId,
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
  }, [lopHocPhanId, diemDat, useTemporaryScore]);

  const columns = createColumns(CLOs, listDiemCLOMax, isBase10, diemDat);

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

  const chartConfig = {
    passedPercentage: {
      label: "Tỷ lệ đạt",
      color: "#2563eb",
    },

    cloName: {
      label: "CLO",
      color: "#4b5563",
    },
  };
  const dataKey = "cloName";
  // const exportToExcel = async () => {
  //   // Fetch the template file using fetch API
  //   const response = await fetch('/templates/clo_template.xlsx');
  //   const templateArrayBuffer = await response.arrayBuffer();

  //   // Load the template into ExcelJS
  //   const workbook = new ExcelJS.Workbook();
  //   await workbook.xlsx.load(templateArrayBuffer);
  //   let worksheet = workbook.getWorksheet("Sheet1");
  //   // header id name dob
  //   let row = worksheet.getRow(1);
  //   console.log(row);
  //   row.getCell('Q').value = 'test';
  //   row.getCell('R').value = 'successful';
  //   row.commit();
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
  //   const excel_extension = ".xlsx";
  //   FileSaver.saveAs(blob, `DiemCLO_${lopHocPhanId}${excel_extension}`);
  // };
  const pdfRef = React.useRef(null);
  const exportToPDF = async () => {
    const element = pdfRef.current;
    html2pdf(element, {
      margin: 1,
      filename: `DiemCLO.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit:"cm", format: "a4", orientation: "portrait" },
    }).then(() => {
      console.log("PDF exported successfully");
    }).catch((error) => {
      console.error("Error exporting PDF:", error);
    });
  };

  return (
    <div>
      <div className="flex items-center py-1 gap-1">
        <Input
          placeholder="Tìm kiếm..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          onClick={exportToPDF}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Tải xuống PDF
        </Button>
      </div>
      <div ref={pdfRef}>
        <p className="text-xl font-bold">Biểu đồ thống kê tỉ lệ đạt CLO</p>
        <div className="flex items-center py-1" data-html2canvas-ignore>
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
        <div className="flex items-center py-1" data-html2canvas-ignore>
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
        <p className="text-xl font-bold">Bảng điểm CLO</p>
        <div className="flex items-center space-x-2" data-html2canvas-ignore>
          <Switch
            id="diem-mode"
            onCheckedChange={(check) => {
              setIsBase10(check);
            }}
          />
          <Label htmlFor="diem-mode">Chuyển sang hệ 10</Label>
        </div>
        <div className="flex items-center space-x-2" data-html2canvas-ignore>
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
      </div>
    </div>
  );
}
