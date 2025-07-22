import { useState, useEffect, useCallback } from "react";
// import { getStudents, getGradeComponents, getQuestions, getGrades } from "@/lib/api"
import { GradeTable } from "@/components/GradeTable";
// import { StudentGrades, GradeComponent, Question, Grade } from "@/types/grades"
import { getFilteredStudents } from "@/api-new/api-student";
import { useParams } from "react-router-dom";
import { getBaiKiemTraById, getBaiKiemTrasByLopHocPhanId } from "@/api-new/api-baikiemtra";
import { getKetQuas } from "@/api-new/api-ketqua";
import { getQuestionsByExamId } from "@/api-new/api-cauhoi";
import { ComboBox } from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
// import { set } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { NewGradeTable } from "@/components/NewGradeTable";

export default function BangDiemGiangVienPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examIdParam = searchParams.get("examId");
  const [tableData, setTableData] = useState([]);
  const [components, setComponents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { lopHocPhanId } = useParams();
  const [baiKiemTraItems, setBaiKiemTraItems] = useState([]);
  const [examId, setExamId] = useState(examIdParam);
  const [comboBoxExamId, setComboBoxExamId] = useState(examIdParam);
  const [isConfirmed, setIsConfirmed] = useState(false);
  console.log("lopHocPhanId", lopHocPhanId);

  const fetchData = useCallback(async () => {
    const baiKiemTraData = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
    const mappedComboBoxItems = baiKiemTraData.map(baiKiemTra => ({ label: baiKiemTra.type, value: baiKiemTra.id }));
    setBaiKiemTraItems(mappedComboBoxItems);
    console.log("mappedComboBoxItems", mappedComboBoxItems);
    
    // Fetch all required data
    const [students, component, allGrades] = await Promise.all([
      // getStudents(),
      getFilteredStudents(null, null, lopHocPhanId),
      // getGradeComponents(),
      getBaiKiemTraById(examId),
      // getGrades(),
      getKetQuas(examId, null, null),
    ]);
    // Map khoa items to be used in ComboBox
    const components = [component];
    setComponents(components);

    const isConfirmed = allGrades.length > 0 && allGrades.every(grade => grade.isConfirmed);
    console.log("allGrades", allGrades);
    setIsConfirmed(isConfirmed);

    // Fetch questions for each component
    const questionsPromises = components.map(async (component) => ({
      componentId: component.id,
      // questions: await getQuestions(component.id),
      questions: await getQuestionsByExamId(examId),
    }));

    const questionsData = await Promise.all(questionsPromises);
    // const questionsData = await getQuestionsByExamId(examId);
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
          component.type,
          Object.fromEntries(
            (questions[component.id.toString()] || []).map((question) => {
              const grade = allGrades.find(
                (g) =>
                  g.studentId === student.id && g.questionId === question.id
              );
              // return [question.id.toString(), grade?.diem || 0];
              return [question.id, grade?.temporaryScore === 0 ? 0 : grade?.temporaryScore || null];
              // return [question.id, grade?.temporaryScore || 0];
            })
          ),
        ])
      ),
      officialScores: Object.fromEntries(
        components.map((component) => [
          component.type,
          Object.fromEntries(
            (questions[component.id.toString()] || []).map((question) => {
              const grade = allGrades.find(
                (g) =>
                  g.studentId === student.id && g.questionId === question.id
              );
              console.log("grade", grade);
              // return [question.id.toString(), grade?.diem || 0];
              return [question.id, grade?.officialScore === 0 ? 0 : grade?.officialScore || null];
              // return [question.id, grade?.temporaryScore || 0];
            })
          ),
        ])
      ),
      cauHois: questions[component.id.toString()].map(q => q.id),
    }));
    setTableData(tableData);
  },[examId, lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setExamId(comboBoxExamId);
    if (comboBoxExamId === "") {
      navigate(`.`);
      return;
    }
    navigate(`.?examId=${comboBoxExamId}`);
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
  const scoreEntryStartDate = formatDate(component.scoreEntryStartDate);
  const scoreEntryDeadline = formatDate(component.scoreEntryDeadline);
  const scoreCorrectionDeadline = formatDate(component.scoreCorrectionDeadline);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nhập điểm cho từng thành phần</h1>
      <div className="flex">
        <ComboBox items={baiKiemTraItems} setItemId={setComboBoxExamId} initialItemId={comboBoxExamId} placeholder="Chọn thành phần đánh giá"/>
        <Button onClick={handleGoClick}>Go</Button>
      </div>
      <p>Mở nhập điểm bắt đầu từ ngày: {scoreEntryStartDate}</p>
      <p>Hạn nhập điểm đến hết ngày: {scoreEntryDeadline}</p>
      <p>Hạn đính chính đến hết ngày: {scoreCorrectionDeadline}</p>
      {console.log("tableData, components, questions", tableData, components, questions)}
      {/* {tableData.length > 0 && (
        <GradeTable
          data={tableData}
          fetchData={fetchData}
          components={components}
          questions={questions}
          isGiangVienMode={true}
          isConfirmed={isConfirmed}
        />
      )} */}

      {tableData.length > 0 && (
        <NewGradeTable
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
