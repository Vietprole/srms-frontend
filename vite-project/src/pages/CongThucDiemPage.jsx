import Layout from "./Layout";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllLopHocPhans, updateCongThucDiem } from "@/api/api-lophocphan";
import {
  getBaiKiemTrasByLopHocPhanId,
  // getAllBaiKiemTras,
} from "@/api/api-baikiemtra";
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
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useReactTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getAllBaiKiemTras } from "@/api/api-baikiemtra";

export default function BaiKiemTraPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const lopHocPhanIdParam = searchParams.get("lopHocPhanId");
  const [data, setData] = useState([]);
  const [lophocphanItems, setLopHocPhanItems] = useState([]);
  const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam);
  const [comboBoxLopHocPhanId, setComboBoxLopHocPhanId] = useState(lopHocPhanIdParam);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [comboBoxItemId, setComboBoxItemId] = useState(null);
  const columnToBeFiltered = "loai";
  const entity = "BaiKiemTra";
  const ItemForm = BaiKiemTraForm;
  const [maxId, setMaxId] = useState(0);

  const fetchData = useCallback(async () => {
    const dataLopHocPhan = await getAllLopHocPhans();
    // Map lophocphan items to be used in ComboBox
    const mappedComboBoxItems = dataLopHocPhan.map((lophocphan) => ({
      label: lophocphan.ten,
      value: lophocphan.id,
    }));
    setLopHocPhanItems(mappedComboBoxItems);
    let data = [];
    if (lopHocPhanId === null) {
      data = await getAllBaiKiemTras();
    } else {
      data = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
    }
    const maxId = data.length > 0 
    ? Math.max(...data.map(item => item.id))
    : 0;
    setData(data);
    setMaxId(maxId);
  }, [lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "loai",
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
        <div className="px-4 py-2">{row.getValue("loai")}</div>
      ),
    },
    {
      accessorKey: "trongSo",
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
        <div className="px-4 py-2">{row.getValue("trongSo")}</div>
      ),
    },
    {
      accessorKey: "trongSoDeXuat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Trọng Số Đề Xuất
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("trongSoDeXuat")}</div>
      ),
    },
    {
      accessorKey: "ngayMoNhapDiem",
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
        const date = row.getValue("ngayMoNhapDiem");
        const formattedDate = date ? 
          new Date(date).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }) : '';
        return <div className="px-4 py-2">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "hanNhapDiem",
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
        const date = row.getValue("hanNhapDiem");
        const formattedDate = date ? 
          new Date(date).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }) : '';
        return <div className="px-4 py-2">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "hanDinhChinh",
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
        const date = row.getValue("hanDinhChinh");
        const formattedDate = date ? 
          new Date(date).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }) : '';
        return <div className="px-4 py-2">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "ngayXacNhan",
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
        const date = row.getValue("ngayXacNhan");
        const formattedDate = date ? 
          new Date(date).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }) : '';
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Sửa Bài Kiểm Tra
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit BaiKiemTra</DialogTitle>
                    <DialogDescription>
                      Edit the current item.
                    </DialogDescription>
                  </DialogHeader>
                  <BaiKiemTraForm baiKiemTra={item} handleEdit={handleEdit}/>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Xóa Bài Kiểm Tra
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete BaiKiemTra</DialogTitle>
                    <DialogDescription>
                      Delete the current item.
                    </DialogDescription>
                  </DialogHeader>
                  <p>Are you sure you want to delete this BaiKiemTra?</p>
                  <DialogFooter>
                    <Button type="submit" onClick={() => handleDelete(item.id)}>
                      Delete
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
  };
  
  const handleEdit = (editedItem) => {
    setData(
      data.map((item) => (item.id === editedItem.id ? editedItem : item))
    );
  };
  
  async function handleDelete(itemId) {
    setData(data.filter((item) => item.id !== itemId));
  }

  const handleSave = async () => {
    const loais = data.map(item => item.loai);
    const uniqueLoais = new Set(loais);
    if (loais.length !== uniqueLoais.size) {
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: "Không được trùng loại bài kiểm tra",
      });
      return;
    }

    let sum = 0;
    data.forEach(async (item) => {
      sum += item.trongSo;
    });

    if (sum !== 1){
      console.log("toast here")
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: "Tổng trọng số phải bằng 1",
      });
      return;
    }

    await updateCongThucDiem(lopHocPhanId, data);
    toast({
      title: "Lưu thành công",
      description: "Công thức điểm đã được lưu",
      variant: "success",
    })
    await fetchData();
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
          />
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <>
          {/* <h1>This is {entity} Page</h1> */}
          <div className="w-full">
            <div className="flex items-center py-4">
              <Input
                placeholder={`Filter ${columnToBeFiltered}s...`}
                value={
                  table.getColumn(`${columnToBeFiltered}`)?.getFilterValue() ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn(`${columnToBeFiltered}`)
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
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
              </DropdownMenu>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-2" disabled={!lopHocPhanId}>
                    Tạo {entity}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add {entity}</DialogTitle>
                    <DialogDescription>
                      Add a new {entity} to the list.
                    </DialogDescription>
                  </DialogHeader>
                  <ItemForm
                    handleAdd={handleAdd}
                    setIsDialogOpen={setIsDialogOpen}
                    maxId={maxId}
                  />
                </DialogContent>
              </Dialog>
              <Button disabled={!lopHocPhanId} onClick={handleSave}>Lưu Công thức điểm</Button>
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
                          <TableCell className="px-2 py-4" key={cell.id}>
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
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      </div>
    </Layout>
  );
}
