import { useEffect, useState } from "react";
import { useOutlet, useNavigate, useParams, useLocation } from "react-router-dom";
import Layout from "./Layout";
import { getAllLopHocPhans, getLopHocPhans } from "../api/api-lophocphan";
import { Button } from "@/components/ui/button";
import { getRole, getGiangVienId } from "@/utils/storage";
import Typography from "@mui/material/Typography";
import VirtualizedAutocomplete from "../components/VirtualizedAutocomplete";
import TextField from "@mui/material/TextField";

const routes = [
  { value: "quan-ly-cau-hoi", label: "Quản lý Câu hỏi" },
  { label: "Bảng Điểm", value: "bang-diem" },
  { label: "Tạo CLO", value: "tao-clo" },
  { label: "Nối PLO - CLO", value: "noi-plo-clo" },
  { label: "Nối Câu Hỏi - CLO", value: "noi-cau-hoi-clo" },
  { label: "Điểm CLO", value: "diem-clo" },
  { label: "Điểm Pk", value: "diem-pk" },
];

export default function NhapDiemPage() {
  const { lopHocPhanId: lopHocPhanIdParam } = useParams();
  const location = useLocation();
  const currentPath = location.pathname;

  const [lopHocPhans, setLopHocPhans] = useState([]);
  const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam || null);
  const [selectedLopHocPhan, setSelectedLopHocPhan] = useState(null);

  const [itemId, setItemId] = useState(currentPath !== "/nhapdiem" ? currentPath.split("/")[3] : null);
  const [selectedAction, setSelectedAction] = useState(null);

  const navigate = useNavigate();
  const outlet = useOutlet();

  const role = getRole();
  const giangVienId = getGiangVienId();

  useEffect(() => {
    const fetchLopHocPhans = async () => {
      let data = [];
      if (role === "GiangVien" && giangVienId !== 0) {
        data = await getLopHocPhans(null, null, giangVienId, null);
      } else {
        data = await getAllLopHocPhans();
      }

      const mapped = data.map(lhp => ({ label: `${lhp.maLopHocPhan} - ${lhp.ten}`, value: lhp.id }));
      setLopHocPhans(mapped);
      const existing = mapped.find(item => item.value === Number(lopHocPhanIdParam));
      if (existing) setSelectedLopHocPhan(existing);
    };

    fetchLopHocPhans();
  }, [giangVienId, role, lopHocPhanIdParam]);

  const handleRoute = () => {
    if (lopHocPhanId && itemId) {
      navigate(`/nhapdiem/${lopHocPhanId}/${itemId}`);
    }
  };

  return (
<Layout>
  <div className="flex space-x-4 items-end">
    <div className="w-[40%] h-[80%] ml-[10px] mb-[10px]">
      <Typography variant="h6" sx={{ mb: "5px" }}>
        Chọn lớp học phần:
      </Typography>
      <VirtualizedAutocomplete
        options={lopHocPhans}
        value={selectedLopHocPhan}
        onChange={(event, newValue) => {
          setSelectedLopHocPhan(newValue);
          setLopHocPhanId(newValue?.value || null);
        }}
        getOptionLabel={(option) => option.label || ""}
        label="Tên lớp học phần"
        variant="outlined"
      />
    </div>

    <div>
      <Typography variant="h6" sx={{ mb: "5px" }}>
        Chọn hành động:
      </Typography>
      <VirtualizedAutocomplete
        options={routes}
        value={routes.find(item => item.value === itemId) || null}
        onChange={(event, newValue) => {
          setItemId(newValue?.value || null);
          setSelectedAction(newValue);
        }}
        getOptionLabel={(option) => option.label || ""}
        label="Tên hành động"
        variant="outlined"
        size="small"
      />
    </div>

    <Button onClick={handleRoute} disabled={!itemId || !lopHocPhanId}>
      Go
    </Button>
  </div>
  {outlet}
</Layout>
  );
}
