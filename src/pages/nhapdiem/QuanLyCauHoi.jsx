import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBaiKiemTrasByLopHocPhanId } from "@/api-new/api-baikiemtra";
import {
  getQuestionsByExamId,
  // getAllCauHois,
  // deleteCauHoi,
} from "@/api-new/api-cauhoi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CauHoiForm } from "@/components/CauHoiForm";
import { useState, useEffect, useCallback } from "react";
import { ComboBox } from "@/components/ComboBox";
import { useSearchParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useReactTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { updateQuestions } from "@/api-new/api-baikiemtra";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuanLyCauHoi() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lopHocPhanId } = useParams();
  const examIdParam = searchParams.get("examId");
  const [data, setData] = useState([]);
  const [baiKiemTraItems, setBaiKiemTraItems] = useState([]);
  const [examId, setExamId] = useState(examIdParam);
  // const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam);
  const [comboBoxExamId, setComboBoxExamId] = useState(examIdParam);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [maxId, setMaxId] = useState(0);
  const columnToBeFiltered = "name";
  const entity = "Câu Hỏi";
  const ItemForm = CauHoiForm;

  const fetchData = useCallback(async () => {
    const dataBaiKiemTra = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
    // Map baiKiemTra items to be used in ComboBox
    const mappedComboBoxItems = dataBaiKiemTra.map((baiKiemTra) => ({
      label: baiKiemTra.type,
      value: baiKiemTra.id,
    }));
    setBaiKiemTraItems(mappedComboBoxItems);
    const data = await getQuestionsByExamId(examId);

    const maxId =
      data.length > 0 ? Math.max(...data.map((item) => item.id)) : 0;

    console.log("maxId = ", maxId);
    setData(data);
    setMaxId(maxId);
  }, [examId, lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setExamId(comboBoxExamId);
    if (comboBoxExamId === "") {
      navigate(`.`);
      return;
    }
    navigate(`.?examId=${comboBoxExamId}`);
  };

  const handleAdd = (newItem) => {
    setMaxId(maxId + 1);
    console.log("maxId 96 ", maxId);
    setData([...data, newItem]);
    toast.success("Tạo câu hỏi thành công");
  };

  const handleEdit = (editedItem) => {
    setData(
      data.map((item) => (item.id === editedItem.id ? editedItem : item))
    );
    toast.success("Sửa câu hỏi thành công");
  };

  const handleDelete = async (itemId) => {
    setData(data.filter((item) => item.id !== itemId));
    toast.success("Xoá câu hỏi thành công");
  };

  const handleSave = async () => {
    const tens = data.map((item) => item.name);
    const uniqueTens = new Set(tens);
    if (tens.length !== uniqueTens.size) {
      toast.error("Không được trùng tên câu hỏi");
      return;
    }

    let sum = 0;
    data.forEach(async (item) => {
      sum += item.weight;
    });
    console.log("data = ", data);

    console.log("sum - 10 = ", sum - 10);
    if (Math.abs(sum - 10) > 0.0001) {
      console.log("toast here");
      toast.error("Tổng trọng số phải bằng 10");
      return;
    }

    try {
      await updateQuestions(examId, data);
    } catch (error) {
      await fetchData();
      return;
    }
    // toast.success("Danh sách câu hỏi đã được lưu");
    await fetchData();
  };

  const createCauHoiColumns = (handleEdit, handleDelete) => [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Id
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.index + 1}</div>,
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
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "weight",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Trọng Số
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("weight")}</div>
      ),
    },
    {
      accessorKey: "scale",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Thang Điểm
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("scale")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Sửa Câu Hỏi
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sửa câu hỏi</DialogTitle>
                    <DialogDescription>Sửa câu hỏi hiện tại</DialogDescription>
                  </DialogHeader>
                  <CauHoiForm cauHoi={item} handleEdit={handleEdit} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Xóa Câu Hỏi
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Xóa câu hỏi</DialogTitle>
                    <DialogDescription>Xóa câu hỏi hiện tại</DialogDescription>
                  </DialogHeader>
                  <p>Bạn có chắc muốn xóa câu hỏi này?</p>
                  <DialogFooter>
                    <Button type="submit" onClick={() => handleDelete(item.id)}>
                      Xóa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const columns = createCauHoiColumns(handleEdit, handleDelete);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex">
        <ComboBox
          items={baiKiemTraItems}
          setItemId={setComboBoxExamId}
          initialItemId={comboBoxExamId}
          placeholder="Chọn bài kiểm tra"
        />
        <Button onClick={handleGoClick}>Go</Button>
      </div>
      <>
        {/* <h1>This is {entity} Page</h1> */}
        <div className="w-full">
          <div className="flex items-center justify-between py-1">
            <Input
              placeholder={`Tìm kiếm...`}
              value={
                table.getColumn(`${columnToBeFiltered}`)?.getFilterValue() ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(`${columnToBeFiltered}`)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Hiện cột <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu> */}
            <div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="mr-2"
                    disabled={!lopHocPhanId || !examId}
                  >
                    Tạo {entity}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Tạo {entity}</DialogTitle>
                    <DialogDescription>Tạo {entity} mới.</DialogDescription>
                  </DialogHeader>
                  <ItemForm
                    handleAdd={handleAdd}
                    setIsDialogOpen={setIsDialogOpen}
                    maxId={maxId}
                  />
                </DialogContent>
              </Dialog>
              <Button disabled={!lopHocPhanId || !examId} onClick={handleSave}>
                Lưu Câu Hỏi
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead className="px-2" key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
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
                        <TableCell key={cell.id}>
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
          <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected. */}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Số dòng mỗi trang</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Trang {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
