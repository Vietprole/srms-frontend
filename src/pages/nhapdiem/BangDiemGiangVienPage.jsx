import { useState, useEffect, useCallback } from "react";
// import { getStudents, getGradeComponents, getQuestions, getGrades } from "@/lib/api"
import { GradeTable } from "@/components/GradeTable";
// import { StudentGrades, GradeComponent, Question, Grade } from "@/types/grades"
import { getSinhViens } from "@/api/api-sinhvien";
import { useParams } from "react-router-dom";
import { getBaiKiemTraById, getBaiKiemTrasByLopHocPhanId } from "@/api/api-baikiemtra";
import { getKetQuas } from "@/api/api-ketqua";
import { getCauHoisByBaiKiemTraId } from "@/api/api-cauhoi";
import { ComboBox } from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
// import { set } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function BangDiemGiangVienPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const baiKiemTraIdParam = searchParams.get("baiKiemTraId");
  const [tableData, setTableData] = useState([]);
  const [components, setComponents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { lopHocPhanId } = useParams();
  const [baiKiemTraItems, setBaiKiemTraItems] = useState([]);
  const [baiKiemTraId, setBaiKiemTraId] = useState(baiKiemTraIdParam);
  const [comboBoxBaiKiemTraId, setComboBoxBaiKiemTraId] = useState(baiKiemTraIdParam);
  const [isConfirmed, setIsConfirmed] = useState(false);
  console.log("lopHocPhanId", lopHocPhanId);

  const fetchData = useCallback(async () => {
    const baiKiemTraData = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
    const mappedComboBoxItems = baiKiemTraData.map(baiKiemTra => ({ label: baiKiemTra.loai, value: baiKiemTra.id }));
    setBaiKiemTraItems(mappedComboBoxItems);
    console.log("mappedComboBoxItems", mappedComboBoxItems);
    
    // Fetch all required data
    const [students, component, allGrades] = await Promise.all([
      // getStudents(),
      getSinhViens(null, null, lopHocPhanId),
      // getGradeComponents(),
      getBaiKiemTraById(baiKiemTraId),
      // getGrades(),
      getKetQuas(baiKiemTraId, null, null),
    ]);
    // Map khoa items to be used in ComboBox
    const components = [component];
    setComponents(components);

    const isConfirmed = allGrades.length > 0 && allGrades.every(grade => grade.daXacNhan);
    console.log("allGrades", allGrades);
    setIsConfirmed(isConfirmed);

    // Fetch questions for each component
    const questionsPromises = components.map(async (component) => ({
      componentId: component.id,
      // questions: await getQuestions(component.id),
      questions: await getCauHoisByBaiKiemTraId(baiKiemTraId),
    }));

    const questionsData = await Promise.all(questionsPromises);
    // const questionsData = await getCauHoisByBaiKiemTraId(baiKiemTraId);
    const questions = Object.fromEntries(
      questionsData.map(({ componentId, questions }) => [
        // componentId.toString(),
        componentId,
        questions,
      ])
    );
    setQuestions(questions);
    

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
              // return [question.id.toString(), grade?.diem || 0];
              return [question.id, grade?.diemTam === 0 ? 0 : grade?.diemTam || null];
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
      cauHois: questions[component.id.toString()].map(q => q.id),
    }));
    setTableData(tableData);
  },[baiKiemTraId, lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setBaiKiemTraId(comboBoxBaiKiemTraId);
    if (comboBoxBaiKiemTraId === "") {
      navigate(`.`);
      return;
    }
    navigate(`.?baiKiemTraId=${comboBoxBaiKiemTraId}`);
  };
  const component = components[0] || {};
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : '';
  }
  const ngayMoNhapDiem = formatDate(component.ngayMoNhapDiem);
  const hanNhapDiem = formatDate(component.hanNhapDiem);
  const hanDinhChinh = formatDate(component.hanDinhChinh);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nhập điểm cho từng thành phần</h1>
      <div className="flex">
        <ComboBox items={baiKiemTraItems} setItemId={setComboBoxBaiKiemTraId} initialItemId={comboBoxBaiKiemTraId}/>
        <Button onClick={handleGoClick}>Go</Button>
      </div>
      <p>Mở nhập điểm bắt đầu từ ngày: {ngayMoNhapDiem}</p>
      <p>Hạn nhập điểm đến hết ngày: {hanNhapDiem}</p>
      <p>Hạn đính chính đến hết ngày: {hanDinhChinh}</p>
      {console.log("tableData, components, questions", tableData, components, questions)}
      {tableData.length > 0 && (
        <GradeTable
          data={tableData}
          fetchData={fetchData}
          components={components}
          questions={questions}
          isGiangVienMode={true}
          isConfirmed={isConfirmed}
        />
      )}
    </div>
  );
}
