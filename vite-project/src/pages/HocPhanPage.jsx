import Layout from "./Layout";
import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteHocPhan } from "@/api/api-hocphan";
import { addHocPhansToNganh } from "@/api/api-nganh";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { HocPhanForm } from "@/components/HocPhanForm";
import { useRef, useState, useEffect, useCallback } from "react";
import { getAllNganhs, removeHocPhanFromNganh } from "@/api/api-nganh";
import { getHocPhans } from "@/api/api-hocphan";
import { ComboBox } from "@/components/ComboBox";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllKhoas } from "@/api/api-khoa";
import { createSearchURL } from "@/utils/string";
import { Checkbox } from "@/components/ui/checkbox";

export default function HocPhanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nganhIdParam = searchParams.get("nganhId");
  const khoaIdParam = searchParams.get("khoaId");
  const addPLOFormRef = useRef(null);
  const managePLOFormRef = useRef(null);
  const [data, setData] = useState([]);
  const [nganhItems, setNganhItems] = useState([]);
  const [khoaItems, setKhoaItems] = useState([]);
  const [nganhId, setNganhId] = useState(nganhIdParam);
  const [khoaId, setKhoaId] = useState(khoaIdParam);
  const [comboBoxKhoaId, setComboBoxKhoaId] = useState(khoaIdParam);
  const [comboBoxNganhId, setComboBoxNganhId] = useState(nganhIdParam);
  const baseUrl = "/hocphan";

  const fetchData = useCallback(async () => {
    const dataNganh = await getAllNganhs();
    const mappedComboBoxItems = dataNganh.map(nganh => ({ label: nganh.ten, value: nganh.id }));
    setNganhItems(mappedComboBoxItems);
    const dataKhoa = await getAllKhoas();
    const mappedKhoaItems = dataKhoa.map(khoa => ({ label: khoa.ten, value: khoa.id }));
    setKhoaItems(mappedKhoaItems);
    const data = await getHocPhans(khoaId, nganhId, null);
    setData(data);
  }, [khoaId, nganhId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setNganhId(comboBoxNganhId);
    setKhoaId(comboBoxKhoaId);
    const url = createSearchURL(baseUrl, { nganhId: comboBoxNganhId, khoaId: comboBoxKhoaId });
    navigate(url);
  };

  const handleRemoveHocPhanFromNganh = (nganhId, itemId) => {
    removeHocPhanFromNganh(nganhId, itemId);
    fetchData();
  }

  const createHocPhanColumns = (handleEdit, handleDelete) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "maHocPhan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã Học Phần
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4 py-2">{row.getValue("maHocPhan")}</div>,
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
    accessorKey: "soTinChi",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số Tín Chỉ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4 py-2">{row.getValue("soTinChi")}</div>
    ),
  },
  {
    accessorKey: "laCotLoi",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Là Cốt Lõi
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4 py-2">{row.getValue("laCotLoi").toString()}</div>
    ),
  },
  {
    accessorKey: "tenKhoa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Khoa
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4 py-2">{row.getValue("tenKhoa")}</div>
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
                  Sửa Học Phần
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit HocPhan</DialogTitle>
                  <DialogDescription>Edit the current item.</DialogDescription>
                </DialogHeader>
                <HocPhanForm hocphan={item} handleEdit={handleEdit} />
              </DialogContent>
            </Dialog>
            {nganhIdParam && (
              <DropdownMenuItem onSelect={() => handleRemoveHocPhanFromNganh(nganhId, item.id)}>
                Bỏ Học Phần khỏi Ngành
              </DropdownMenuItem>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Xóa Học Phần
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator />
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Xóa học phần</DialogTitle>
                  <DialogDescription>
                    Xóa học phần hiện tại.
                  </DialogDescription>
                </DialogHeader>
                <p>Bạn có muốn xóa học phần này không?</p>
                <DialogFooter>
                  <Button type="submit" onClick={() => handleDelete(item.id)}>
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

  return (
    <Layout>
      <div className="w-full">
        <div className="flex">
          <ComboBox items={khoaItems} setItemId={setComboBoxKhoaId} initialItemId={khoaId} placeholder="Chọn Khoa"/>
          <ComboBox items={nganhItems} setItemId={setComboBoxNganhId} initialItemId={nganhId} placeholder="Chọn Ngành"/>
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <DataTable
          entity="Học phần"
          createColumns={createHocPhanColumns}
          data={data}
          fetchData={fetchData}
          deleteItem={deleteHocPhan}
          columnToBeFiltered={"ten"}
          ItemForm={HocPhanForm}
          hasCheckBox={true}
          parentEntity="Ngành"
          comboBoxItems={nganhItems}
          addItemsToParent={addHocPhansToNganh}
          name = "Tên Học Phần"
        />
      </div>
    </Layout>
  );
}
