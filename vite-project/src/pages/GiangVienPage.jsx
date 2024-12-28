import Layout from "./Layout";
import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getGiangViens,
  deleteGiangVien,
} from "@/api/api-giangvien";
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
import { GiangVienForm } from "@/components/GiangVienForm";
import { getAllKhoas } from "@/api/api-khoa";
import { ComboBox } from "@/components/ComboBox";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllLopHocPhans } from "@/api/api-lophocphan";
import { createSearchURL } from "@/utils/string";
import { toast } from "react-toastify";

const createGiangVienColumns = (handleEdit, handleDelete) => [
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
    accessorKey: "tenKhoa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên Khoa
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4 py-2">{row.getValue("tenKhoa")}</div>,
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
                  Sửa Giảng Viên
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit GiangVien</DialogTitle>
                  <DialogDescription>
                    Edit the current GiangVien.
                  </DialogDescription>
                </DialogHeader>
                <GiangVienForm giangVien={item} handleEdit={handleEdit} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Xóa Giảng Viên
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete GiangVien</DialogTitle>
                  <DialogDescription>
                    Delete the current GiangVien.
                  </DialogDescription>
                </DialogHeader>
                <p>Are you sure you want to delete this GiangVien?</p>
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
    },
  },
];

export default function GiangVienPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lopHocPhanIdParam = searchParams.get("lopHocPhanId");
  const khoaIdParam = searchParams.get("khoaId");
  const [data, setData] = useState([]);
  const [khoaItems, setKhoaItems] = useState([]);
  const [lopHocPhanItems, setLopHocPhanItems] = useState([]);
  const [khoaId, setKhoaId] = useState(khoaIdParam);
  const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam);
  const [comboBoxKhoaId, setComboBoxKhoaId] = useState(khoaIdParam);
  const [comboBoxLopHocPhanId, setComboBoxLopHocPhanId] = useState(lopHocPhanIdParam);
  const baseUrl = "/giangvien";
  
  const fetchData = useCallback(async () => {
    const dataKhoa = await getAllKhoas();
    const mappedKhoaItems = dataKhoa.map(khoa => ({ label: khoa.ten, value: khoa.id }));
    setKhoaItems(mappedKhoaItems);

    const dataLopHocPhan = await getAllLopHocPhans();
    const mappedLopHocPhanItems = dataLopHocPhan.map(lhp => ({ label: lhp.ten, value: lhp.id }));
    setLopHocPhanItems(mappedLopHocPhanItems);

    const data = await getGiangViens(khoaId, lopHocPhanId);
    setData(data);
  }, [khoaId, lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setKhoaId(comboBoxKhoaId);
    setLopHocPhanId(comboBoxLopHocPhanId);
    const url = createSearchURL(baseUrl, { 
      khoaId: comboBoxKhoaId, 
      lopHocPhanId: comboBoxLopHocPhanId 
    });
    navigate(url);
  };

  const handleAddGiangVien = async (newGiangVien) => {
    try {
      await addGiangVien(newGiangVien);
      toast.success("Thêm giảng viên thành công!");
      fetchData();
    } catch (error) {
      toast.error("Thêm giảng viên thất bại!");
    }
  };

  const handleUpdateGiangVien = async (updatedGiangVien) => {
    try {
      await updateGiangVien(updatedGiangVien);
      toast.success("Cập nhật giảng viên thành công!");
      fetchData();
    } catch (error) {
      toast.error("Cập nhật giảng viên thất bại!");
    }
  };

  const handleDeleteGiangVien = async (id) => {
    try {
      await deleteGiangVien(id);
      toast.success("Xóa giảng viên thành công!");
      fetchData();
    } catch (error) {
      toast.error("Xóa giảng viên thất bại!");
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex space-x-4">
          <ComboBox 
            items={khoaItems} 
            setItemId={setComboBoxKhoaId} 
            initialItemId={khoaId} 
            placeholder="Chọn Khoa" 
          />
          <ComboBox 
            items={lopHocPhanItems} 
            setItemId={setComboBoxLopHocPhanId} 
            initialItemId={lopHocPhanId} 
            placeholder="Chọn Lớp Học Phần" 
          />
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <DataTable
          entity="Giang Vien"
          createColumns={createGiangVienColumns}
          data={data}
          fetchData={fetchData}
          deleteItem={handleDeleteGiangVien}
          columnToBeFiltered={"ten"}
          ItemForm={GiangVienForm}
        />
      </div>
    </Layout>
  );
}
