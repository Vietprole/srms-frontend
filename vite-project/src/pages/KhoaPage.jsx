import Layout from "./Layout";
import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAllKhoas,
  deleteKhoa,
  
} from "@/api/api-khoa";
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
import { KhoaForm } from "@/components/KhoaForm";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function KhoaPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const khoas = await getAllKhoas();
    setData(khoas);
  };

  const createKhoaColumns = (handleEdit, handleDelete) => [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "maKhoa",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã Khoa
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("maKhoa")}</div>,
    },
    {
      accessorKey: "ten",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("ten")}</div>,
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
                    Sửa Khoa
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Khoa</DialogTitle>
                    <DialogDescription>Edit the current item.</DialogDescription>
                  </DialogHeader>
                  <KhoaForm khoa={item} handleEdit={handleEdit} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Xóa Khoa
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Khoa</DialogTitle>
                    <DialogDescription>
                      Delete the current item.
                    </DialogDescription>
                  </DialogHeader>
                  <p>Are you sure you want to delete this Khoa?</p>
                  <DialogFooter>
                    <Button type="submit" onClick={() => handleDelete(item.id)}>
                      Delete Khoa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem
                onSelect={() => navigate(`/nganh?khoaId=${item.id}`)}
              >
                Xem Ngành
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleDelete = async (id) => {
    try {
      await deleteKhoa(id);
      fetchData();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message.includes("Không tìm thấy Khoa")
          ? "Không tìm thấy Khoa"
          : "Khoa chứa các đối tượng con, không thể xóa",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (khoa) => {
    try {
      await updateKhoa(khoa);
      fetchData();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message.includes("Mã khoa đã tồn tại")
          ? "Mã khoa đã tồn tại"
          : "Khoa chứa các đối tượng con, không thể thay đổi mã khoa",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async (newKhoa) => {
    try {
      await createKhoa(newKhoa);
      fetchData();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message.includes("Tên khoa đã tồn tại")
          ? "Tên khoa đã tồn tại"
          : "Mã khoa đã tồn tại",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <DataTable
          entity="Khoa"
          createColumns={(handleEdit, handleDelete) =>
            createKhoaColumns(handleEdit, handleDelete)
          }
          data={data}
          fetchData={fetchData}
          deleteItem={handleDelete}
          columnToBeFiltered={"ten"}
          ItemForm={(props) => (
            <KhoaForm {...props} handleCreate={handleCreate} />
          )}
        />
      </div>
    </Layout>
  );
}
