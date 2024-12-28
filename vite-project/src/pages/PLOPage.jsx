import Layout from "./Layout";
import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPLOs,
  deletePLO,
  addPLO,
  updatePLO,
} from "@/api/api-plo";
import { getAllNganhs } from "@/api/api-nganh";
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
import { PLOForm } from "@/components/PLOForm";
import { ComboBox } from "@/components/ComboBox";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const createPLOColumns = (handleEdit, handleDelete) => [
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
    accessorKey: "tenNganh",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên Ngành
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4 py-2">{row.getValue("tenNganh")}</div>,
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
                  Sửa PLO
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit PLO</DialogTitle>
                  <DialogDescription>
                    Edit the current PLO.
                  </DialogDescription>
                </DialogHeader>
                <PLOForm pLO={item} handleEdit={handleEdit} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Xóa PLO
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete PLO</DialogTitle>
                  <DialogDescription>
                    Delete the current PLO.
                  </DialogDescription>
                </DialogHeader>
                <p>Are you sure you want to delete this PLO?</p>
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

export default function PLOPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nganhIdParam = searchParams.get("nganhId");
  const [data, setData] = useState([]);
  const [nganhItems, setNganhItems] = useState([]);
  const [nganhId, setNganhId] = useState(nganhIdParam);
  const [comboBoxNganhId, setComboBoxNganhId] = useState(nganhIdParam);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const dataNganh = await getAllNganhs();
    const mappedComboBoxItems = dataNganh.map(nganh => ({ label: nganh.ten, value: nganh.id }));
    setNganhItems(mappedComboBoxItems);
    const data = await getPLOs(nganhId);
    setData(data);
  }, [nganhId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setNganhId(comboBoxNganhId);
    if (comboBoxNganhId === null) {
      navigate(`/plo`);
      return;
    }
    navigate(`/plo?nganhId=${comboBoxNganhId}`);
  };

  const handleAdd = async (newItem) => {
    try {
      const createdPLO = await addPLO(newItem);
      toast({
        title: "Tạo PLO thành công",
        description: "PLO mới đã được tạo.",
      });
      setData([...data, createdPLO]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể tạo PLO.",
      });
    }
  };

  const handleEdit = async (editedItem) => {
    try {
      const updatedPLO = await updatePLO(editedItem.id, editedItem);
      toast({
        title: "Cập nhật PLO thành công",
        description: "PLO đã được cập nhật.",
      });
      setData(
        data.map((item) => (item.id === updatedPLO.id ? updatedPLO : item))
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể cập nhật PLO.",
      });
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex">
          <ComboBox items={nganhItems} setItemId={setComboBoxNganhId} initialItemId={comboBoxNganhId} placeholder="Chọn Ngành"/>
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <DataTable
          entity="PLO"
          createColumns={createPLOColumns}
          data={data}
          setData={setData}
          fetchData={fetchData}
          deleteItem={deletePLO}
          columnToBeFiltered={"ten"}
          ItemForm={PLOForm}
        />
      </div>
    </Layout>
  );
}
