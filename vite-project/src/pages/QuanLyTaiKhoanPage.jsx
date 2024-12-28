import Layout from "./Layout";
import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllChucVus } from "@/api/api-chucvu";
import {
  getTaiKhoans,
  // getAllTaiKhoans,
  deleteTaiKhoan,
} from "@/api/api-taikhoan";
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
import { TaiKhoanForm } from "@/components/TaiKhoanForm";
import { useState, useEffect, useCallback } from "react";
import { ComboBox } from "@/components/ComboBox";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getRole } from "@/utils/storage";
import { resetPassword } from "@/api/api-taikhoan";
import { useToast } from "@/hooks/use-toast";

export default function QuanLyTaiKhoanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chucVuIdParam = searchParams.get("chucVuId");
  const [data, setData] = useState([]);
  const [chucVuItems, setchucVuItems] = useState([]);
  const [chucVuId, setchucVuId] = useState(chucVuIdParam);
  const [comboBoxChucVuId, setComboBoxChucVuId] = useState(chucVuIdParam);
  const role = getRole();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const dataChucVu = await getAllChucVus();
    // Map chucvu items to be used in ComboBox
    const mappedComboBoxItems = dataChucVu.map((chucVu) => ({
      label: chucVu.tenChucVu,
      value: chucVu.id,
    }));
    setchucVuItems(mappedComboBoxItems);
    const data = await getTaiKhoans(chucVuId);
    setData(data);
  }, [chucVuId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setchucVuId(comboBoxChucVuId);
    if (comboBoxChucVuId === null) {
      navigate(`/quanlytaikhoan`);
      return;
    }
    navigate(`/quanlytaikhoan?chucVuId=${comboBoxChucVuId}`);
  };

  const handleReset = async (id) => {
    try {
      await resetPassword(id);
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Thành công",
      description: "Đặt lại mật khẩu thành công",
      variant: "success",
    });
  };

  const createTaiKhoanColumns = (handleEdit, handleDelete) => [
    {
      accessorKey: "TT",
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
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "tenChucVu",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Chức Vụ
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("tenChucVu")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        if (role === "PhongDaoTao") {
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
                      Sửa Tài Khoản
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit TaiKhoan</DialogTitle>
                      <DialogDescription>
                        Edit the current item.
                      </DialogDescription>
                    </DialogHeader>
                    <TaiKhoanForm taiKhoan={item} handleEdit={handleEdit} />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Xóa Tài Khoản
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete TaiKhoan</DialogTitle>
                      <DialogDescription>
                        Delete the current item.
                      </DialogDescription>
                    </DialogHeader>
                    <p>Are you sure you want to delete this TaiKhoan?</p>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

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
                    Sửa Tài Khoản
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit TaiKhoan</DialogTitle>
                    <DialogDescription>
                      Edit the current item.
                    </DialogDescription>
                  </DialogHeader>
                  <TaiKhoanForm taiKhoan={item} handleEdit={handleEdit} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Xóa Tài Khoản
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete TaiKhoan</DialogTitle>
                    <DialogDescription>
                      Delete the current item.
                    </DialogDescription>
                  </DialogHeader>
                  <p>Are you sure you want to delete this TaiKhoan?</p>
                  <DialogFooter>
                    <Button type="submit" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Đặt lại Mật Khẩu
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Đặt lại mật khẩu</DialogTitle>
                    <DialogDescription>
                      Đặc lại mật khẩu thành mặc định
                    </DialogDescription>
                  </DialogHeader>
                  <p>
                    Đặt mật khẩu của tài khoản này thành{" "}
                    {item.chucVuId === 2
                      ? `Gv@${item.username}`
                      : item.chucVuId === 3
                      ? `Sv@${item.username}`
                      : "Password@123456"}
                  </p>
                  <DialogFooter>
                    <Button type="submit" onClick={() => handleReset(item.id)}>
                      Đặt lại
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

  console.log("chucVuItems: ", chucVuItems);

  return (
    <Layout>
      <div className="w-full">
        <div className="flex">
          <ComboBox
            items={chucVuItems}
            setItemId={setComboBoxChucVuId}
            initialItemId={comboBoxChucVuId}
          />
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <div>
          <p>Mật khẩu Giảng viên mặc định là: Gv@ + Mã Giảng Viên</p>
          <p>Mật khẩu Sinh viên mặc định là: Sv@ + Mã Sinh Viên</p>
        </div>
        <DataTable
          entity="TaiKhoan"
          createColumns={createTaiKhoanColumns}
          data={data}
          setData={setData}
          fetchData={fetchData}
          deleteItem={deleteTaiKhoan}
          columnToBeFiltered={"ten"}
          ItemForm={TaiKhoanForm}
        />
      </div>
    </Layout>
  );
}
