import { getClassById } from "@/api-new/api-class";
import { getTeacherById } from "@/api/api-teachers";
import { getTeacherId } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import { useState, useEffect, useRef } from "react";

function formatVietnameseDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const year = date.getFullYear();

  return `ngày ${day} tháng ${month} năm ${year}`;
}

function formatSemesterName(semesterName) {
  semesterName = semesterName.replace("Kỳ", "kỳ");
  const parts = semesterName.split("-");
  const semesterPart = parts[0];
  const yearPart = parts.slice(1).join("-");
  return `${semesterPart} năm học ${yearPart}`;
}

export function CorrectedResultDocument({ classId, correctedResults }) {
  const teacherId = getTeacherId();
  const [classData, setClassData] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pdfRef = useRef(null);

  const formattedDate = formatVietnameseDate(new Date());

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        // Set loading to true at the start
        setIsLoading(true);

        // Fetch data
        const classItem = await getClassById(classId);
        const teacherData = await getTeacherById(teacherId);

        // Update state with fetched data
        setClassData(classItem);
        setTeacher(teacherData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Set loading to false AFTER data is fetched
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, [classId, teacherId]);

  const exportToPDF = async () => {
    const element = pdfRef.current;
    html2pdf(element, {
      margin: 0.5,
      filename: `Dinh-chinh.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
    })
      .then(() => {
        console.log("PDF exported successfully");
      })
      .catch((error) => {
        console.error("Error exporting PDF:", error);
      });
  };

  // Add an additional check for classData
  if (isLoading || !classData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
        className="px-[1cm]"
        ref={pdfRef}
      >
        <header>
          <p className="text-center font-bold">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </p>
          <p className="text-center underline underline-offset-4">
            Độc lập - Tự do - Hạnh phúc
          </p>
        </header>
        <h1 className="text-center text-xl font-bold mt-10">
          ĐƠN ĐỀ NGHỊ ĐÍNH CHÍNH ĐIỂM
        </h1>
        <p className="text-center">
          {formatSemesterName(classData.semesterName)}
        </p>
        <div className="flex mt-2 ml-[100px] font-bold">
          <p>Kính gửi:</p>
          <p className="ml-[40px]">
            - Ban Giám hiệu trường Đại học Bách Khoa
            <br />- Phòng Đào tạo{" "}
          </p>
        </div>
        {teacher && (
          <>
            <p>Tôi tên là: {teacher.name}</p>
            <p>Thuộc đơn vị: {teacher.workUnit}</p>
          </>
        )}
        <span>Lý do đính chính: </span>
        <input type="text" placeholder="Nhập lý do tại đây..." />
        <p>
          Lớp học phần:{" "}
          <span className="font-bold italic">{classData.name}</span>{" "}
          <span className="ml-4">Mã lớp: </span>
          <span className="font-bold italic">{classData.code}</span>
        </p>
        <p>như sau:</p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-black">TT</th>
              <th className="border border-black">Mã SV</th>
              <th className="border border-black">Họ tên SV</th>
              <th className="border border-black">Điểm sai</th>
              <th className="border border-black">Điểm đính chính</th>
            </tr>
          </thead>
          <tbody>
            {correctedResults.map((result, index) => (
              <tr key={index}>
                <td className="border border-black">{index + 1}</td>
                <td className="border border-black">{result.studentCode}</td>
                <td className="border border-black">{result.studentName}</td>
                <td className="border border-black">{result.oldScore}</td>
                <td className="border border-black">{result.newScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Tôi làm đơn này trình bày sự việc, có kèm bài thi của sinh viên và cam
          đoan rằng đây là sự thật. Kính đề nghị Khoa, phòng cho phép tôi đính
          chính điểm cho sinh viên.
        </p>
        <p>
          Tôi sẽ nghiêm túc rút kinh nghiệm để tránh không xảy ra sai sót nữa.
        </p>
        <p className="text-right italic">Đà Nẵng, {formattedDate}</p>
        <div className="flex justify-between">
          <div>
            <p className="font-bold text-center">
              Ý kiến của Khoa quản lý chuyên môn
            </p>
            <p className="font-bold text-center mt-40">
              Ý kiến của Phòng Đào tạo
            </p>
            <p className="text-center italic [word-spacing:20px]">
              Ngày tháng năm
            </p>
          </div>
          <div className="w-[250px]">
            <p className="font-bold text-center">Giảng viên</p>
            <p className="text-center mt-20">{teacher.name}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-20">
        <Button onClick={exportToPDF}>Tải xuống PDF</Button>
      </div>
    </>
  );
}
