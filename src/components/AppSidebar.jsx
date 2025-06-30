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
} from "@/components/ui/sidebar";
import  { useState, useEffect } from "react";
import "@/utils/storage";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  FiChevronDown,
  FiChevronUp,
  FiDatabase,
  FiTarget,
  FiEdit3,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";

// Import PNG icons
import KhoaIcon from "@/assets/icons/khoa-icon.png";
import NganhIcon from "@/assets/icons/nganh-icon.png";
import GiangVienIcon from "@/assets/icons/giang-vien-icon.png";
import SinhVienIcon from "@/assets/icons/sinh-vien-icon.png";
import HocPhanIcon from "@/assets/icons/hoc-phan-icon.png";
import PLOIcon from "@/assets/icons/plo-icon.png";
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
  },
];

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
];

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
  },
];

const adminItem = [
  {
    title: "Quản lý đào tạo",
    icon: <FiDatabase className="w-6 h-6" />,
    subItems: [
      {
        title: "Khoa",
        url: "/khoa",
      },
      {
        title: "Chương trình đào tạo",
        url: "/nganh",
      },
      {
        title: "Học kỳ",
        url: "/hocki",
      },
      {
        title: "Học phần",
        url: "/hocphan",
      },
      {
        title: "Lớp học phần",
        url: "/lophocphan",
      },
      {
        title: "Giảng viên",
        url: "/giangvien",
      },
      {
        title: "Sinh viên",
        url: "/sinhvien",
      },
    ],
  },
  {
    title: "Chuẩn đầu ra",
    icon: <FiTarget className="w-6 h-6" />,
    subItems: [
      {
        title: "Quản lý PLO",
        url: "/plo",
      },
      {
        title: "Quản lý CLO",
        url: "/chuandaura/quan-ly-clo",
      },
    ],
  },
  {
    title: "Quản lý điểm",
    icon: <FiEdit3 className="w-6 h-6" />,
    subItems: [
      {
        title: "Công thức điểm",
        url: "/congthucdiem",
      },
      {
        title: "Nhập điểm",
        url: "/nhapdiem",
      },
      {
        title: "Đính chính điểm",
        url: "/diemdinhchinh",
      },
    ],
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
];

const phongDaoTaoItem = [
  {
    title: "Khoa",
    url: "/khoa",
    icon: KhoaIcon,
  },
  {
    title: "Chương trình đào tạo",
    url: "/nganh",
    icon: NganhIcon,
  },
  {
    title: "Học phần",
    url: "/hocphan",
    icon: HocPhanIcon,
  },
  {
    title: "Quản lý PLO",
    url: "/plo",
    icon: PLOIcon,
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
];

const nguoiPhuTrachCTDTItems = [
  {
    title: "Khoa",
    url: "/khoa",
    icon: KhoaIcon,
  },
  {
    title: "Chương trình đào tạo",
    url: "/nganh",
    icon: NganhIcon,
  },
  {
    title: "Quản lý PLO",
    url: "/plo",
    icon: PLOIcon,
  },
  {
    title: "Quản lý CLO",
    url: "/chuandaura/quan-ly-clo",
    icon: PLOIcon,
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
];

export function AppSidebar() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [openItem, setOpenItem] = useState("");
  const [activeSubItem, setActiveSubItem] = useState("");
  const role = getRole();

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

  // Thêm useEffect để theo dõi pathname và giữ menu mở
  useEffect(() => {
    // Tìm item cha chứa submenu có URL khớp với pathname hiện tại
    const parentItem = items.find((item) =>
      item.subItems?.some((subItem) => subItem.url === location.pathname)
    );

    // Nếu tìm thấy item cha, set openItem để giữ menu mở
    if (parentItem) {
      setOpenItem(parentItem.title);
    }

    // Set active submenu
    setActiveSubItem(location.pathname);
  }, [location.pathname, items]);

  const toggleItem = (title, e) => {
    if (e) {
      e.preventDefault();
    }
    setOpenItem(openItem === title ? "" : title);
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
                <Collapsible
                  key={item.title}
                  open={openItem === item.title}
                  className="w-full"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.subItems) {
                            toggleItem(item.title, e);
                          } else if (item.url) {
                            window.location.href = item.url;
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg ${
                          location.pathname === item.url
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          {typeof item.icon === "string" ? (
                            <img
                              src={item.icon}
                              alt={`${item.title} icon`}
                              className="w-6 h-6 mr-2"
                            />
                          ) : (
                            <span className="mr-2">{item.icon}</span>
                          )}
                          <span>{item.title}</span>
                        </div>
                        {item.subItems && (
                          <span className="ml-auto">
                            {openItem === item.title ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </span>
                        )}
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
                                  if (subItem.url) {
                                    window.location.href = subItem.url;
                                  }
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
