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
// import { Switch } from "@/components/ui/switch"
import { ArrowUpDown } from 'lucide-react'
import { Label } from "@/components/ui/label"
// import { calculateDiemPLO, calculateDiemPLOMax } from "@/api/api-ketqua"
import { calculateDiemPLO } from "@/api/api-ketqua"
// import { getSinhViensByLopHocPhanId } from "@/api/api-lophocphan"
// import { useParams } from "react-router-dom"
import { getPLOsByNganhId } from "@/api/api-plo"
import Layout from "./Layout"
import { getSinhViens } from "@/api/api-sinhvien"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown} from "lucide-react"
import { getAllNganhs } from "@/api/api-nganh"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

// const PLOs = [
//   {
//     "id": 1,
//     "ten": "PLO 1",
//     "moTa": "Kỹ Năng Làm Việc Nhóm",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 9,
//     "ten": "PLO 2",
//     "moTa": "Kỹ Năng Ngoại Ngữ",
//     "lopHocPhanId": 1
//   },
//   {
//     "id": 10,
//     "ten": "PLO 3",
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

// const createColumns = (PLOs, listDiemPkMax, isBase10, diemDat) => [
const createColumns = (PLOs, diemDat) => [
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
            <div>{plo.ten}</div>
            {/* {isBase10 ? <div>10</div> : <div>{diemPLOMax}</div>} */}
          </div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      // const base10Score = (row.original[`plo_${plo.id}`] === 0 ? 0 : row.original[`plo_${plo.id}`] / listDiemPkMax[index] * 10);
      // const score = isBase10 ? base10Score : row.original[`plo_${plo.id}`];
      const score = row.original[`plo_${plo.id}`];
      // const cellClass = base10Score >= diemDat ? "bg-green-500 text-white" : "bg-red-500 text-white";
      const cellClass = score >= diemDat ? "bg-green-500 text-white" : "bg-red-500 text-white";
      return (
        <div className={score === "" ? "" : cellClass}>
          {score === "" ? "null" : score}
        </div>
      )
    }
  }))
]

export default function XetChuanDauRaPage() {
  const [data, setData] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [PLOs, setPLOs] = React.useState([])
  // const [listDiemPkMax, setListDiemPkMax] = React.useState([])
  // const [isBase10, setIsBase10] = React.useState(false)
  const [diemDat, setDiemDat] = React.useState(5.0)
  const [inputValue, setInputValue] = React.useState(diemDat);
  const [open, setOpen] = React.useState(false) // Use for combobox
  const [value, setValue] = React.useState(null) // Use for combobox
  const [comboBoxItems, setComboBoxItems] = React.useState([])
  const [nganhId, setNganhId] = React.useState(null)
  const [useDiemTam, setUseDiemTam] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const comboBoxItems = await getAllNganhs();
      const mappedComboBoxItems = comboBoxItems.map(nganh => ({ label: nganh.ten, value: nganh.id }));
      setComboBoxItems(mappedComboBoxItems);

      const [sinhViens, PLOs] = await Promise.all([
        getSinhViens(null, nganhId, null),
        getPLOsByNganhId(nganhId),
      ]);
      
      const newData = await Promise.all(sinhViens.map(async (sv) => {
        const ploScores = await Promise.all(PLOs.map(async (plo) => {
          let score = 0;
          try {
            score = await calculateDiemPLO(sv.id, plo.id, useDiemTam)
          }
          catch (error) {
            score = null;
          }
          console.log("calculateDiemPLO", sv.id, plo.id, score)
          return { [`plo_${plo.id}`]: score}
        }))
        return { ...sv, ...Object.assign({}, ...ploScores) }
      }))

      // const listDiemPkMax = await Promise.all(PLOs.map(async (plo) => {
      //   const maxScore = await calculateDiemPLOMax(plo.id);
      //   return maxScore;
      // }));
      
      setData(newData)
      setPLOs(PLOs)
      // setListDiemPLOMax(listDiemPkMax)
    }
    fetchData()
  }, [nganhId, useDiemTam])

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
  })

  return (
    <Layout>
      <h1>Tính điểm đạt chuẩn đầu ra của Nganh của Sinh Viên</h1>
      <div className="flex">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value !== null
                ? comboBoxItems.find((comboBoxItem) => comboBoxItem.value === value)?.label
                : "Chọn Ngành..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search comboBoxItem..." className="h-9" />
              <CommandList>
                <CommandEmpty>No comboBoxItem found.</CommandEmpty>
                <CommandGroup>
                  {comboBoxItems.map((comboBoxItem) => (
                    <CommandItem
                      key={comboBoxItem.value}
                      value={comboBoxItem.label}
                      onSelect={() => {
                        setValue(value === comboBoxItem.value ? null : comboBoxItem.value)
                        setOpen(false)
                      }}
                    >
                      {comboBoxItem.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === comboBoxItem.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button onClick={() => setNganhId(value)}>Go</Button>
      </div>
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
    </Layout>
  )
}

