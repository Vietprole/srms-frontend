import Layout from "./Layout";
import DataTable from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLopHocPhans } from "@/api/api-lophocphan";
import {
  getDiemDinhChinhs,
  // getAllDiemDinhChinhs,
  deleteDiemDinhChinh,
  acceptDiemDinhChinh,
} from "@/api/api-diemdinhchinh";
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
import { getRole, getGiangVienId, getFullname } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js';
import { getLopHocPhanById } from "@/api/api-lophocphan";

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
  const giangVienId = getGiangVienId() === 0 ? null : getGiangVienId();
  const { toast } = useToast();

  useEffect(() => {
    window.jsPDF = window.jspdf?.jsPDF;
  }, []);

  const fetchData = useCallback(async () => {
    let dataLopHocPhan = await getLopHocPhans(null, null, null, null);
    if (giangVienId) {
      dataLopHocPhan = await getLopHocPhans(null, null, giangVienId, null);
    }
    // Map lophocphan items to be used in ComboBox
    const mappedComboBoxItems = dataLopHocPhan.map((lophocphan) => ({
      label: lophocphan.ten,
      value: lophocphan.id,
    }));
    setLopHocPhanItems(mappedComboBoxItems);
    const data = await getDiemDinhChinhs(lophocphanId, giangVienId);
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
  }
  
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) : '';
  }

  // function that compare date to today and return the result
  const isDatePassed = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getTime() < today.getTime();
  }

  const generatePDFFromHTML = async (item) => {
    try {
      console.log("Thông tin item ban đầu:", item);
      
      // Xác định loại bài kiểm tra
      const loaiBaiKiemTra = item.loaiBaiKiemTra || "";
      let tenLoaiBaiKiemTra = "GIỮA KỲ";
      let kyHieuLoaiBaiKiemTra = "GK";
      
      if (loaiBaiKiemTra) {
        if (loaiBaiKiemTra.toLowerCase().includes("cuối kỳ") || 
            loaiBaiKiemTra.toLowerCase().includes("cuoi ky") ||
            loaiBaiKiemTra.toLowerCase().includes("ck")) {
          tenLoaiBaiKiemTra = "CUỐI KỲ";
          kyHieuLoaiBaiKiemTra = "CK";
        } else if (loaiBaiKiemTra.toLowerCase().includes("giữa kỳ") || 
                  loaiBaiKiemTra.toLowerCase().includes("giua ky") ||
                  loaiBaiKiemTra.toLowerCase().includes("gk")) {
          tenLoaiBaiKiemTra = "GIỮA KỲ";
          kyHieuLoaiBaiKiemTra = "GK";
        }
      }

      // Lấy thông tin lớp học phần
      let tenLopHocPhan = "";
      let maLopHocPhan = "";

      // Lấy ID lớp học phần từ item
      const lopHocPhanId = item.lopHocPhanId;
      console.log("ID lớp học phần từ item:", lopHocPhanId);
      console.log("Danh sách lớp học phần:", lophocphanItems);

      // Thử tìm trong lophocphanItems trước
      const selectedLopHocPhan = lophocphanItems.find(lhp => lhp.value === lopHocPhanId);
      console.log("Lớp học phần được tìm thấy trong items:", selectedLopHocPhan);

      if (selectedLopHocPhan) {
        tenLopHocPhan = selectedLopHocPhan.label;
        maLopHocPhan = selectedLopHocPhan.value.toString();
        console.log("Đã tìm thấy trong lophocphanItems:", { tenLopHocPhan, maLopHocPhan });
      } else if (lopHocPhanId) {
        try {
          // Nếu không tìm thấy trong items, gọi API
          const lopHocPhan = await getLopHocPhanById(lopHocPhanId);
          console.log("Kết quả từ API getLopHocPhanById:", lopHocPhan);
          
          if (lopHocPhan && lopHocPhan.data) {
            tenLopHocPhan = lopHocPhan.data.ten || lopHocPhan.ten;
            maLopHocPhan = lopHocPhan.data.ma || lopHocPhan.ma;
            console.log("Đã lấy được từ API:", { tenLopHocPhan, maLopHocPhan });
          }
        } catch (error) {
          console.error("Lỗi khi gọi API getLopHocPhanById:", error);
          toast({
            title: "Cảnh báo",
            description: "Không thể lấy thông tin lớp học phần từ API",
            variant: "warning",
          });
        }
      }

      // Nếu vẫn không có thông tin, thử lấy từ item trực tiếp
      if (!tenLopHocPhan && item.tenLopHocPhan) {
        tenLopHocPhan = item.tenLopHocPhan;
        console.log("Lấy tên lớp học phần từ item trực tiếp:", tenLopHocPhan);
      }
      if (!maLopHocPhan && item.maLopHocPhan) {
        maLopHocPhan = item.maLopHocPhan;
        console.log("Lấy mã lớp học phần từ item trực tiếp:", maLopHocPhan);
      }

      // Nếu vẫn không có thông tin, đặt giá trị mặc định
      tenLopHocPhan = tenLopHocPhan || "Chưa có thông tin";
      maLopHocPhan = maLopHocPhan || "Chưa có thông tin";

      console.log("Thông tin cuối cùng:", {
        tenLopHocPhan,
        maLopHocPhan,
        lopHocPhanId
      });

      // Cập nhật cách hiển thị trong HTML
      const htmlContent = `
        <div class="page-container">
          <!-- Header -->
          <div class="header">
            <p class="title-header">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p class="subtitle-header">Độc lập - Tự do - Hạnh phúc</p>
            <div class="divider"></div>
          </div>
          
          <!-- Title -->
          <div class="main-title">
            <p class="doc-title">ĐƠN ĐỀ NGHỊ ĐÍNH CHÍNH ĐIỂM ${tenLoaiBaiKiemTra}</p>
            <p class="semester">Học kỳ 2 năm học 2023 - 2024</p>
          </div>
          
          <!-- Recipient -->
          <div class="recipient">
            <p class="recipient-label">Kính gửi:</p>
            <p class="recipient-item">- Ban Giám hiệu Trường Đại học Bách Khoa</p>
            <p class="recipient-item">- Phòng Đào tạo</p>
          </div>
          
          <!-- Lecturer Info -->
          <div class="lecturer-info">
            <p>Tôi tên là: ${getFullname() || item.tenGiangVien || "Sena36"}</p>
            <p>Thuộc đơn vị: Chưa có thông tin</p>
            <p>Lý do đính chính: Giáo viên nhập điểm nhầm.</p>
            <p>Lớp học phần: ${tenLopHocPhan}</p>
            <p>Mã lớp: ${maLopHocPhan}</p>
            <p>Loại bài kiểm tra: ${kyHieuLoaiBaiKiemTra}</p>
            <p>như sau:</p>
          </div>
          
          <!-- Student Table -->
          <table class="student-table">
            <tr class="table-header">
              <th>TT</th>
              <th>Mã SV</th>
              <th>Họ tên SV</th>
              <th>Điểm sai</th>
              <th>Điểm đính chính</th>
              <th>Ghi chú</th>
            </tr>
            <tr>
              <td>1</td>
              <td>${item.maSinhVien || ""}</td>
              <td>${item.tenSinhVien || ""}</td>
              <td>${item.diemCu !== null ? item.diemCu : ""}</td>
              <td>${item.diemMoi !== null ? item.diemMoi : ""}</td>
              <td></td>
            </tr>
          </table>
          
          <!-- Footer text -->
          <div class="footer-text">
            <p>Tôi làm đơn này trình bày sự việc, có kèm bài thi của sinh viên và cam đoan rằng đây là sự thật. Kính đề</p>
            <p>nghị</p>
            <p>Khoa, Phòng cho phép tôi đính chính điểm cho sinh viên.</p>
            <p class="mt-10">Tôi sẽ nghiêm túc rút kinh nghiệm để tránh không xảy ra sai sót nữa.</p>
          </div>
          
          <!-- Signature section -->
          <div class="signature">
            <p>Đà Nẵng, ngày ${format(new Date(), 'dd')} tháng ${format(new Date(), 'MM')} năm ${format(new Date(), 'yyyy')}</p>
            <p class="signature-title">Giảng viên</p>
            <p class="signature-name">${getFullname() || item.tenGiangVien || "Sena36"}</p>
          </div>
          
          <!-- Department approval section -->
          <div class="department-approval">
            <p>Ý kiến của Khoa quản lý chuyên môn</p>
          </div>
        </div>

        <style>
          .page-container {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            width: 210mm; /* Chiều rộng trang A4 */
            margin: 0 auto;
            padding: 20mm 20mm; /* Lề trên/dưới và trái/phải */
            box-sizing: border-box;
            line-height: 1.5;
          }
          
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .title-header {
            font-weight: bold;
            font-size: 13pt;
            margin-bottom: 3px;
          }
          
          .subtitle-header {
            margin: 0;
          }
          
          .divider {
            width: 40%;
            margin: 5px auto;
            border-top: 1px solid black;
          }
          
          .main-title {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .doc-title {
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 5px;
          }
          
          .semester {
            margin: 0;
          }
          
          .recipient {
            position: relative;
            margin-bottom: 15px;
          }
          
          .recipient-label {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .recipient-item {
            margin: 0;
            padding-left: 40px;
          }
          
          .lecturer-info p {
            margin: 3px 0;
          }
          
          .student-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          
          .student-table th, .student-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
          
          .table-header {
            background-color: #f2f2f2;
          }
          
          .footer-text p {
            margin: 3px 0;
          }
          
          .mt-10 {
            margin-top: 10px;
          }
          
          .signature {
            margin-top: 30px;
            text-align: right;
          }
          
          .signature-title {
            margin-right: 70px;
          }
          
          .signature-name {
            margin-top: 60px;
            margin-right: 50px;
          }
          
          .department-approval {
            margin-top: -80px;
            font-weight: bold;
          }
        </style>
      `;

      // Tạo element tạm thời
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      document.body.appendChild(element);

      // Cấu hình html2pdf
      const options = {
        filename: `Don_Dinh_Chinh_Diem_${tenLoaiBaiKiemTra}_${item.maSinhVien || "SV"}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        margin: 0
      };

      // Tạo PDF
      return html2pdf()
        .from(element)
        .set(options)
        .save()
        .then(() => {
          document.body.removeChild(element);
          return true;
        });
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
      throw error;
    }
  };

  const generateAllPDFInOne = async () => {
    try {
      if (!data || data.length === 0) {
        toast({
          title: "Không có dữ liệu",
          description: "Không có đơn đính chính nào để in.",
          variant: "warning",
        });
        return;
      }

      // Số sinh viên tối đa trên một trang
      const STUDENTS_PER_PAGE = 20;
      
      // Chia dữ liệu thành các trang
      const pages = [];
      for (let i = 0; i < data.length; i += STUDENTS_PER_PAGE) {
        pages.push(data.slice(i, i + STUDENTS_PER_PAGE));
      }

      // Tạo HTML cho tất cả các trang
      const allPagesHTML = pages.map((pageData, pageIndex) => {
        // Tạo các hàng trong bảng cho trang hiện tại
        const studentRows = pageData.map((item, index) => {
          const loaiBaiKiemTra = item.loaiBaiKiemTra || "";
          let kyHieuLoaiBaiKiemTra = "GK";
          
          if (loaiBaiKiemTra.toLowerCase().includes("cuối kỳ") || 
              loaiBaiKiemTra.toLowerCase().includes("cuoi ky") ||
              loaiBaiKiemTra.toLowerCase().includes("ck")) {
            kyHieuLoaiBaiKiemTra = "CK";
          }

          return `
            <tr>
              <td>${pageIndex * STUDENTS_PER_PAGE + index + 1}</td>
              <td>${item.maSinhVien || ""}</td>
              <td>${item.tenSinhVien || ""}</td>
              <td>${item.diemCu !== null ? `${item.diemCu}(${kyHieuLoaiBaiKiemTra})` : ""}</td>
              <td>${item.diemMoi !== null ? `${item.diemMoi}(${kyHieuLoaiBaiKiemTra})` : ""}</td>
              <td></td>
            </tr>
          `;
        }).join('');

        return `
          <div class="page-container" ${pageIndex > 0 ? 'style="page-break-before: always;"' : ''}>
            <!-- Header -->
            <div class="header">
              <p class="title-header">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p class="subtitle-header">Độc lập - Tự do - Hạnh phúc</p>
              <div class="divider"></div>
            </div>
            
            <!-- Title -->
            <div class="main-title">
              <p class="doc-title">ĐƠN ĐỀ NGHỊ ĐÍNH CHÍNH ĐIỂM</p>
              <p class="semester">Học kỳ 2 năm học 2023 - 2024</p>
            </div>
            
            <!-- Recipient -->
            <div class="recipient">
              <p class="recipient-label">Kính gửi:</p>
              <p class="recipient-item">- Ban Giám hiệu Trường Đại học Bách Khoa</p>
              <p class="recipient-item">- Phòng Đào tạo</p>
            </div>
            
            <!-- Lecturer Info -->
            <div class="lecturer-info">
              <p>Tôi tên là: ${getFullname() || "Sena36"}</p>
              <p>Thuộc đơn vị: K. Công nghệ Thông tin</p>
              <p>Lý do đính chính: Giáo viên nhập điểm nhầm.</p>
              <p>Lớp học phần: ${data[0]?.tenLopHocPhan || "Chưa có thông tin"}</p>
              <p>Mã lớp: ${data[0]?.maLopHocPhan || "Chưa có thông tin"}</p>
              <p>như sau:</p>
            </div>
            
            <!-- Student Table -->
            <table class="student-table">
              <tr class="table-header">
                <th>TT</th>
                <th>Mã SV</th>
                <th>Họ tên SV</th>
                <th>Điểm sai</th>
                <th>Điểm đính chính</th>
                <th>Ghi chú</th>
              </tr>
              ${studentRows}
            </table>
            
            ${pageIndex === pages.length - 1 ? `
              <!-- Footer text - chỉ hiển thị ở trang cuối -->
              <div class="footer-text">
                <p>Tôi làm đơn này trình bày sự việc, có kèm bài thi của sinh viên và cam đoan rằng đây là sự thật. Kính đề</p>
                <p>nghị</p>
                <p>Khoa, Phòng cho phép tôi đính chính điểm cho sinh viên.</p>
                <p class="mt-10">Tôi sẽ nghiêm túc rút kinh nghiệm để tránh không xảy ra sai sót nữa.</p>
              </div>
              
              <!-- Signature section - chỉ hiển thị ở trang cuối -->
              <div class="signature">
                <p>Đà Nẵng, ngày ${format(new Date(), 'dd')} tháng ${format(new Date(), 'MM')} năm ${format(new Date(), 'yyyy')}</p>
                <p class="signature-title">Giảng viên</p>
                <p class="signature-name">${getFullname() || "Sena36"}</p>
              </div>
              
              <!-- Department approval section - chỉ hiển thị ở trang cuối -->
              <div class="department-approval">
                <p>Ý kiến của Khoa quản lý chuyên môn</p>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      const htmlContent = `
        ${allPagesHTML}
        <style>
          @media print {
            .page-container {
              page-break-after: always;
            }
          }
          
          .page-container {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            width: 210mm;
            margin: 0 auto;
            padding: 20mm 20mm;
            box-sizing: border-box;
            line-height: 1.5;
          }
          
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .title-header {
            font-weight: bold;
            font-size: 13pt;
            margin-bottom: 3px;
          }
          
          .subtitle-header {
            margin: 0;
          }
          
          .divider {
            width: 40%;
            margin: 5px auto;
            border-top: 1px solid black;
          }
          
          .main-title {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .doc-title {
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 5px;
          }
          
          .semester {
            margin: 0;
          }
          
          .recipient {
            position: relative;
            margin-bottom: 15px;
          }
          
          .recipient-label {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .recipient-item {
            margin: 0;
            padding-left: 40px;
          }
          
          .lecturer-info p {
            margin: 3px 0;
          }
          
          .student-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          
          .student-table th, .student-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
          
          .table-header {
            background-color: #f2f2f2;
          }
          
          .footer-text p {
            margin: 3px 0;
          }
          
          .mt-10 {
            margin-top: 10px;
          }
          
          .signature {
            margin-top: 30px;
            text-align: right;
          }
          
          .signature-title {
            margin-right: 70px;
          }
          
          .signature-name {
            margin-top: 60px;
            margin-right: 50px;
          }
          
          .department-approval {
            margin-top: -80px;
            font-weight: bold;
          }
        </style>
      `;

      // Tạo element tạm thời
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      document.body.appendChild(element);

      // Cấu hình html2pdf
      const options = {
        filename: `Don_Dinh_Chinh_Diem_Tat_Ca.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        margin: 0,
        pagebreak: { mode: 'avoid-all' }
      };

      // Tạo PDF
      return html2pdf()
        .from(element)
        .set(options)
        .save()
        .then(() => {
          document.body.removeChild(element);
          toast({
            title: "Thành công",
            description: "Đã tạo đơn đính chính tổng hợp.",
          });
          return true;
        });

    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo đơn đính chính. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
      throw error;
    }
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
        accessorKey: "maSinhVien",
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
          <div className="px-4 py-2">{row.getValue("maSinhVien")}</div>
        ),
      },
      {
        accessorKey: "tenSinhVien",
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
          <div className="px-4 py-2">{row.getValue("tenSinhVien")}</div>
        ),
      },
      {
        accessorKey: "loaiBaiKiemTra",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Loại Bài Kiểm Tra
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("loaiBaiKiemTra")}</div>
        ),
      },
      {
        accessorKey: "tenCauHoi",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Tên Câu Hỏi
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 py-2">{row.getValue("tenCauHoi")}</div>
        ),
      },
      {
        accessorKey: "diemCu",
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
          if (row.getValue("diemCu") === null || row.getValue("diemCu") === -1) {
            return <div className="px-4 py-2">Chưa nhập</div>;
          }
          return <div className="px-4 py-2">{row.getValue("diemCu")}</div>;
        },
      },
      {
        accessorKey: "diemMoi",
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
          <div className="px-4 py-2">{row.getValue("diemMoi")}</div>
        ),
      },
    ];
    const giangVienColumns = [
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const item = row.original;
          if (isDatePassed(item.hanDinhChinh)) {
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
    ]
    const adminColumns = [
      {
        accessorKey: "thoiDiemMo",
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
          const date = formatDate(row.getValue("thoiDiemMo"));
          return <div className="px-4 py-2">{date}</div>;
        },
      },
      {
        accessorKey: "tenGiangVien",
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
          <div className="px-4 py-2">{row.getValue("tenGiangVien")}</div>
        ),
      },
      {
        accessorKey: "thoiDiemDuyet",
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
          const date = formatDate(row.getValue("thoiDiemDuyet"));
          return <div className="px-4 py-2">{date}</div>;
        },
      },
      {
        accessorKey: "tenNguoiDuyet",
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
          <div className="px-4 py-2">{row.getValue("tenNguoiDuyet")}</div>
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
                    <p>Điểm Đính Chính đã duyệt sẽ trở thành Điểm Chính Thức, bạn có chắc muốn duyệt Điểm Đính Chính này?</p>
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
    ]
    if (role === "GiangVien") return [...baseColumns, ...giangVienColumns];
    if (role === "Admin") return [...baseColumns, ...adminColumns];
    if (role === "PhongDaoTao") return [...baseColumns, ...adminColumns];
    return baseColumns;
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex gap-2 items-center mb-4">
          <ComboBox
            items={lophocphanItems}
            setItemId={setComboBoxLopHocPhanId}
            initialItemId={comboBoxLopHocPhanId}
            placeholder="Chọn lớp học phần"
          />
          <Button onClick={handleGoClick}>Go</Button>
          {role === "GiangVien" && (
            <Button 
              onClick={generateAllPDFInOne}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              In đơn đính chính 
            </Button>
          )}
        </div>
        <DataTable
          entity="DiemDinhChinh"
          createColumns={createDiemDinhChinhColumns}
          data={data}
          setData={setData}
          fetchData={fetchData}
          deleteItem={deleteDiemDinhChinh}
          columnToBeFiltered={"tenSinhVien"}
          ItemForm={DiemDinhChinhForm}
          hasCreateButton={false}
        />
      </div>
    </Layout>
  );
}
