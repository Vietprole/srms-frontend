import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getLopHocPhans,
  deleteLopHocPhan,
} from "@/api/api-lophocphan";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger, DropdownMenuSeparator,
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
import { LopHocPhanForm } from "@/components/LopHocPhanForm";
import Layout from "@/pages/Layout";
import { useCallback, useEffect, useState } from "react";
import EditSinhVienLopHocPhan from "@/components/EditSinhVienLopHocPhanForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ComboBox } from "@/components/ComboBox";
import { createSearchURL } from "@/utils/string";
import { getAllHocPhans } from "@/api/api-hocphan";
import { getAllHocKys } from "@/api/api-hocky";

export default function LopHocPhanPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNganhId, setSelectedNganhId] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hocphanIdParam = searchParams.get("hocphanId");
  const hockyIdParam = searchParams.get("hockyId");

  const [data, setData] = useState([]);
  const [hocPhanItems, setHocPhanItems] = useState([]);
  const [hocKyItems, setHocKyItems] = useState([]);
  const [hocphanId, setHocPhanId] = useState(hocphanIdParam);
  const [hockyId, setHocKyId] = useState(hockyIdParam);
  const [comboBoxHocPhanId, setComboBoxHocPhanId] = useState(hocphanIdParam);
  const [comboBoxHocKyId, setComboBoxHocKyId] = useState(hockyIdParam);
  const baseUrl = "/lophocphan";

  const fetchData = useCallback(async () => {
    const dataHocPhan = await getAllHocPhans();
    const mappedHocPhanItems = dataHocPhan.map(hp => ({ 
      label: hp.ten, 
      value: hp.id 
    }));
    setHocPhanItems(mappedHocPhanItems);

    const dataHocKy = await getAllHocKys();
    const mappedHocKyItems = dataHocKy.map(hk => ({ 
      label: hk.ten, 
      value: hk.id 
    }));
    setHocKyItems(mappedHocKyItems);

    const data = await getLopHocPhans(hocphanId, hockyId, null, null);
    setData(data);
  }, [hocphanId, hockyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setHocPhanId(comboBoxHocPhanId);
    setHocKyId(comboBoxHocKyId);
    const url = createSearchURL(baseUrl, { 
      hocphanId: comboBoxHocPhanId, 
      hockyId: comboBoxHocKyId 
    });
    navigate(url);
  };

  const createLopHocPhanColumns = (handleEdit, handleDelete, ) => [
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
      accessorKey: "maLopHocPhan",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã Lớp Học Phần
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("maLopHocPhan")}</div>,
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
      accessorKey: "tenHocPhan",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Học Phần
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("tenHocPhan")}</div>,
    },
    {
      accessorKey: "tenGiangVien",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Giảng Viên
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("tenGiangVien")}</div>,
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
                    Sửa Lớp Học Phần
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sửa Lớp học phần</DialogTitle>
                    <DialogDescription>
                      Sửa Lớp học phần hiện tại
                    </DialogDescription>
                  </DialogHeader>
                  <LopHocPhanForm lopHocPhan={item} handleEdit={handleEdit} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Xóa Lớp Học Phần
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator />
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Xóa Lớp học phần</DialogTitle>
                    <DialogDescription>
                      Xóa Lớp học phần hiện tại
                    </DialogDescription>
                  </DialogHeader>
                  <p>Bạn có chắc muốn xóa Lớp học phần này?</p>
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
              <DropdownMenuItem
                onSelect={(e) => {
                  setSelectedNganhId(item.id);
                  setModalOpen(true);
                }}
              >
                Xem Danh Sách Sinh Viên
              </DropdownMenuItem>
              
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div className="w-full">
      <Layout>
        <div className="flex mb-4">
          <ComboBox 
            items={hocPhanItems} 
            setItemId={setComboBoxHocPhanId} 
            initialItemId={hocphanId} 
            placeholder="Chọn Học Phần"
          />
          <ComboBox 
            items={hocKyItems} 
            setItemId={setComboBoxHocKyId} 
            initialItemId={hockyId} 
            placeholder="Chọn Học Kỳ"
          />
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <DataTable
          entity="Lớp Học Phần"
          createColumns={createLopHocPhanColumns}
          data={data}
          setData={setData}
          fetchData={fetchData}
          deleteItem={deleteLopHocPhan}
          columnToBeFiltered={"ten"}
          ItemForm={LopHocPhanForm}
        />
        {modalOpen && <EditSinhVienLopHocPhan setOpenModal={setModalOpen} lophocphanId={selectedNganhId} />}
      </Layout>
    </div>
  );
}
