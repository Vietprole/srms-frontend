import { useState, useEffect, useCallback } from "react";
// import { getStudents, getGradeComponents, getQuestions, getGrades } from "@/lib/api"
import { GradeTable } from "@/components/GradeTable";
// import { StudentGrades, GradeComponent, Question, Grade } from "@/types/grades"
import { getSinhViens } from "@/api/api-sinhvien";
import { useParams } from "react-router-dom";
import { getBaiKiemTrasByLopHocPhanId } from "@/api/api-baikiemtra";
import { getKetQuas } from "@/api/api-ketqua";
import { getCauHoisByBaiKiemTraId } from "@/api/api-cauhoi";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// import { set } from "react-hook-form";

export default function GradesPage() {
  const [tableData, setTableData] = useState([]);
  const [components, setComponents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { lopHocPhanId } = useParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDiemTam, setIsDiemTam] = useState(true);

  const fetchData = useCallback(async () => {
    // Fetch all required data
    const [students, components, allGrades] = await Promise.all([
      // getStudents(),
      getSinhViens(null, null, lopHocPhanId),
      // getGradeComponents(),
      getBaiKiemTrasByLopHocPhanId(lopHocPhanId),
      // getGrades(),
      getKetQuas(null, null, lopHocPhanId),
    ]);
    setComponents(components);

    // Fetch questions for each component
    const questionsPromises = components.map(async (component) => ({
      componentId: component.id,
      // questions: await getQuestions(component.id),
      questions: await getCauHoisByBaiKiemTraId(component.id),
    }));
    const questionsData = await Promise.all(questionsPromises);
    const questions = Object.fromEntries(
      questionsData.map(({ componentId, questions }) => [
        // componentId.toString(),
        componentId,
        questions,
      ])
    );
    setQuestions(questions);

    const isConfirmed = allGrades.length > 0 && allGrades.every(grade => grade.daXacNhan);
    console.log("allGrades", allGrades);
    setIsConfirmed(isConfirmed);

    // Transform data into the required format
    const tableData = students.map((student) => ({
      ...student,
      // tt: index + 1, // Add tt (ordinal number) to each student
      grades: Object.fromEntries(
        components.map((component) => [
          component.loai,
          Object.fromEntries(
            (questions[component.id.toString()] || []).map((question) => {
              const grade = allGrades.find(
                (g) =>
                  g.sinhVienId === student.id && g.cauHoiId === question.id
              );
              console.log("grade", grade);
              // return [question.id.toString(), grade?.diem || 0];
              if (isDiemTam) {
                return [question.id, grade?.diemTam === 0 ? 0 : grade?.diemTam || null];
              } else {
                return [question.id, grade?.diemChinhThuc === 0 ? 0 : grade?.diemChinhThuc || null];
              }
              // return [question.id, grade?.diemTam === 0 ? 0 : grade?.diemTam || null];
              // return [question.id, grade?.diemTam || 0];
            })
          ),
        ])
      ),
      diemChinhThucs: Object.fromEntries(
        components.map((component) => [
          component.loai,
          Object.fromEntries(
            (questions[component.id.toString()] || []).map((question) => {
              const grade = allGrades.find(
                (g) =>
                  g.sinhVienId === student.id && g.cauHoiId === question.id
              );
              console.log("grade", grade);
              // return [question.id.toString(), grade?.diem || 0];
              return [question.id, grade?.diemChinhThuc === 0 ? 0 : grade?.diemChinhThuc || null];
              // return [question.id, grade?.diemTam || 0];
            })
          ),
        ])
      ),
      cauHois: components.flatMap(component => 
        questions[component.id.toString()]?.map(q => q.id) || []
      ),
    }));
    setTableData(tableData);
  }, [lopHocPhanId, isDiemTam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : '';
  }

  console.log("tableData", tableData);
  const latestHanDinhChinh = new Date(Math.max(
    ...components.map(component => new Date(component.hanDinhChinh))
  )).toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bảng điểm học phần</h1>
      <p>Hạn cuối đính chính: {latestHanDinhChinh}</p>
      <div className="flex items-center space-x-2">
        <Label htmlFor="diem-mode">Điểm tạm</Label>
        <Switch id="diem-mode"
          onCheckedChange={(check) => {setIsDiemTam(!check);}}
        />
        <Label htmlFor="diem-mode">Điểm chính thức</Label>
      </div>
      {console.log("tableData", tableData)}
      {tableData.length > 0 && (
        <GradeTable
          data={tableData}
          fetchData={fetchData}
          components={components}
          questions={questions}
          isConfirmed={isConfirmed}
        />
      )}
    </div>
  );
}
