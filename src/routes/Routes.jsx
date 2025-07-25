import { createBrowserRouter } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import KhoaPage from "@/pages/Admin/KhoaPage";
import NganhPage from "@/pages/Admin/NganhPage";
import SinhVienPage from "@/pages/SinhVienPage";
import GiangVienPage from "@/pages/Admin/GiangVienPage";
import HocPhanPage from "@/pages/Admin/HocPhanPage";
import PLOPage from "@/pages/PLOPage";
// import NoiCLOPLO from "@/pages/chuandaura/MapPLOCLO";
import MapPLOCLOPage from "@/pages/MapPLOCLOPage";
import LopHocPhanPage from "@/pages/LopHocPhanPage";
import CongThucDiemPage from "@/pages/CongThucDiemPage";
import NhapDiemPage from "@/pages/NhapDiemPage";
import KetQuaPage from "@/pages/KetQuaHocTapPage";
import XetChuanDauRaPage from "@/pages/XetChuanDauRaPage";
import HoSoCaNhanPage from "@/pages/HoSoCaNhanPage";
import CaiDatPage from "@/pages/CaiDatPage";
import QuanLyCauHoi from "@/pages/nhapdiem/QuanLyCauHoi";
import BangDiem from "@/pages/nhapdiem/BangDiem";
import TaoCLO from "@/pages/nhapdiem/TaoCLO";
// import NoiCLOPLO from "@/pages/nhapdiem/NoiCLOPLO";
import NoiCauHoiCLO from "@/pages/nhapdiem/NoiCauHoiCLO";
import DiemCLO from "@/pages/nhapdiem/DiemCLO";
import DiemPk from "@/pages/nhapdiem/DiemPk";
import TongKetCLO from "@/pages/nhapdiem/TongKetCLO";
import BaoCaoCLO from "@/pages/nhapdiem/BaoCaoCLO";
import DangNhap from "@/pages/DangNhapPage/LoginPage";
import { getRole } from "@/utils/storage";
import BangDiemGiangVienPage from "@/pages/nhapdiem/BangDiemGiangVienPage";
import DiemDinhChinhPage from "@/pages/DiemDinhChinhPage";
import QuanLyTaiKhoanPage from "@/pages/QuanLyTaiKhoanPage";
import TestPage from "@/pages/TestPage";
import HocKiPage from "@/pages/Admin/HocKyPage";
import QuanLyCLO from "@/pages/chuandaura/QuanLyCLO";
import MapPLOCLO from "@/pages/chuandaura/MapPLOCLO";
import StudentInCoursePage from "../pages/StudentInCoursePage";
import CTDTPage from "../pages/Admin/CTDTPage";
const role = getRole();
const RoleBasedRoute = ({ giangVienElement, defaultElement }) => {
  return role === "Teacher" ? giangVienElement : defaultElement;
};

const routes = [
  {
    path: "/",
    element: <DangNhap />,
  },
  {
    path: "/main",
    element: <MainPage />,
  },
  {
    path: "/khoa",
    element: <KhoaPage />,
  },
  {
    path: "/nganh",
    element: <NganhPage />,
  },
  {
    path: "/programme",
    element: <CTDTPage />,
  },
  {
    path: "/giangvien",
    element: <GiangVienPage />,
  },
  {
    path: "/sinhvien",
    element: <SinhVienPage />,
  },
  {
    path: "/hocphan",
    element: <HocPhanPage />,
  },
  {
    path: "/plo",
    element: <PLOPage />,
  },
  {
    path: "/mapploclo",
    element: <MapPLOCLOPage />,
  },
  {
    path: "/lophocphan",
    element: <LopHocPhanPage />,
  },
  {
    path: "/congthucdiem",
    element: <CongThucDiemPage />,
  },
  {
    path: "/nhapdiem",
    element: <NhapDiemPage />,
    children: [
      { path: ":lopHocPhanId/quan-ly-cau-hoi", element: <QuanLyCauHoi /> },
      {
        path: ":lopHocPhanId/bang-diem",
        element: (
          <RoleBasedRoute
            giangVienElement={<BangDiemGiangVienPage />}
            defaultElement={<BangDiem />}
          />
        ),
      },
      { path: ":lopHocPhanId/tao-clo", element: <TaoCLO /> },
      { path: ":lopHocPhanId/noi-plo-clo", element: <MapPLOCLOPage /> },
      { path: ":lopHocPhanId/noi-cau-hoi-clo", element: <NoiCauHoiCLO /> },
      { path: ":lopHocPhanId/diem-clo", element: <DiemCLO /> },
      { path: ":lopHocPhanId/diem-pk", element: <DiemPk /> },
      { path: ":lopHocPhanId/tong-ket-clo", element: <TongKetCLO /> },
      { path: ":lopHocPhanId/bao-cao-clo", element: <BaoCaoCLO /> },
    ],
  },
  {
    path: "/chuandaura",
    children: [{ path: "quan-ly-clo", element: <QuanLyCLO /> }],
  },
  {
    path: "/clo",
    element: <QuanLyCLO />,
  },
  {
    path: "/semester",
    element: <HocKiPage />,
  },
  {
    path: "/diemdinhchinh",
    element: <DiemDinhChinhPage />,
  },
  {
    path: "/ketqua",
    element: <KetQuaPage />,
  },
  {
    path: "/xetchuandaura",
    element: <XetChuanDauRaPage />,
  },
  {
    path: "/hosocanhan",
    element: <HoSoCaNhanPage />,
  },
  {
    path: "/quanlytaikhoan",
    element: <QuanLyTaiKhoanPage />,
  },
  {
    path: "/caidat",
    element: <CaiDatPage />,
  },
  {
    path: "/mapcloplo",
    element: <MapPLOCLO />,
  },
  {
    path: "/test",
    element: <TestPage />,
  },
  {
    path: "/lophocphan/:courseId/sinhvien",
    element: <StudentInCoursePage />,
  },
];
const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
});
export default router;
