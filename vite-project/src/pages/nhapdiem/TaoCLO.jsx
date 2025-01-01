// import Layout from "./Layout";
import DataTable from "@/components/DataTable";
import { useParams } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  // updateCLO,
  deleteCLO,
  getCLOsByLopHocPhanId,
  // addCLO,
} from "@/api/api-clo";
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
import { CLOForm } from "@/components/CLOForm";
import { useState, useEffect } from "react";

const createCLOColumns = (handleEdit, handleDelete) => [
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
    accessorKey: "moTa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mô tả
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4 py-2">{row.getValue("moTa")}</div>,
  },
  {
    accessorKey: "lopHocPhanId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lớp học phần Id
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4 py-2">{row.getValue("lopHocPhanId")}</div>,
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
                  Sửa CLO
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Sửa CLO</DialogTitle>
                  <DialogDescription>
                    Sửa CLO hiện tại.
                  </DialogDescription>
                </DialogHeader>
                <CLOForm cLO={item} handleEdit={handleEdit} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Xóa CLO
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Xóa CLO</DialogTitle>
                  <DialogDescription>
                    Xóa CLO hiện tại.
                  </DialogDescription>
                </DialogHeader>
                <p>Bạn có chắc muốn xóa CLO này?</p>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => handleDelete(item.id)}
                  >
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

export default function CLOPage() {
  const { lopHocPhanId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const clos = await getCLOsByLopHocPhanId(lopHocPhanId);
      setData(clos);
    };
    fetchData();
  }, [lopHocPhanId]);

  const fetchData = async () => {
    const clos = await getCLOsByLopHocPhanId(lopHocPhanId);
    setData(clos);
  };

  return (
      <div className="w-full">
        <DataTable
          entity="CLO"
          createColumns={createCLOColumns}
          data={data}
          fetchData={fetchData}
          deleteItem={deleteCLO}
          columnToBeFiltered={"ten"}
          ItemForm={CLOForm}
        />
      </div>
  );
}
