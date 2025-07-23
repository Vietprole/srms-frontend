import Layout from "./Layout";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllClasses, updateCongThucDiem } from "@/api-new/api-class";
import {
  getBaiKiemTrasByLopHocPhanId,
  // getAllBaiKiemTras,
} from "@/api-new/api-baikiemtra";
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
import { BaiKiemTraForm } from "@/components/BaiKiemTraForm";
import { useState, useEffect, useCallback } from "react";
import { ComboBox } from "@/components/ComboBox";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useReactTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getAllBaiKiemTras } from "@/api-new/api-baikiemtra";
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
import BatchUpdateGradeCompositionModal from "@/components/BatchUpdateGradeCompositionModal";

export default function BaiKiemTraPage() {
  const navigate = useNavigate();
  // const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const lopHocPhanIdParam = searchParams.get("lopHocPhanId");
  const [data, setData] = useState([]);
  const [lophocphanItems, setLopHocPhanItems] = useState([]);
  const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam);
  const [comboBoxLopHocPhanId, setComboBoxLopHocPhanId] =
    useState(lopHocPhanIdParam);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [comboBoxItemId, setComboBoxItemId] = useState(null);
  const columnToBeFiltered = "type";
  const entity = "Thành phần đánh giá";
  const ItemForm = BaiKiemTraForm;
  const [maxId, setMaxId] = useState(0);

  const fetchClassData = useCallback(async () => {
    const dataLopHocPhan = await getAllClasses();
    // Map lophocphan items to be used in ComboBox
    const mappedComboBoxItems = dataLopHocPhan.map((lophocphan) => ({
      label: `${lophocphan.code} - ${lophocphan.name}`,
      value: lophocphan.id,
    }));
    setLopHocPhanItems(mappedComboBoxItems);
  }, []);

  const fetchExamData = useCallback(async () => {
    let data = [];
    if (lopHocPhanId === null) {
      // data = await getAllBaiKiemTras();
      data = [];
    } else {
      data = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
      data = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
    }
    const maxId =
      data.length > 0 ? Math.max(...data.map((item) => item.id)) : 0;
    setData(data);
    setMaxId(maxId);
  }, [lopHocPhanId]);

  // Fetch LopHocPhan data only once when component mounts
  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  // Fetch BaiKiemTra data whenever lopHocPhanId changes
  useEffect(() => {
    fetchClassData();
    fetchExamData();
  }, [fetchClassData, fetchExamData]);

  const handleGoClick = () => {
    setLopHocPhanId(comboBoxLopHocPhanId);
    if (comboBoxLopHocPhanId === null) {
      navigate(`/congthucdiem`);
      return;
    }
    navigate(`/congthucdiem?lopHocPhanId=${comboBoxLopHocPhanId}`);
  };

  const createBaiKiemTraColumns = (handleEdit, handleDelete) => [
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
      cell: ({ row }) => <div className="px-4 py-2">{row.index + 1}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Loại
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("type")}</div>
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
            Điểm bài/câu hỏi đánh giá (thang 10)
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("weight")}</div>
      ),
    },
    // {
    //   accessorKey: "weightDeXuat",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Điểm bài/câu hỏi đánh giá (thang 10) Đề Xuất
    //         <ArrowUpDown />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => (
    //     <div className="px-4 py-2">{row.getValue("weightDeXuat")}</div>
    //   ),
    // },
    {
      accessorKey: "scoreEntryStartDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngày Mở Nhập Điểm
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("scoreEntryStartDate");
        const formattedDate = date
          ? new Date(date).toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "";
        return <div className="px-4 py-2">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "scoreEntryDeadline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Hạn Nhập Điểm
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("scoreEntryDeadline");
        const formattedDate = date
          ? new Date(date).toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "";
        return <div className="px-4 py-2">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "scoreCorrectionDeadline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Hạn Đính Chính
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("scoreCorrectionDeadline");
        const formattedDate = date
          ? new Date(date).toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "";
        return <div className="px-4 py-2">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "confirmedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngày Xác Nhận
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("confirmedAt");
        const formattedDate = date
          ? new Date(date).toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "";
        return <div className="px-4 py-2">{formattedDate}</div>;
      },
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
                    Sửa Thành phần đánh giá
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sửa Thành phần đánh giá</DialogTitle>
                    <DialogDescription>
                      Sửa thành phần đánh giá hiện tại
                    </DialogDescription>
                  </DialogHeader>
                  <BaiKiemTraForm baiKiemTra={item} handleEdit={handleEdit} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Xóa Thành phần đánh giá
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Xóa Thành phần đánh giá</DialogTitle>
                    <DialogDescription>
                      Xóa thành phần đánh giá hiện tại
                    </DialogDescription>
                  </DialogHeader>
                  <p>Bạn có chắc muốn xóa thành phần đánh giá này?</p>
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

  const handleAdd = (newItem) => {
    setMaxId(maxId + 1);
    setData([...data, newItem]);
    toast.success("Tạo Thành phần đánh giá thành công");
  };

  const handleEdit = (editedItem) => {
    setData(
      data.map((item) => (item.id === editedItem.id ? editedItem : item))
    );
    toast.success("Sửa Thành phần đánh giá thành công");
  };

  async function handleDelete(itemId) {
    setData(data.filter((item) => item.id !== itemId));
    toast.success("Xoá Thành phần đánh giá thành công");
  }

  const handleSave = async () => {
    const types = data.map((item) => item.type);
    const uniqueTypes = new Set(types);
    if (types.length !== uniqueTypes.size) {
      toast.error("Không được trùng loại thành phần đánh giá");
      return;
    }

    let sum = 0;
    data.forEach(async (item) => {
      sum += item.weight;
    });

    if (sum !== 1) {
      toast.error("Tổng điểm bài/câu hỏi đánh giá (thang 10) phải bằng 1");
      return;
    }

    try {
      await updateCongThucDiem(lopHocPhanId, data);
      await fetchExamData();
    } catch (error) {
      await fetchExamData();
    }
  };

  const columns = createBaiKiemTraColumns(handleEdit, handleDelete);

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
    <Layout>
      <div className="w-full">
        <div className="flex">
          <ComboBox
            items={lophocphanItems}
            setItemId={setComboBoxLopHocPhanId}
            initialItemId={comboBoxLopHocPhanId}
            placeholder="Chọn lớp học phần"
            width="600px"
          />
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        {/* <h1>This is {entity} Page</h1> */}
        <div className="w-full">
          <div className="flex items-center justify-between py-1">
            <Input
              placeholder={`Tìm kiếm theo loại...`}
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mr-2">Chỉnh sửa hàng loạt</Button>
                </DialogTrigger>
                <DialogContent className="max-w-fit">
                  <DialogHeader>
                    <DialogTitle>
                      Chỉnh sửa công thức điểm hàng loạt
                    </DialogTitle>
                    <DialogDescription>
                      Chỉnh sửa công thức điểm cho nhiều lớp học phần
                    </DialogDescription>
                  </DialogHeader>
                  <BatchUpdateGradeCompositionModal />
                </DialogContent>
              </Dialog>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mr-2" disabled={!lopHocPhanId}>
                    Tạo {entity}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Tạo {entity}</DialogTitle>
                    <DialogDescription>Tạo {entity} mới</DialogDescription>
                  </DialogHeader>
                  <ItemForm
                    handleAdd={handleAdd}
                    setIsDialogOpen={setIsDialogOpen}
                    maxId={maxId}
                  />
                </DialogContent>
              </Dialog>
              <Button disabled={!lopHocPhanId} onClick={handleSave}>
                Lưu Công thức điểm
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
      </div>
    </Layout>
  );
}
