import Layout from "./Layout";
import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllKhoas } from "@/api/api-khoa";
import {
  getNganhs,
  deleteNganh,
  updateNganh,
} from "@/api/api-nganh";
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
import { NganhForm } from "@/components/NganhForm";
import { useState, useEffect, useCallback } from "react";
import { ComboBox } from "@/components/ComboBox";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EditNganhModal from "@/components/AddNganhForm";
import { useToast } from "@/hooks/use-toast";

export default function NganhPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNganhId, setSelectedNganhId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const khoaIdParam = searchParams.get("khoaId");
  const [data, setData] = useState([]);
  const [khoaItems, setKhoaItems] = useState([]);
  const [khoaId, setKhoaId] = useState(khoaIdParam);
  const [comboBoxKhoaId, setComboBoxKhoaId] = useState(khoaIdParam);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const dataKhoa = await getAllKhoas();
    const mappedComboBoxItems = dataKhoa.map(khoa => ({ label: khoa.ten, value: khoa.id }));
    setKhoaItems(mappedComboBoxItems);
    if (khoaId) {
      const data = await getNganhs(khoaId);
      setData(data);
      return;
    }
    const data = await getNganhs(null);
    setData(data);
  }, [khoaId]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleGoClick = () => {
    setKhoaId(comboBoxKhoaId);
    if (comboBoxKhoaId === null) {
      navigate(`/nganh`);
      return;
    }
    navigate(`/nganh?khoaId=${comboBoxKhoaId}`);
  };

  const handleEdit = async (id, nganh) => {
    try {
      await updateNganh(id, nganh);
      fetchData();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message.includes("Không tìm thấy Ngành") ? "Không tìm thấy Ngành" : "Mã ngành đã tồn tại",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNganh(id);
      fetchData();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message.includes("Không tìm thấy Ngành") ? "Không tìm thấy Ngành" : "Ngành chứa các đối tượng con, không thể xóa",
        variant: "destructive",
      });
    }
  };

  const createNganhColumns = (handleEdit, handleDelete) => [
    {
      accessorKey: "tt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TT
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="px-4 py-2">{row.index + 1}</div>,
    },
    {
      accessorKey: "maNganh",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã Ngành
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="px-4 py-2">{row.getValue("maNganh")}</div>,
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
      accessorKey: "tenKhoa",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Khoa
          <ArrowUpDown />
        </Button>
      ),
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
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Sửa Ngành
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sửa Ngành</DialogTitle>
                    <DialogDescription>
                      Sửa ngành hiện tại
                    </DialogDescription>
                  </DialogHeader>
                  <NganhForm nganh={item} handleEdit={handleEdit} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Xóa Ngành
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Xóa Ngành</DialogTitle>
                    <DialogDescription>
                      Xóa ngành hiện tại
                    </DialogDescription>
                  </DialogHeader>
                  <p>Bạn có chắc muốn xóa ngành này?</p>
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
                Xem Học Phần
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate(`/plo?nganhId=${item.id}`)}>
                Xem PLO
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <Layout>
      <div className="w-full">
        <div className="flex">
          <ComboBox items={khoaItems} setItemId={setComboBoxKhoaId} initialItemId={comboBoxKhoaId} placeholder="Chọn Khoa"/>
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <DataTable
          entity="Ngành"
          createColumns={createNganhColumns}
          data={data}
          setData={setData}
          fetchData={fetchData}
          deleteItem={handleDelete}
          columnToBeFiltered={"ten"}
          ItemForm={NganhForm}
        />
        {modalOpen && <EditNganhModal setOpenModal={setModalOpen} nganhId={selectedNganhId} />}
      </div>
    </Layout>
  );
}
