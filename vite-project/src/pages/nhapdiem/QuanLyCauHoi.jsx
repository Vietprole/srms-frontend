import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBaiKiemTrasByLopHocPhanId } from "@/api/api-baiKiemTra";
import {
  getCauHoisByBaiKiemTraId,
  // getAllCauHois,
  // deleteCauHoi,
} from "@/api/api-cauhoi";
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
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useReactTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { updateListCauHoi } from "@/api/api-baikiemtra";

export default function QuanLyCauHoi() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lopHocPhanId } = useParams();
  const baiKiemTraIdParam = searchParams.get("baiKiemTraId");
  const [data, setData] = useState([]);
  const [baiKiemTraItems, setBaiKiemTraItems] = useState([]);
  const [baiKiemTraId, setBaiKiemTraId] = useState(baiKiemTraIdParam);
  // const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam);
  const [comboBoxBaiKiemTraId, setComboBoxBaiKiemTraId] =
    useState(baiKiemTraIdParam);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [maxId, setMaxId] = useState(0);
  const columnToBeFiltered = "ten";
  const entity = "CauHoi";
  const ItemForm = CauHoiForm;

  const fetchData = useCallback(async () => {
    const dataBaiKiemTra = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
    // Map baiKiemTra items to be used in ComboBox
    const mappedComboBoxItems = dataBaiKiemTra.map((baiKiemTra) => ({
      label: baiKiemTra.loai,
      value: baiKiemTra.id,
    }));
    setBaiKiemTraItems(mappedComboBoxItems);
    const data = await getCauHoisByBaiKiemTraId(baiKiemTraId);
    
    const maxId = data.length > 0 
    ? Math.max(...data.map(item => item.id))
    : 0;
    
    console.log("maxId = ", maxId);
    setData(data);
    setMaxId(maxId);
  }, [baiKiemTraId, lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setBaiKiemTraId(comboBoxBaiKiemTraId);
    if (comboBoxBaiKiemTraId === "") {
      navigate(`.`);
      return;
    }
    navigate(`.?baiKiemTraId=${comboBoxBaiKiemTraId}`);
  };

  const handleAdd = (newItem) => {
    setMaxId(maxId + 1);
    console.log("maxId 96 ", maxId);
    setData([...data, newItem]);
  };
  
  const handleEdit = (editedItem) => {
    setData(
      data.map((item) => (item.id === editedItem.id ? editedItem : item))
    );
  };
  
  const handleDelete = async (itemId) => {
    setData(data.filter((item) => item.id !== itemId));
  };

  const handleSave = async () => {
    const tens = data.map(item => item.ten);
    const uniqueTens = new Set(tens);
    if (tens.length !== uniqueTens.size) {
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: "Không được trùng tên câu hỏi",
      });
      return;
    }

    let sum = 0;
    data.forEach(async (item) => {
      sum += item.trongSo;
    });
    console.log("data = ", data);

    console.log("sum - 10 = ", sum - 10);
    if (Math.abs(sum - 10) > 0.0001) {
      console.log("toast here")
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: "Tổng trọng số phải bằng 10",
      });
      return;
    }

    try {
      await updateListCauHoi(baiKiemTraId, data);
    }
    catch(error) {
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: error.message,
      });
      return;
    }
    toast({
      variant: "success",
      title: "Lưu thành công",
      description: "Danh sách câu hỏi đã được lưu",
    })
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
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "ten",
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
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("ten")}</div>,
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
      accessorKey: "thangDiem",
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
        <div className="px-4 py-2">{row.getValue("thangDiem")}</div>
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Sửa Câu Hỏi
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit CauHoi</DialogTitle>
                    <DialogDescription>
                      Edit the current item.
                    </DialogDescription>
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
                    <DialogTitle>Delete CauHoi</DialogTitle>
                    <DialogDescription>
                      Delete the current item.
                    </DialogDescription>
                  </DialogHeader>
                  <p>Are you sure you want to delete this CauHoi?</p>
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
          setItemId={setComboBoxBaiKiemTraId}
          initialItemId={comboBoxBaiKiemTraId}
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
                table.getColumn(`${columnToBeFiltered}`)?.getFilterValue() ?? ""
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
                <Button
                  variant="outline"
                  className="ml-2"
                  disabled={!lopHocPhanId}
                >
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
            <Button disabled={!lopHocPhanId} onClick={handleSave}>
              Lưu Câu Hỏi
            </Button>
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
  );
}
