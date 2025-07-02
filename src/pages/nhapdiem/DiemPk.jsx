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
// import { calculatePkScore, calculateDiemPkMax } from "@/api-new/api-ketqua"
import {
  calculatePkScore,
  getAllStudentPkScoresForClass,
} from "@/api-new/api-ketqua";
import { getFilteredStudents } from "@/api-new/api-student";
import { useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { getFilteredPIs } from "@/api-new/api-pi";
import ResultTable from "@/components/ResultTable";
import { getFilteredPLOs } from "@/api-new/api-plo";

// const PIs = [
//   {
//     "id": 1,
//     "name": "PI 1",
//     "description": "Kỹ Năng Làm Việc Nhóm",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 9,
//     "name": "PI 2",
//     "description": "Kỹ Năng Ngoại Ngữ",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 10,
//     "name": "PI 3",
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

// const createColumns = (PIs, listDiemPkMax, isBase10, diemDat) => [
const createColumns = (PIs, diemDat) => [
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
  ...PIs.map((pi) => ({
    accessorKey: `pi_${pi.id}`,
    header: ({ column }) => {
      // const diemPIMax = listDiemPkMax[index];
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full px-0"
        >
          {pi.name}
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      // const base10Score = (row.original[`pi_${pi.id}`] === 0 ? 0 : row.original[`pi_${pi.id}`] / listDiemPkMax[index] * 10);
      // const score = isBase10 ? base10Score : row.original[`pi_${pi.id}`];
      const score = row.original[`pi_${pi.id}`];
      const formattedScore =
        score !== null && score !== "" && !isNaN(score)
          ? Number(score).toFixed(2)
          : score;
      // const cellClass = base10Score >= diemDat ? "bg-green-500 text-white" : "bg-red-500 text-white";
      const cellClass =
        score >= diemDat ? "bg-green-500 text-white" : "bg-red-500 text-white";
      return <div className={cellClass + " text-center"}>{formattedScore}</div>;
    },
  })),
];

export default function DiemPk() {
  const [data, setData] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const { lopHocPhanId } = useParams();
  const [PLOs, setPLOs] = React.useState([]);
  const [PIs, setPIs] = React.useState([]);
  // const [listDiemPkMax, setListDiemPkMax] = React.useState([])
  // const [isBase10, setIsBase10] = React.useState(false)
  const [diemDat, setDiemDat] = React.useState(5.0);
  const [inputValue, setInputValue] = React.useState(diemDat);
  const [useTemporaryScore, setUseTemporaryScore] = React.useState(true);
  const [extraHeaders, setExtraHeaders] = React.useState({});

  React.useEffect(() => {
    const fetchData = async () => {
      const [sinhViens, PLOs] = await Promise.all([
        getFilteredStudents(null, null, lopHocPhanId),
        getFilteredPLOs(null, lopHocPhanId),
      ]);

      const piDataPromises = PLOs.map((plo) =>
        getFilteredPIs(plo.id, null, null, lopHocPhanId)
      );
      const pisResults = await Promise.all(piDataPromises);

      const extraHeaders = pisResults.reduce((acc, pisGroup) => {
        const ploId = pisGroup[0]?.ploId;
        if (ploId) {
          const plo = PLOs.find((plo) => plo.id === ploId);
          acc[ploId] = {
            colSpan: pisGroup.length,
            header: plo.name,
          };
        }
        return acc;
      }, {});

      setExtraHeaders(extraHeaders);

      const PIs = pisResults.flat();

      const pkScores = await getAllStudentPkScoresForClass(
        lopHocPhanId,
        useTemporaryScore
      );

      const newData = sinhViens.map((sv) => {
        // Create an object with all CLO scores for this student
        const studentPkScores = {};

        PIs.forEach((pi) => {
          // Find the score for this student and PI
          const scoreObj = pkScores.find(
            (item) => item.studentId === sv.id && item.piId === pi.id
          );
          // Add it to the student's scores object
          studentPkScores[`pi_${pi.id}`] = scoreObj?.pkScore;
        });
      
        // Return student with their CLO scores
        return { ...sv, ...studentPkScores };
      });

      // const listDiemPkMax = await Promise.all(PIs.map(async (pi) => {
      //   const maxScore = await calculateDiemPkMax(pi.id);
      //   return maxScore;
      // }));

      setData(newData);
      setPIs(PIs);
      // setListDiemPIMax(listDiemPkMax)
    };
    fetchData();
  }, [lopHocPhanId, useTemporaryScore]);

  // const columns = createColumns(PIs, listDiemPIMax, isBase10, diemDat);
  const columns = createColumns(PIs, diemDat);

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

  return (
    <div>
      <div className="flex items-center py-4">
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
      <ResultTable
        table={table}
        columns={columns}
        extraHeaders={extraHeaders}
      />
    </div>
  );
}
