import { useEffect, useState } from "react";
import { useOutlet, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { getAllClasses, getFilteredClasses } from "../api-new/api-class";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
// import DefaultComponent from "./nhapdiem/DefaultComponent";
import { getRole, getTeacherId } from "@/utils/storage";
import { useParams } from "react-router-dom";
import { ComboBox } from "@/components/ComboBox";
import { useLocation } from "react-router-dom";

const routes = [
  {
    value: "quan-ly-cau-hoi",
    label: "Quản lý Câu hỏi",
  },
  {
    label: "Bảng Điểm",
    value: "bang-diem",
  },
  // {
  //   label: "Tạo CLO",
  //   value: "tao-clo",
  // },
  // {
  //   label: "Nối PLO - CLO",
  //   value: "noi-plo-clo",
  // },
  {
    label: "Nối Câu Hỏi - CLO",
    value: "noi-cau-hoi-clo",
  },
  {
    label: "Điểm CLO",
    value: "diem-clo",
  },
  {
    label: "Điểm Pk",
    value: "diem-pk",
  },
];

export default function NhapDiemPage() {
  const { lopHocPhanId: lopHocPhanIdParam } = useParams();
  const location = useLocation();
  const currentPath = location.pathname;
  const [lopHocPhans, setLopHocPhans] = useState([]);
  const [itemId, setItemId] = useState(
    currentPath !== "/nhapdiem" ? currentPath.split("/")[3] : null
  );
  console.log(
    "currentPath",
    currentPath.split("/")[3],
    currentPath !== "/nhapdiem" ? currentPath : null
  );
  const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam || null);
  const [comboBoxLopHocPhanId, setComboBoxLopHocPhanId] =
    useState(lopHocPhanIdParam);
  const [comboBoxItemId, setComboBoxItemId] = useState(null);
  const [items, setItems] = useState(routes);
  const navigate = useNavigate();
  const outlet = useOutlet();
  const role = getRole();
  const giangVienId = getTeacherId();
  console.log("itemId", itemId);

  useEffect(() => {
    const fetchLopHocPhans = async () => {
      if (role === "Teacher" && giangVienId != 0) {
        const data = await getFilteredClasses(null, null, giangVienId, null);
        const mappedComboBoxItems = data.map((lopHocPhan) => ({
          label: `${lopHocPhan.code} - ${lopHocPhan.name}`,
          value: lopHocPhan.id,
        }));
        setLopHocPhans(mappedComboBoxItems);
        return;
      }
      const data = await getAllClasses();
      const mappedComboBoxItems = data.map((lopHocPhan) => ({
        label: `${lopHocPhan.code} - ${lopHocPhan.name}`,
        value: lopHocPhan.id,
      }));
      setLopHocPhans(mappedComboBoxItems);
    };

    fetchLopHocPhans();
  }, [giangVienId, role]);

  const handleRoute = () => {
    // setLopHocPhanId(comboBoxLopHocPhanId);
    // console.log("comboBoxLopHocPhanId", comboBoxLopHocPhanId);
    console.log(`/nhapdiem/${lopHocPhanId}/${itemId}`);
    if (lopHocPhanId && itemId) {
      navigate(`/nhapdiem/${lopHocPhanId}/${itemId}`);
    }
  };

  console.log("lopHocPhan", lopHocPhans);

  return (
    <Layout>
      <div className="overflow-y-auto h-full">
        <div className="flex space-x-4">
          <div>
            <h2>Chọn lớp học phần: </h2>
            <ComboBox
              items={lopHocPhans}
              setItemId={setLopHocPhanId}
              initialItemId={lopHocPhanId}
              placeholder="Chọn lớp học phần"
              width="600px"
            />
          </div>
          <div>
            <h2>Chọn hành động: </h2>
            <ComboBox
              items={items}
              setItemId={setItemId}
              initialItemId={itemId}
              placeholder="Tên hành động"
              width="200px"
              height="185px"
            />
          </div>

          <div className="flex items-end">
            <Button onClick={handleRoute} disabled={!itemId}>
              Go
            </Button>
          </div>
        </div>
        {outlet}
      </div>
    </Layout>
  );
}
