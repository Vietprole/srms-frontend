import Layout from "./Layout";
import CRUDDataTable from "@/components/CRUDDataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFilteredClasses } from "@/api-new/api-class";
import {
  getDiemDinhChinhs,
  // getAllDiemDinhChinhs,
  deleteDiemDinhChinh,
  acceptDiemDinhChinh,
} from "@/api-new/api-diemdinhchinh";
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
import { getRole, getTeacherId } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { CorrectedResultDocument } from "@/components/CorrectedResultDocument";

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
  const giangVienId = getTeacherId() === 0 ? null : getTeacherId();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    let dataLopHocPhan = await getFilteredClasses(null, null, null, null);
    if (giangVienId) {
      dataLopHocPhan = await getFilteredClasses(null, null, giangVienId, null);
    }
    // Map lophocphan items to be used in ComboBox
    const mappedComboBoxItems = dataLopHocPhan.map((lophocphan) => ({
      label: `${lophocphan.code} - ${lophocphan.name}`,
      value: lophocphan.id,
    }));
    setLopHocPhanItems(mappedComboBoxItems);
    console.log("giangVienId", giangVienId);
    const data = await getDiemDinhChinhs(lophocphanId, giangVienId);
    console.log("data", data);
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
  };

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "";
  };

  // function that compare date to today and return the result
  const isDatePassed = (dateString) => {
    if (!dateString) return true;

    // Convert both to UTC for proper comparison
    const today = new Date();

    // Force interpretation in UTC
    const date = new Date(dateString + "Z"); // Adding Z forces UTC interpretation

    console.log("Deadline (local):", date.toLocaleString());
    console.log("Today (local):", today.toLocaleString());

    return date.getTime() < today.getTime();
  };

  const createDiemDinhChinhColumns = (handleEdit, handleDelete) => {
    const baseColumns = [
      {
        accessorKey: "index",
        header: "STT",
        cell: ({ row }) => <div className="px-4 py-2">{row.index + 1}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "classCode",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Mã Lớp Học Phần
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("classCode")}</div>
        ),
      },
      {
        accessorKey: "className",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Tên Lớp Học Phần
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("className")}</div>
        ),
      },
      {
        accessorKey: "studentCode",
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
          <div className="px-4 py-2">{row.getValue("studentCode")}</div>
        ),
      },
      {
        accessorKey: "studentName",
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
          <div className="px-4 py-2">{row.getValue("studentName")}</div>
        ),
      },
      {
        accessorKey: "examType",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Loại Thành phần đánh giá
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("examType")}</div>
        ),
      },
      {
        accessorKey: "questionName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Tên Bài/câu hỏi đánh giá
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("questionName")}</div>
        ),
      },
      {
        accessorKey: "oldScore",
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
          if (
            row.getValue("oldScore") === null ||
            row.getValue("oldScore") === -1
          ) {
            return <div className="px-4 py-2">Chưa nhập</div>;
          }
          return <div className="px-4 py-2">{row.getValue("oldScore")}</div>;
        },
      },
      {
        accessorKey: "newScore",
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
          <div className="px-4 py-2">{row.getValue("newScore")}</div>
        ),
      },
      {
        accessorKey: "oldTotalScore",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Điểm Tổng Cũ
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("oldTotalScore")}</div>
        ),
      },
      {
        accessorKey: "newTotalScore",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Điểm Tổng Mới
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("newTotalScore")}</div>
        ),
      },
    ];
    const giangVienColumns = [
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const item = row.original;
          if (isDatePassed(item.scoreCorrectionDeadline)) {
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
    ];
    const adminColumns = [
      {
        accessorKey: "openAt",
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
          const date = formatDate(row.getValue("openAt"));
          return <div className="px-4 py-2">{date}</div>;
        },
      },
      {
        accessorKey: "teacherName",
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
          <div className="px-4 py-2">{row.getValue("teacherName")}</div>
        ),
      },
      {
        accessorKey: "approveAt",
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
          const date = formatDate(row.getValue("approveAt"));
          return <div className="px-4 py-2">{date}</div>;
        },
      },
      {
        accessorKey: "approveByUserName",
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
          <div className="px-4 py-2">{row.getValue("approveByUserName")}</div>
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
                    <p>
                      Điểm Đính Chính đã duyệt sẽ trở thành Điểm Chính Thức, bạn
                      có chắc muốn duyệt Điểm Đính Chính này?
                    </p>
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
    ];
    if (role === "Teacher") return [...baseColumns, ...giangVienColumns];
    if (role === "Admin") return [...baseColumns, ...adminColumns];
    if (role === "AcademicAffairs") return [...baseColumns, ...adminColumns];
    return baseColumns;
  };

  return (
    <Layout>
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <ComboBox
              items={lophocphanItems}
              setItemId={setComboBoxLopHocPhanId}
              initialItemId={comboBoxLopHocPhanId}
              placeholder="Chọn lớp học phần"
            />
            <Button onClick={handleGoClick}>Go</Button>
          </div>
          {role === "Teacher" && (
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={!lophocphanId}
                    onSelect={(e) => e.preventDefault()}
                  >
                    Lập đơn đính chính
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[210mm] max-h-screen overflow-y-auto">
                  <CorrectedResultDocument classId={lophocphanId} correctedResults={data}/>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        <div>
          <CRUDDataTable
            entity="DiemDinhChinh"
            createColumns={createDiemDinhChinhColumns}
            data={data}
            setData={setData}
            fetchData={fetchData}
            deleteItem={deleteDiemDinhChinh}
            columnToBeFiltered={"studentName"}
            ItemForm={DiemDinhChinhForm}
            hasCreateButton={false}
          />
        </div>
      </div>
    </Layout>
  );
}
