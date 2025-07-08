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
import { calculateMaxPkScoreForCourse } from "@/api-new/api-ketqua";
// import { getStudentsInClass } from "@/api-new/api-lophocphan"
// import { useParams } from "react-router-dom"
import { getCoursesOfPLO, getFilteredPLOs, getPLOById } from "@/api-new/api-plo";
import { Switch } from "@/components/ui/switch";
import { getStudentById } from "@/api-new/api-student";
import { getFilteredCourses } from "@/api-new/api-course";
import { getCoursesInProgramme } from "@/api-new/api-programme";

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

// const student = [
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
          Mã học phần
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
          Tên học phần
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "credits",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số tín chỉ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4 text-center">{row.getValue("credits")}</div>,
  },
  ...PLOs.map((plo) => ({
    accessorKey: `plo_${plo.id}`,
    header: ({ column }) => {
      // const diemPLOMax = listDiemPkMax[index];
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>
            <div>{plo.name}</div>
            {/* {isBase10 ? <div>10</div> : <div>{diemPLOMax}</div>} */}
          </div>
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      // const base10Score = (row.original[`plo_${plo.id}`] === 0 ? 0 : row.original[`plo_${plo.id}`] / listDiemPkMax[index] * 10);
      // const score = isBase10 ? base10Score : row.original[`plo_${plo.id}`];
      const score = row.original[`plo_${plo.id}`];
      const formattedScore =
        score !== null && score !== "" && !isNaN(score)
          ? Number(score).toFixed(2)
          : score;
      // const cellClass = base10Score >= diemDat ? "bg-green-500 text-white" : "bg-red-500 text-white";
      const cellClass =
        score >= diemDat ? "bg-green-500 text-white" : "bg-red-500 text-white";
      return (
        <div className={cellClass + " w-full text-center"}>
          {formattedScore}
        </div>
      );
    },
  })),
];

export default function MaxPkScoreTable({ studentId, ploId, useTemporaryScore: initialUseTemporaryScore }) {
  const [data, setData] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [PLOs, setPLOs] = React.useState([]);
  // const [listDiemPkMax, setListDiemPkMax] = React.useState([])
  // const [isBase10, setIsBase10] = React.useState(false)
  const [diemDat, setDiemDat] = React.useState(5.0);
  const [inputValue, setInputValue] = React.useState(diemDat);
  const [useTemporaryScore, setUseTemporaryScore] = React.useState(initialUseTemporaryScore);
  const [displayFailedCourses, setDisplayFailedCourses] = React.useState(false);
  const [filteredData, setFilteredData] = React.useState([]);
  console.log("ploId, studentId, useTemporaryScore", ploId, studentId, useTemporaryScore);

  React.useEffect(() => {
    const fetchScoreData = async () => {
      const student = await getStudentById(studentId);
      // Fetch the PLO information first to have it available for columns
      const plo = await getPLOById(ploId);
      setPLOs([plo]); // Set as array with single PLO
      const courses = await getCoursesOfPLO(ploId);
      const newData = await Promise.all(
        courses.map(async (course) => {
          // const ploScores = await Promise.all(
          //   PLOs.map(async (plo) => {
          //     let score = 0;
          //       score = await calculateMaxPkScoreForCourse(
          //         course.id,
          //         student.id,
          //         plo.id,
          //         useTemporaryScore
          //       );
          //     console.log(
          //       "calculateMaxPkScoreForCourse",
          //       course.id,
          //       student.id,
          //       plo.id,
          //       score
          //     );
          //     return { [`plo_${plo.id}`]: score };
          //   })
          // );
          const ploScore = await calculateMaxPkScoreForCourse(
            course.id,
            student.id,
            ploId,
            useTemporaryScore
          );
          return { ...course, [`plo_${ploId}`]: ploScore };
        })
      );

      // const listDiemPkMax = await Promise.all(PLOs.map(async (plo) => {
      //   const maxScore = await calculateDiemPLOMax(plo.id);
      //   return maxScore;
      // }));

      setData(newData);
      // setListDiemPLOMax(listDiemPkMax)
    };
    fetchScoreData();
  }, [ploId, studentId, useTemporaryScore]);

  // Add this effect to filter data when needed
  React.useEffect(() => {
    if (displayFailedCourses) {
      // Filter courses with ANY failing PLO score
      const filtered = data.filter((row) => {
        const ploColumns = Object.keys(row).filter((key) =>
          key.startsWith("plo_")
        );
        return ploColumns.some((ploKey) => {
          const score = row[ploKey];
          return (
            score !== null &&
            score !== "" &&
            !isNaN(score) &&
            Number(score) < diemDat
          );
        });
      });
      setFilteredData(filtered);
    } else {
      // No filtering, show all data
      setFilteredData(data);
    }
  }, [displayFailedCourses, data, diemDat]);

  // const columns = createColumns(PLOs, listDiemPLOMax, isBase10, diemDat);
  const columns = createColumns(PLOs, diemDat);

  const table = useReactTable({
    data: filteredData,
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
      <div>
        <div className="flex items-center py-1">
          <Input
            placeholder="Tìm kiếm theo"
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
            className="max-w-sm"
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
        <div className="flex items-center space-x-2 py-1">
          <Label htmlFor="diem-mode">Điểm tạm</Label>
          <Switch
            id="diem-mode"
            onCheckedChange={(check) => {
              setUseTemporaryScore(!check);
            }}
            checked={!useTemporaryScore}
          />
          <Label htmlFor="diem-mode">Điểm chính thức</Label>
        </div>
        <div className="flex items-center space-x-2 py-1">
          <Label htmlFor="course-mode">Tất cả học phần</Label>
          <Switch
            id="course-mode"
            onCheckedChange={(check) => {
              setDisplayFailedCourses(check);
            }}
          />
          <Label htmlFor="course-mode">Học phần cần cải thiện</Label>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="border">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không tìm thấy kết quả
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
