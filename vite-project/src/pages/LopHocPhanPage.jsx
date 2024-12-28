import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAllLopHocPhans,
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
// import { format, parseISO } from 'date-fns';

export default function LopHocPhanPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNganhId, setSelectedNganhId] = useState(null);

    // const navigate = useNavigate();
    // const [searchParams] = useSearchParams();
    // const khoaIdParam = searchParams.get("khoaId");
    const [data, setData] = useState([]);
    // const [khoaItems, setKhoaItems] = useState([]);
    // const [khoaId, setKhoaId] = useState(khoaIdParam);
    // const [comboBoxKhoaId, setComboBoxKhoaId] = useState(khoaIdParam);
  
    const fetchData = useCallback(async () => {
      // const dataKhoa = await getAllKhoas();
      // // Map khoa items to be used in ComboBox
      // const mappedComboBoxItems = dataKhoa.map(khoa => ({ label: khoa.ten, value: khoa.id }));
      // setKhoaItems(mappedComboBoxItems);
      // const data = await getNganhs(khoaId);
      const data = await getAllLopHocPhans();
      setData(data);
    }, []);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
    // const handleGoClick = () => {
    //   setKhoaId(comboBoxKhoaId);
    //   if (comboBoxKhoaId === null) {
    //     navigate(`/nganh`);
    //     return;
    //   }
    //   navigate(`/nganh?khoaId=${comboBoxKhoaId}`);
    // };

  const createLopHocPhanColumns = (handleEdit, handleDelete, ) => [
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
      accessorKey: "hanDeXuatCongThucDiem",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Hạn Đề Xuất Công Thức Điểm
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("hanDeXuatCongThucDiem");
        const formattedDate = date ? 
          new Date(date).toLocaleDateString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
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
                    Sửa Lớp Học Phần
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Lop Hoc Phan</DialogTitle>
                    <DialogDescription>
                      Edit the current item.
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
                    <DialogTitle>Delete Lop Hoc Phan</DialogTitle>
                    <DialogDescription>
                      Delete the current item.
                    </DialogDescription>
                  </DialogHeader>
                  <p>Are you sure you want to delete this Lop Hoc Phan?</p>
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
              {/* <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Quản lý Sinh Viên
              </DropdownMenuItem> */}
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
        <DataTable
          entity="Lop Hoc Phan"
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
