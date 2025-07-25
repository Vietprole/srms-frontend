import CRUDDataTable from "@/components/CRUDDataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFilteredClasses, deleteClass } from "@/api-new/api-class";
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
} from "@/components/ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { LopHocPhanForm } from "@/components/LopHocPhanForm";
import Layout from "@/pages/Layout";
import { useCallback, useEffect, useState } from "react";
import EditSinhVienLopHocPhan from "@/components/EditSinhVienLopHocPhanForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ComboBox } from "@/components/ComboBox";
import { createSearchURL } from "@/utils/string";
import { getAllCourses } from "@/api-new/api-course";
import { getAllSemesters } from "@/api-new/api-semester";
// import ManageStudentsOfClassModal from "@/components/ManageStudentsOfClassModal";
import { getRole, getTeacherId } from "@/utils/storage";
import { BatchUpdateGradeCompositionForm } from "./BatchUpdateGradeCompositionForm";
import { getDistinctExamTypesByClassIds } from "@/api/api-exams";

export default function BatchUpdateGradeCompositionModal({ setIsDialogOpen }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hocphanIdParam = searchParams.get("courseId");
  const hockyIdParam = searchParams.get("semesterId");

  const [data, setData] = useState([]);
  const [hocPhanItems, setHocPhanItems] = useState([]);
  const [hocKyItems, setHocKyItems] = useState([]);
  const [hocphanId, setHocPhanId] = useState(hocphanIdParam);
  const [hockyId, setHocKyId] = useState(hockyIdParam);
  const [comboBoxHocPhanId, setComboBoxHocPhanId] = useState(hocphanIdParam);
  const [comboBoxHocKyId, setComboBoxHocKyId] = useState(hockyIdParam);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const baseUrl = "/lophocphan";

  const role = getRole();
  const teacherId = getTeacherId();

  const fetchData = useCallback(async () => {
    const dataHocPhan = await getAllCourses();
    const mappedHocPhanItems = dataHocPhan.map((hp) => ({
      label: `${hp.code} - ${hp.name}`,
      value: hp.id,
    }));
    setHocPhanItems(mappedHocPhanItems);

    const dataHocKy = await getAllSemesters();
    const mappedHocKyItems = dataHocKy.map((hk) => ({
      label: hk.displayName,
      value: hk.id,
    }));
    setHocKyItems(mappedHocKyItems);

    const data = await getFilteredClasses(hocphanId, hockyId, teacherId, null);
    setData(data);
  }, [hocphanId, hockyId, teacherId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setHocPhanId(comboBoxHocPhanId);
    setHocKyId(comboBoxHocKyId);
    // const url = createSearchURL(baseUrl, {
    //   courseId: comboBoxHocPhanId,
    //   semesterId: comboBoxHocKyId,
    // });
    // navigate(url);
  };

  const createLopHocPhanColumns = (handleEdit, handleDelete) => [
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
      accessorKey: "tt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          STT
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="px-4 py-2">{row.index + 1}</div>,
    },
    {
      accessorKey: "code",
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
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("code")}</div>
      ),
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
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "courseName",
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
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("courseName")}</div>
      ),
    },
    {
      accessorKey: "teacherName",
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
      cell: ({ row }) => (
        <div className="px-4 py-2">{row.getValue("teacherName")}</div>
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
                    <Button type="submit" onClick={() => handleDelete(item.id)}>
                      Xóa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {(role === "AcademicAffairs" || role === "Admin") && (
                <DropdownMenuItem
                  onSelect={() =>
                    navigate(`/congthucdiem?lopHocPhanId=${item.id}`)
                  }
                >
                  Xem Công thức điểm
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onSelect={() =>
                  navigate(`/nhapdiem/${item.id}/quan-ly-cau-hoi`)
                }
              >
                Nhập điểm
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div className="flex gap-4 max-h-full">
      <div className="">
        <div className="flex">
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
        <CRUDDataTable
          entity="Lớp Học Phần"
          createColumns={createLopHocPhanColumns}
          data={data}
          setData={setData}
          fetchData={fetchData}
          deleteItem={deleteClass}
          columnToBeFiltered={"name"}
          ItemForm={LopHocPhanForm}
          setSelectedItemIds={setSelectedClassIds}
          hasCreateButton={false}
        />
      </div>
      <div className="w-[600px]">
        <BatchUpdateGradeCompositionForm
          classIds={selectedClassIds}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </div>
  );
}
