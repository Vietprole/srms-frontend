import Layout from "./Layout";
import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLopHocPhans } from "@/api/api-lophocphan";
import {
  getDiemDinhChinhs,
  // getAllDiemDinhChinhs,
  deleteDiemDinhChinh,
  acceptDiemDinhChinh,
} from "@/api/api-diemdinhchinh";
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
import { DiemDinhChinhForm } from "@/components/DiemDinhChinhForm";
import { useState, useEffect, useCallback } from "react";
import { ComboBox } from "@/components/ComboBox";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getRole, getGiangVienId } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

export default function DiemDinhChinhPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lophocphanIdParam = searchParams.get("lophocphanId");
  const [data, setData] = useState([]);
  const [lophocphanItems, setLopHocPhanItems] = useState([]);
  const [lophocphanId, setLopHocPhanId] = useState(lophocphanIdParam);
  const [comboBoxLopHocPhanId, setComboBoxLopHocPhanId] =
    useState(lophocphanIdParam);
  const role = getRole();
  const giangVienId = getGiangVienId() === 0 ? null : getGiangVienId();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    let dataLopHocPhan = await getLopHocPhans(null, null, null, null);
    if (giangVienId) {
      dataLopHocPhan = await getLopHocPhans(null, null, giangVienId, null);
    }
    // Map lophocphan items to be used in ComboBox
    const mappedComboBoxItems = dataLopHocPhan.map((lophocphan) => ({
      label: lophocphan.ten,
      value: lophocphan.id,
    }));
    setLopHocPhanItems(mappedComboBoxItems);
    const data = await getDiemDinhChinhs(lophocphanId, giangVienId);
    setData(data);
  }, [giangVienId, lophocphanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setLopHocPhanId(comboBoxLopHocPhanId);
    if (comboBoxLopHocPhanId === null) {
      navigate(`/diemdinhchinh`);
      return;
    }
    navigate(`/diemdinhchinh?lophocphanId=${comboBoxLopHocPhanId}`);
  };

  const handleAccept = async (id) => {
    try {
      await acceptDiemDinhChinh(id);
    } catch (error) {
      console.error("Error accepting records:", error);
      toast({
        title: "Lỗi xác nhận điểm",
        description: error.message,
        variant: "destructive",
      });
    }
    fetchData();
  }
  
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) : '';
  }

  // function that compare date to today and return the result
  const isDatePassed = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getTime() < today.getTime();
  }

  const createDiemDinhChinhColumns = (handleEdit, handleDelete) => {
    const baseColumns = [
      {
        accessorKey: "index",
        header: "STT",
        cell: ({ row }) => <div className="px-4 py-2">{row.index + 1}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "maSinhVien",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Mã Sinh Viên
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("maSinhVien")}</div>
        ),
      },
      {
        accessorKey: "tenSinhVien",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Tên Sinh Viên
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("tenSinhVien")}</div>
        ),
      },
      {
        accessorKey: "loaiBaiKiemTra",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Loại Bài Kiểm Tra
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("loaiBaiKiemTra")}</div>
        ),
      },
      {
        accessorKey: "tenCauHoi",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Tên Câu Hỏi
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("tenCauHoi")}</div>
        ),
      },
      {
        accessorKey: "diemCu",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Điểm Cũ
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => {
          if (row.getValue("diemCu") === null || row.getValue("diemCu") === -1) {
            return <div className="px-4 py-2">Chưa nhập</div>;
          }
          return <div className="px-4 py-2">{row.getValue("diemCu")}</div>;
        },
      },
      {
        accessorKey: "diemMoi",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Điểm Mới
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("diemMoi")}</div>
        ),
      },
    ];
    const giangVienColumns = [
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const item = row.original;
          if (isDatePassed(item.hanDinhChinh)) {
            return <div className="px-4 py-2">Hết hạn đính chính</div>;
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
                      Sửa Điểm Đính Chính
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Sửa Điểm Đính Chính</DialogTitle>
                      <DialogDescription>
                        Sửa điểm đính chính hiện tại
                      </DialogDescription>
                    </DialogHeader>
                    <DiemDinhChinhForm
                      diemDinhChinh={item}
                      handleEdit={handleEdit}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Hủy Đính Chính
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Hủy Điểm Đính Chính</DialogTitle>
                      <DialogDescription>
                        Hủy điểm đính chính này
                      </DialogDescription>
                    </DialogHeader>
                    <p>Bạn có chắc muốn hủy điểm đính chính này?</p>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => handleDelete(item.id)}
                      >
                        Hủy
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ]
    const adminColumns = [
      {
        accessorKey: "thoiDiemMo",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Thời Điểm Mở
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = formatDate(row.getValue("thoiDiemMo"));
          return <div className="px-4 py-2">{date}</div>;
        },
      },
      {
        accessorKey: "tenGiangVien",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Giảng Viên Mở
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("tenGiangVien")}</div>
        ),
      },
      {
        accessorKey: "thoiDiemDuyet",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Thời Điểm Duyệt
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = formatDate(row.getValue("thoiDiemDuyet"));
          return <div className="px-4 py-2">{date}</div>;
        },
      },
      {
        accessorKey: "tenNguoiDuyet",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Người Duyệt
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("tenNguoiDuyet")}</div>
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
                      Duyệt Đính Chính
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Duyệt Điểm Đính Chính này?</DialogTitle>
                      <DialogDescription>
                        Điểm Đính Chính sẽ trở thành Điểm Chính Thức
                      </DialogDescription>
                    </DialogHeader>
                    <p>Điểm Đính Chính đã duyệt sẽ trở thành Điểm Chính Thức, bạn có chắc muốn duyệt Điểm Đính Chính này?</p>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => handleAccept(item.id)}
                      >
                        Duyệt
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ]
    if (role === "GiangVien") return [...baseColumns, ...giangVienColumns];
    if (role === "Admin") return [...baseColumns, ...adminColumns];
    if (role === "PhongDaoTao") return [...baseColumns, ...adminColumns];
    return baseColumns;
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex">
          <ComboBox
            items={lophocphanItems}
            setItemId={setComboBoxLopHocPhanId}
            initialItemId={comboBoxLopHocPhanId}
          />
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <DataTable
          entity="DiemDinhChinh"
          createColumns={createDiemDinhChinhColumns}
          data={data}
          setData={setData}
          fetchData={fetchData}
          deleteItem={deleteDiemDinhChinh}
          columnToBeFiltered={"tenSinhVien"}
          ItemForm={DiemDinhChinhForm}
          hasCreateButton={false}
        />
      </div>
    </Layout>
  );
}
