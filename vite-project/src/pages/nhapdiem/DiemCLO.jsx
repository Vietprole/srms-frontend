import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowUpDown } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { calculateDiemCLO, calculateDiemCLOMax } from "@/api/api-ketqua"
import { getSinhViens } from "@/api/api-sinhvien"
import { useParams } from "react-router-dom"
import { getCLOsByLopHocPhanId } from "@/api/api-clo"

// const CLOs = [
//   {
//     "id": 1,
//     "ten": "CLO 1",
//     "moTa": "Kỹ Năng Làm Việc Nhóm",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 9,
//     "ten": "CLO 2",
//     "moTa": "Kỹ Năng Ngoại Ngữ",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 10,
//     "ten": "CLO 3",
//     "moTa": "Kỹ Năng Giao Tiếp",
//     "lopHocPhanId": 1
//   }
// ]

// const sinhViens = [
//   {
//     "id": 8,
//     "ten": "Lê Phan Phú Việt"
//   },
//   {
//     "id": 9,
//     "ten": "Huỳnh Duy Tin"
//   },
//   {
//     "id": 10,
//     "ten": "Hà Ngọc Hưng"
//   },
//   {
//     "id": 11,
//     "ten": "Phạm Minh Quân"
//   }
// ]

const createColumns = (CLOs, listDiemCLOMax, isBase10, diemDat) => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "ten",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  ...CLOs.map((clo, index) => ({
    accessorKey: `clo_${clo.id}`,
    header: ({ column }) => {
      const diemCLOMax = listDiemCLOMax[index];
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>
            <div>{clo.ten}</div>
            {isBase10 ? <div>10</div> : <div>{diemCLOMax}</div>}
          </div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const base10Score = (row.original[`clo_${clo.id}`] === 0 ? 0 : row.original[`clo_${clo.id}`] / listDiemCLOMax[index] * 10);
      const score = isBase10 ? base10Score : row.original[`clo_${clo.id}`];
      const cellClass = base10Score >= diemDat ? "bg-green-500 text-white" : "bg-red-500 text-white";
      return (
        <div className={cellClass}>
          {score}
        </div>
      )
    }
  }))
]

export default function DiemCLO() {
  const [data, setData] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const { lopHocPhanId } = useParams()
  const [CLOs, setCLOs] = React.useState([])
  const [listDiemCLOMax, setListDiemCLOMax] = React.useState([])
  const [isBase10, setIsBase10] = React.useState(false)
  const [diemDat, setDiemDat] = React.useState(5.0)
  const [inputValue, setInputValue] = React.useState(diemDat);
  const [useDiemTam, setUseDiemTam] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const [sinhViens, CLOs] = await Promise.all([
        getSinhViens(null, null, lopHocPhanId),
        getCLOsByLopHocPhanId(lopHocPhanId),
      ]);
      
      const newData = await Promise.all(sinhViens.map(async (sv) => {
        const cloScores = await Promise.all(CLOs.map(async (clo) => {
          const score = await calculateDiemCLO(sv.id, clo.id, useDiemTam)
          return { [`clo_${clo.id}`]: score }
        }))
        return { ...sv, ...Object.assign({}, ...cloScores) }
      }))

      const listDiemCLOMax = await Promise.all(CLOs.map(async (clo) => {
        const maxScore = await calculateDiemCLOMax(clo.id);
        return maxScore;
      }));
      
      setData(newData)
      setCLOs(CLOs)
      setListDiemCLOMax(listDiemCLOMax)
    }
    fetchData()
  }, [lopHocPhanId, useDiemTam])

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
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("ten")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("ten")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="flex items-center py-4">
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
        <Button type="button" onClick={() => setDiemDat(inputValue)}>Go</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="diem-mode"
          onCheckedChange={(check) => {setIsBase10(check)}}
        />
        <Label htmlFor="diem-mode">Chuyển sang hệ 10</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="diem-mode">Điểm tạm</Label>
        <Switch id="diem-mode"
          onCheckedChange={(check) => {setUseDiemTam(!check);}}
        />
        <Label htmlFor="diem-mode">Điểm chính thức</Label>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                    <TableCell key={cell.id} className="pl-8 pr-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

