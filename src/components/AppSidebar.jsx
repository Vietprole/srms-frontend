import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import React, { useState, useEffect } from "react";
import "@/utils/storage"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useLocation } from "react-router-dom";

// Import PNG icons
import KhoaIcon from "@/assets/icons/khoa-icon.png";
import NganhIcon from "@/assets/icons/nganh-icon.png";
import GiangVienIcon from "@/assets/icons/giang-vien-icon.png";
import SinhVienIcon from "@/assets/icons/sinh-vien-icon.png";
import HocPhanIcon from "@/assets/icons/hoc-phan-icon.png";
import PLOIcon from "@/assets/icons/plo-icon.png";
import NoiHocPhanPLOIcon from "@/assets/icons/noi-hoc-phan-plo-icon.png";
import LopHocPhanIcon from "@/assets/icons/lop-hoc-phan-icon.png";
import CongThucDiemIcon from "@/assets/icons/cong-thuc-diem-icon.png";
import NhapDiemIcon from "@/assets/icons/nhap-diem-icon.png";
import DiemDinhChinhIcon from "@/assets/icons/diem-dinh-chinh-icon.png";
import KetQuaIcon from "@/assets/icons/ket-qua-hoc-tap-icon.png";
import XetChuanDauRaIcon from "@/assets/icons/xet-chuan-dau-ra-icon.png";
import QuanLyTaiKhoanIcon from "@/assets/icons/quan-ly-tai-khoan-icon.png";
import HoSoCaNhanIcon from "@/assets/icons/ho-so-ca-nhan-icon.png";
import CaiDatIcon from "@/assets/icons/cai-dat-icon.png";
import DangXuatIcon from "@/assets/icons/dang-xuat-icon.png";
import LogoDUT from "@/assets/logos/logo-dut.png";
import { getRole } from "@/utils/storage";
import HocKiIcon from "@/assets/icons/hocki-icon.png";
const truongKhoaItem = [
  {
    title: "Khoa",
    url: "/khoa",
    icon: KhoaIcon,
  },
  {
    title: "Sinh viên",
    url: "/sinhvien",
    icon: SinhVienIcon,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: HoSoCaNhanIcon,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: DangXuatIcon,
  }
]

const giangVienItem = [
  {
    title: "Sinh viên",
    url: "/sinhvien",
    icon: SinhVienIcon,
  },
  {
    title: "Nhập điểm",
    url: "/nhapdiem",
    icon: NhapDiemIcon,
  },
  {
    title: "Điểm Đính Chính",
    url: "/diemdinhchinh",
    icon: DiemDinhChinhIcon,
  },
  {
    title: "Xét chuẩn đầu ra",
    url: "/xetchuandaura",
    icon: XetChuanDauRaIcon,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: HoSoCaNhanIcon,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: DangXuatIcon,
  },
]

const sinhVienItem = [
  {
    title: "Kết quả học tập",
    url: "/ketqua",
    icon: KetQuaIcon,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: HoSoCaNhanIcon,
  },
  {
    title: "Xét chuẩn đầu ra",
    url: "/xetchuandaura",
    icon: XetChuanDauRaIcon,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: DangXuatIcon,
  }
]

const adminItem = [
  {
    title: "Khoa",
    url: "/khoa",
    icon: KhoaIcon,
  },
  {
    title: "Học kỳ",
    url: "/hocki",
    icon: HocKiIcon,
  },
  {
    title: "Ngành",
    url: "/nganh",
    icon: NganhIcon,
  },
  {
    title: "Học phần",
    url: "/hocphan",
    icon: HocPhanIcon,
  },
  {
    title: "PLO",
    url: "/plo",
    icon: PLOIcon,
  },
  {
    title: "Nối Học Phần - PLO",
    url: "/maphocphanplo",
    icon: NoiHocPhanPLOIcon,
  },
  {
    title: "Nối PLO-CLO",
    url: "/noi-plo-clo",
    icon: NoiHocPhanPLOIcon,
  },
  {
    title: "Giảng viên",
    url: "/giangvien",
    icon: GiangVienIcon,
  },
  {
    title: "Sinh viên",
    url: "/sinhvien",
    icon: SinhVienIcon,
  },
  {
    title: "Lớp học phần",
    url: "/lophocphan",
    icon: LopHocPhanIcon,
  },
  {
    title: "Công thức điểm",
    url: "/congthucdiem",
    icon: CongThucDiemIcon,
  },
  {
    title: "Nhập điểm",
    url: "/nhapdiem",
    icon: NhapDiemIcon,
  },
  {
    title: "Điểm Đính Chính",
    url: "/diemdinhchinh",
    icon: DiemDinhChinhIcon,
  },
  {
    title: "Xét chuẩn đầu ra",
    url: "/xetchuandaura",
    icon: XetChuanDauRaIcon,
  },
  {
    title: "Quản lý tài khoản",
    url: "/quanlytaikhoan",
    icon: QuanLyTaiKhoanIcon,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: HoSoCaNhanIcon,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: DangXuatIcon,
  },
]

