import Layout from "./Layout";
import CRUDDataTable from "@/components/CRUDDataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllChucVus } from "@/api-new/api-chucvu";
import {
  getFilteredAccounts,
  // getAllTaiKhoans,
  deleteTaiKhoan,
} from "@/api-new/api-taikhoan";
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
import { resetPassword } from "@/api-new/api-taikhoan";
import { useToast } from "@/hooks/use-toast";

export default function QuanLyTaiKhoanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleIdParam = searchParams.get("roleId");
  const [data, setData] = useState([]);
  const [chucVuItems, setchucVuItems] = useState([]);
  const [roleId, setroleId] = useState(roleIdParam);
  const [comboBoxRoleId, setComboBoxRoleId] = useState(roleIdParam);
  const role = getRole();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const dataChucVu = await getAllChucVus();
    // Map chucvu items to be used in ComboBox
    const mappedComboBoxItems = dataChucVu.map((chucVu) => ({
      label: chucVu.displayName,
      value: chucVu.id,
    }));
    setchucVuItems(mappedComboBoxItems);
    const data = await getFilteredAccounts(roleId);
    setData(data);
  }, [roleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setroleId(comboBoxRoleId);
    if (comboBoxRoleId === null) {
      navigate(`/quanlytaikhoan`);
      return;
    }
    navigate(`/quanlytaikhoan?roleId=${comboBoxRoleId}`);
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
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên Đăng Nhập
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "roleName",
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
        <div className="px-4 py-2">{row.getValue("roleName")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        if (role === "AcademicAffairs") {
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
                      Sửa Tài Khoản
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Sửa Tài khoản</DialogTitle>
                      <DialogDescription>
                        Sửa tài khoản hiện tại
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
                      <DialogTitle>Xóa Tài khoản</DialogTitle>
                      <DialogDescription>
                        Xóa tài khoản hiện tại
                      </DialogDescription>
                    </DialogHeader>
                    <p>Bạn có chắc muốn xóa tài khoản này?</p>
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
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Sửa Tài Khoản
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sửa Tài khoản</DialogTitle>
                    <DialogDescription>
                      Sửa tài khoản hiện tại
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
                    <DialogTitle>Xóa Tài khoản</DialogTitle>
                    <DialogDescription>
                      Xóa tài khoản hiện tại
                    </DialogDescription>
                  </DialogHeader>
                  <p>Bạn có chắc muốn xóa tài khoản này?</p>
                  <DialogFooter>
                    <Button type="submit" onClick={() => handleDelete(item.id)}>
                      Xóa
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
                    {item.roleId === 4
                      ? `Gv@${item.username}`
                      : item.roleId === 5
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
            setItemId={setComboBoxRoleId}
            initialItemId={comboBoxRoleId}
            placeholder="Chọn chức vụ"
          />
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <div>
          <p>Mật khẩu Giảng viên mặc định là: Gv@ + Mã Giảng Viên</p>
          <p>Mật khẩu Sinh viên mặc định là: Sv@ + Mã Sinh Viên</p>
          <p>Mật khẩu Vai trò khác mặc định là: Password@123456</p>
        </div>
        <CRUDDataTable
          entity="Tài khoản"
          createColumns={createTaiKhoanColumns}
          data={data}
          setData={setData}
          fetchData={fetchData}
          deleteItem={deleteTaiKhoan}
          columnToBeFiltered={"name"}
          ItemForm={TaiKhoanForm}
        />
      </div>
    </Layout>
  );
}
