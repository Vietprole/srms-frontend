import Layout from "./Layout";
import DataTable from "@/components/DataTable";
// import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getLopHocPhanChiTiet
} from "@/api/api-lophocphan";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { deleteBaiKiemTra } from "@/api/api-baikiemtra";
import { KhoaForm } from "@/components/KhoaForm";
// import { useNavigate } from "react-router-dom";

export default function LopHocPhanChiTietPage() {
  // const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const khoas = await getLopHocPhanChiTiet(1);
      setData(khoas);
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    const khoas = await getLopHocPhanChiTiet();
    setData(khoas);
  };
  const createLopHocPhanChiTietColumns = () => [
    {
      accessorKey: "maLopHocPhan",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã Lớp Học Phần
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("maLopHocPhan")}</div>,
    },
    {
      accessorKey: "tenLopHocPhan",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên lớp học phần
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("tenLopHocPhan")}</div>,
    },
    {
      accessorKey: "tenGiangVien",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên giảng viên
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("tenGiangVien")}</div>,
    },
    {
      accessorKey: "soLuongSinhVien",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số lượng sinh viên
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("tenGiangVien")}</div>,
    },
    {
      accessorKey: "namHoc",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Năm học
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("namHoc")}</div>,
    },
    {
      accessorKey: "tenHocKy",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên học kỳ
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("tenHocKy")}</div>,
    },
  ];
  return (
    <Layout>
      <div className="w-full">
        <DataTable
          entity="Khoa"
          createColumns={createLopHocPhanChiTietColumns}
          data={data}
          fetchData={fetchData}
          deleteItem={deleteBaiKiemTra}
          columnToBeFiltered={"tenHocKy"}
          ItemForm={KhoaForm}
        />
      </div>
    </Layout>
  );
}
