import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
// import { getStudents, getGradeComponents, getQuestions, getGrades } from "@/lib/api"
import { GradeTable } from "@/components/GradeTable"
import { getSinhViensByLopHocPhanId } from "@/api/api-lophocphan"

function getStudents() {
  // Simulated API call
  return [
    { tt: 1, mssv: "102210080", name: "Huỳnh Duy Tín" },
    // ... more students
  ]
}

function getGradeComponents(){
  // Simulated API call
  return [
    { id: "gk", name: "GK", percentage: 20 },
    { id: "bt", name: "BT", percentage: 20 },
    { id: "qt", name: "QT", percentage: 20 },
  ]
}

function getQuestions(componentId) {
  // Simulated API call
  if (componentId === "gk") {
    return Array.from({ length: 4 }, (_, i) => ({
      id: `cau${i + 1}`,
      name: `Câu ${i + 1}`,
      points: 2.5,
    }))
  }
  if (componentId === "bt") {
    return Array.from({ length: 4 }, (_, i) => ({
      id: `cau${i + 1}`,
      name: `Câu ${i + 1}`,
      points: 2.5,
    }))
  }
  if (componentId === "qt") {
    return Array.from({ length: 4 }, (_, i) => ({
      id: `cau${i + 1}`,
      name: `Câu ${i + 1}`,
      points: 2.5,
    }))
  }
  // Add similar logic for other components
  return []
}

function getGrades() {
  // Simulated API call
  return [
    {
      "diem": 1.8,
      "sinhVienId": 8,
      "cauHoiId": "cau1"
    }
  ]
}

export default function BangDiem() {
  const [tableData, setTableData] = useState([]);
  // const [students, setStudents] = useState([]);
  const [components, setComponents] = useState([]);
  // const [grades, setGrades] = useState([]);
  const [questions, setQuestions] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const { lopHocPhanId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const [students, components, grades] = await Promise.all([
        // getStudents(),
        getSinhViensByLopHocPhanId(lopHocPhanId),
        getGradeComponents(),
        getGrades(),
      ]);

      // setStudents(students);
      setComponents(components);
      // setGrades(grades);

      const questionsPromises = components.map(async (component) => ({
        componentId: component.id,
        questions: await getQuestions(component.id),
      }));
      const questionsData = await Promise.all(questionsPromises);
      const questions = Object.fromEntries(
        questionsData.map(({ componentId, questions }) => [componentId, questions])
      );
      setQuestions(questions);

      const tableData = students.map((student) => ({
        ...student,
        grades: Object.fromEntries(
          components.map((component) => [
            component.id,
            Object.fromEntries(
              (questions[component.id] || []).map((question) => {
                const grade = grades.find(
                  (g) =>
                    g.sinhVienId === student.id &&
                    // g.componentId === component.id &&
                    g.cauHoiId === question.id
                );
                return [question.id, grade?.diem || 0];
              })
            ),
          ])
        ),
      }));
      setTableData(tableData);
      // setLoading(false);
    };

    fetchData();
  }, [lopHocPhanId]);

  const handleSaveChanges = async () => {
    try {
      // TODO Implement the logic to save changes
      setIsEditable(false);
      console.log("Changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Bảng điểm học phần</h1>
      <Button
        onClick={() => {
          if (isEditable) {
            handleSaveChanges();
          } else {
            setIsEditable(true);
          }
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isEditable ? "Save Changes" : "Enable Edit"}
      </Button>
      {tableData.length > 0 && (
          <GradeTable
            data={tableData}
            components={components}
            questions={questions}
            isEditable={isEditable}
          />
        )}
    </div>
  )
}