const phongDaoTaoItem = [
  {
    title: "Khoa",
    url: "/khoa",
    icon: KhoaIcon,
  },
  {
    title: "Ngành",
    url: "/nganh",
    icon: NganhIcon,
  },
  {
    title: "Học phần",
    url: "/hocphan",
    icon: HocPhanIcon,
  },
  {
    title: "PLO",
    url: "/plo",
    icon: PLOIcon,
  },
  {
    title: "Nối Học Phần - PLO",
    url: "/maphocphanplo",
    icon: NoiHocPhanPLOIcon,
  },
  {
    title: "Giảng viên",
    url: "/giangvien",
    icon: GiangVienIcon,
  },
  {
    title: "Sinh viên",
    url: "/sinhvien",
    icon: SinhVienIcon,
  },
  {
    title: "Lớp học phần",
    url: "/lophocphan",
    icon: LopHocPhanIcon,
  },
  {
    title: "Công thức điểm",
    url: "/congthucdiem",
    icon: CongThucDiemIcon,
  },
  {
    title: "Nhập điểm",
    url: "/nhapdiem",
    icon: NhapDiemIcon,
  },
  {
    title: "Điểm Đính Chính",
    url: "/diemdinhchinh",
    icon: DiemDinhChinhIcon,
  },
  {
    title: "Xét chuẩn đầu ra",
    url: "/xetchuandaura",
    icon: XetChuanDauRaIcon,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: HoSoCaNhanIcon,
  },
  {
    title: "Cài đặt",
    url: "/caidat",
    icon: CaiDatIcon,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: DangXuatIcon,
  },
]

const nguoiPhuTrachCTDTItems = [
  {
    title: "Khoa",
    url: "/khoa",
    icon: KhoaIcon,
  },
  {
    title: "Ngành",
    url: "/nganh",
    icon: NganhIcon,
  },
  
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: HoSoCaNhanIcon,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: DangXuatIcon,
  }
];

export function AppSidebar() {
  const role = getRole();
  const [items, setItems] = useState([]);
  const location = useLocation();
  const [openItem, setOpenItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(location.pathname);

  useEffect(() => {
    switch (role) {
      case "Admin":
        setItems(adminItem);
        break;
      case "GiangVien":
        setItems(giangVienItem);
        break;
      case "SinhVien":
        setItems(sinhVienItem);
        break;
      case "TruongKhoa":
        setItems(truongKhoaItem);
        break;
      case "PhongDaoTao":
        setItems(phongDaoTaoItem);
        break;
      case "NguoiPhuTrachCTĐT":
        setItems(nguoiPhuTrachCTDTItems);
        break;
      default:
        setItems([]);
    }
  }, [role]);

  useEffect(() => {
    const currentItem = items.find((item) =>
      item.subItems?.some((subItem) => subItem.url === location.pathname)
    );
    if (currentItem) {
      setOpenItem(currentItem.title);
    } else {
      setOpenItem(null);
    }
    setActiveSubItem(location.pathname);
  }, [location.pathname, items]);

  const toggleItem = (title, e) => {
    e.preventDefault();
    e.stopPropagation();

    setOpenItem(openItem === title ? null : title);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <a href="/main">
          <div className="flex items-center">
            <img src={LogoDUT} alt="Logo DUT" className="w-20 h-20 mr-2" />
            <span className="font-extrabold text-3xl text-blue-500">SRMS</span>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible key={item.title} open={openItem === item.title} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          onClick={(e) => item.subItems && toggleItem(item.title, e)}
                          className={`flex items-center p-2 rounded-lg ${
                            location.pathname === item.url
                              ? "bg-blue-100 text-blue-600"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <img
                            src={item.icon}
                            alt={`${item.title} icon`}
                            className="w-6 h-6 mr-2"
                          />
                          <span>{item.title}</span>
                          {item.subItems && (
                            <span className="ml-auto">
                              {openItem === item.title ? <FiChevronUp /> : <FiChevronDown />}
                            </span>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.subItems && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                href={subItem.url}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSubItem(subItem.url);
                                }}
                                className={`flex items-center p-2 rounded-lg ${
                                  activeSubItem === subItem.url
                                    ? "bg-blue-100 text-blue-600"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                {subItem.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
