import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteCLO,
  getCLOsByHocPhanId,
  addCLO,
  updateCLO,
} from "@/api/api-clo";
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
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComboBox } from "@/components/ComboBox";
import { getAllHocPhans } from "@/api/api-hocphan";
import { CLOForm } from "@/components/CLOForm";
import Layout from "@/pages/Layout";
import { useCallback } from "react";

const createColumns = (handleEdit, handleDelete) => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TT
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          Tên CLO
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "moTa",
    header: "Mô tả",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clo = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Sửa CLO
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sửa CLO</DialogTitle>
                  <DialogDescription>
                    Chỉnh sửa thông tin CLO
                  </DialogDescription>
                </DialogHeader>
                <CLOForm
                  cLO={clo}
                  handleEdit={handleEdit}
                  hocPhanId={clo.hocPhanId}
                />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Xóa CLO
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xóa CLO</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa CLO này?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(clo.id)}
                  >
                    Xóa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function QuanLyCLO() {
  const [data, setData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hocPhans, setHocPhans] = useState([]);
  const [selectedHocPhanId, setSelectedHocPhanId] = useState(null);

  const fetchData = useCallback(async () => {
    if (selectedHocPhanId) {
      const clos = await getCLOsByHocPhanId(selectedHocPhanId);
      setData(clos);
    }
  }, [selectedHocPhanId]);

  const handleAdd = async (values) => {
    try {
      await addCLO(values);
      setIsDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Error adding CLO:", error);
    }
  };

  const handleEdit = async (id, values) => {
    try {
      await updateCLO(id, values);
      await fetchData();
    } catch (error) {
      console.error("Error updating CLO:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCLO(id);
      await fetchData();
    } catch (error) {
      console.error("Error deleting CLO:", error);
    }
  };

  useEffect(() => {
    const fetchHocPhans = async () => {
      const data = await getAllHocPhans();
      const mappedComboBoxItems = data.map(hocPhan => ({ label: hocPhan.ten, value: hocPhan.id }));
      setHocPhans(mappedComboBoxItems);
    };
    fetchHocPhans();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, selectedHocPhanId]);

  const renderCLOForm = (props) => (
    <CLOForm {...props} hocPhanId={selectedHocPhanId} />
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <Label>Chọn lớp học phần:</Label>
          <ComboBox 
            items={hocPhans} 
            setItemId={setSelectedHocPhanId} 
            placeholder="Chọn lớp học phần..."
          />
        </div>

        <div className="mt-4">
          {selectedHocPhanId && (
            <DataTable
              entity="CLO"
              createColumns={createColumns}
              data={data}
              fetchData={fetchData}
              deleteItem={deleteCLO}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleAdd={handleAdd}
              ItemForm={renderCLOForm}
              setIsDialogOpen={setIsDialogOpen}
              isDialogOpen={isDialogOpen}
              showSearch={false}
            />
          )}
        </div>
      </div>
    </Layout>
  );
} 
