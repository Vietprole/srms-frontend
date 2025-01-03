import { createBrowserRouter } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import KhoaPage from "@/pages/KhoaPage";
import NganhPage from "@/pages/NganhPage";
import SinhVienPage from "@/pages/SinhVienPage";
import GiangVienPage from "@/pages/GiangVienPage";
import HocPhanPage from "@/pages/HocPhanPage";
import PLOPage from "@/pages/PLOPage";
import MapHocPhanPLOPage from "@/pages/MapHocPhanPLOPage";
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
import NoiCLOPLO from "@/pages/nhapdiem/NoiCLOPLO";
import NoiCauHoiCLO from "@/pages/nhapdiem/NoiCauHoiCLO";
import DiemCLO from "@/pages/nhapdiem/DiemCLO";
import DiemPk from "@/pages/nhapdiem/DiemPk";
import TongKetCLO from "@/pages/nhapdiem/TongKetCLO";
import BaoCaoCLO from "@/pages/nhapdiem/BaoCaoCLO";
import DangNhap from "@/pages/DangNhapPage/DangNhapPage";
import { getRole } from "@/utils/storage";
import BangDiemGiangVienPage from "@/pages/nhapdiem/BangDiemGiangVienPage";
import DiemDinhChinhPage from "@/pages/DiemDinhChinhPage";
import QuanLyTaiKhoanPage from "@/pages/QuanLyTaiKhoanPage";
import TestPage from "@/pages/TestPage";

const role = getRole();
const RoleBasedRoute = ({ giangVienElement, defaultElement }) => {
  return role === "GiangVien" ? giangVienElement : defaultElement;
};

const lophocphans = []
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
    path: "/maphocphanplo",
    element: <MapHocPhanPLOPage />,
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
      { path: ":lopHocPhanId/bang-diem", element: <RoleBasedRoute giangVienElement={<BangDiemGiangVienPage />} defaultElement={<BangDiem/>} /> },
      { path: ":lopHocPhanId/tao-clo", element: <TaoCLO /> },
      { path: ":lopHocPhanId/noi-plo-clo", element: <NoiCLOPLO /> },
      { path: ":lopHocPhanId/noi-cau-hoi-clo", element: <NoiCauHoiCLO /> },
      { path: ":lopHocPhanId/diem-clo", element: <DiemCLO /> },
      { path: ":lopHocPhanId/diem-pk", element: <DiemPk /> },
      { path: ":lopHocPhanId/tong-ket-clo", element: <TongKetCLO /> },
      { path: ":lopHocPhanId/bao-cao-clo", element: <BaoCaoCLO /> },
    ],
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
    path: "/test",
    element: <TestPage />,
  }
]
const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  }
});
export default router;
