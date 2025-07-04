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
import React, { useState, useEffect } from "react";
import "@/utils/storage";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import LogoDUT from "@/assets/logos/logo-dut.png";

import {
  University,
  School,
  GraduationCap,
  BookMarked,
  ScrollText,
  ListChecks,
  BookCheck,
  Network,
  UserRoundPen,
  Calendar1,
  NotebookPen,
  SquareSigma,
  CircleCheckBig,
  ClipboardCheck,
  CircleUserRound,
  ClipboardList,
  BookOpenText,
  Users,
  LogOut,
} from "lucide-react";
import { getRole } from "@/utils/storage";

const adminItem = [
  {
    title: "Khoa",
    url: "/khoa",
    icon: University,
  },
  {
    title: "Ngành",
    url: "/nganh",
    icon: School,
  },
  {
    title: "Chương trình đào tạo",
    url: "/programme",
    icon: ScrollText,
  },
  {
    title: "Học phần",
    url: "/hocphan",
    icon: BookMarked,
  },
  {
    title: "PLO",
    url: "/plo",
    icon: ListChecks,
  },
  {
    title: "CLO",
    url: "/clo",
    icon: BookCheck,
  },
  {
    title: "Nối Học phần - PLO",
    url: "/mapcoursepi",
    icon: Network,
  },
  {
    title: "Nối PLO - CLO",
    url: "/mapploclo",
    icon: Network,
  },
  {
    title: "Giảng viên",
    url: "/giangvien",
    icon: UserRoundPen,
  },
  {
    title: "Sinh viên",
    url: "/sinhvien",
    icon: GraduationCap,
  },
  {
    title: "Học kỳ",
    url: "/semester",
    icon: Calendar1,
  },
  {
    title: "Lớp học phần",
    url: "/lophocphan",
    icon: BookOpenText,
  },
  {
    title: "Công thức điểm",
    url: "/congthucdiem",
    icon: SquareSigma,
  },
  {
    title: "Nhập điểm",
    url: "/nhapdiem",
    icon: NotebookPen,
  },
  {
    title: "Điểm Đính Chính",
    url: "/diemdinhchinh",
    icon: CircleCheckBig,
  },

  {
    title: "Điểm PLO",
    url: "/xetchuandaura",
    icon: ClipboardCheck,
  },
  {
    title: "Quản lý tài khoản",
    url: "/quanlytaikhoan",
    icon: Users,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: CircleUserRound,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: LogOut,
  },
];

const academicAffairsItems = [
  {
    title: "Khoa",
    url: "/khoa",
    icon: University,
  },
  {
    title: "Ngành",
    url: "/nganh",
    icon: School,
  },
  {
    title: "Chương trình đào tạo",
    url: "/programme",
    icon: ScrollText,
  },
  {
    title: "Học phần",
    url: "/hocphan",
    icon: BookMarked,
  },
  {
    title: "PLO",
    url: "/plo",
    icon: ListChecks,
  },
  {
    title: "CLO",
    url: "/clo",
    icon: BookCheck,
  },
  {
    title: "Nối Học phần - PLO",
    url: "/mapcoursepi",
    icon: Network,
  },
  {
    title: "Nối PLO - CLO",
    url: "/mapploclo",
    icon: Network,
  },
  {
    title: "Giảng viên",
    url: "/giangvien",
    icon: UserRoundPen,
  },
  {
    title: "Sinh viên",
    url: "/sinhvien",
    icon: GraduationCap,
  },
  {
    title: "Học kỳ",
    url: "/semester",
    icon: Calendar1,
  },
  {
    title: "Lớp học phần",
    url: "/lophocphan",
    icon: BookOpenText,
  },
  {
    title: "Công thức điểm",
    url: "/congthucdiem",
    icon: SquareSigma,
  },
  {
    title: "Nhập điểm",
    url: "/nhapdiem",
    icon: NotebookPen,
  },
  {
    title: "Điểm Đính Chính",
    url: "/diemdinhchinh",
    icon: CircleCheckBig,
  },

  {
    title: "Điểm PLO",
    url: "/xetchuandaura",
    icon: ClipboardCheck,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: CircleUserRound,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: LogOut,
  },
];

const programmeManagerItems = [
  {
    title: "Chương trình đào tạo",
    url: "/programme",
    icon: ScrollText,
  },
  {
    title: "PLO",
    url: "/plo",
    icon: ListChecks,
  },
  {
    title: "Nối Học phần - PLO",
    url: "/mapcoursepi",
    icon: Network,
  },
  {
    title: "Nối PLO - CLO",
    url: "/mapploclo",
    icon: Network,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: CircleUserRound,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: LogOut,
  },
];

const teacherItems = [
  {
    title: "Lớp học phần",
    url: "/lophocphan",
    icon: BookOpenText,
  },
  {
    title: "Nhập điểm",
    url: "/nhapdiem",
    icon: NotebookPen,
  },
  {
    title: "Điểm Đính Chính",
    url: "/diemdinhchinh",
    icon: CircleCheckBig,
  },
  {
    title: "Điểm PLO",
    url: "/xetchuandaura",
    icon: ClipboardCheck,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: CircleUserRound,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: LogOut,
  },
];

const studentItems = [
  {
    title: "Kết quả học tập",
    url: "/ketqua",
    icon: ClipboardList,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/hosocanhan",
    icon: CircleUserRound,
  },
  {
    title: "Đăng xuất",
    url: "/",
    icon: LogOut,
  },
];

export function AppSidebar() {
  const role = getRole(); // Hàm getRole() cần được định nghĩa để lấy vai trò người dùng
  const location = useLocation();
  const [openItem, setOpenItem] = useState(null); // Trạng thái để mở menu cha
  const [activeSubItem, setActiveSubItem] = useState(location.pathname); // Lưu trữ URL đang hoạt động

  const items = React.useMemo(() => {
    switch (role) {
      case "ProgrammeManager":
        return programmeManagerItems;
      case "Teacher":
        return teacherItems;
      case "Student":
        return studentItems;
      case "Admin":
        return adminItem;
      case "AcademicAffairs":
        return academicAffairsItems;
      default:
        console.warn("Vai trò không hợp lệ hoặc chưa được xác định.");
        return [];
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

    // Toggle trạng thái menu cha
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
                <Collapsible
                  key={item.title}
                  open={openItem === item.title}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          onClick={(e) =>
                            item.subItems && toggleItem(item.title, e)
                          }
                          className={`flex items-center p-2 rounded-lg ${
                            location.pathname === item.url
                              ? "bg-blue-100 text-blue-600"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {/* {<img
                            src={item.icon}
                            alt={`${item.title} icon`}
                            className="w-6 h-6 mr-2"
                          />} */}
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          {item.subItems && (
                            <span className="ml-auto">
                              {openItem === item.title ? (
                                <FiChevronUp />
                              ) : (
                                <FiChevronDown />
                              )}
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
                                  setActiveSubItem(subItem.url); // Cập nhật URL hoạt động
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
