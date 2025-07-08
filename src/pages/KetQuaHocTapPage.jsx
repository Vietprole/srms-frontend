// import { getStudents, getGradeComponents, getQuestions, getGrades } from "@/lib/api"
// import { StudentGrades, GradeComponent, Question, Grade } from "@/types/grades"
// import { set } from "react-hook-form";
import Layout from "@/pages/Layout";
import { getStudentId } from "@/utils/storage";
import { StudentResult } from "@/components/StudentResult";

// const lopHocPhans = [
//   { "id": 1, "name": "PBL6 - Vẽ kỹ thuật cơ khí" },
//   { "id": 2, "name": "PBL5 - CNPM" },
//   { "id": 3, "name": "PBL4 - CNPM" },
// ];

// const baiKiemTras = [
//   { "id": 5, "type": "GK", "classId": 1 },
//   { "id": 6, "type": "CK", "classId": 1 },
//   { "id": 7, "type": "GK", "classId": 2 },
//   { "id": 8, "type": "CK", "classId": 2 },
//   { "id": 9, "type": "BT", "classId": 3 },
//   { "id": 10, "type": "BT", "classId": 1 },
// ];

// const cauHois = [
//   { "id": 1, "name": "Câu 1", "examId": 5, "thangDiem": 3.5 },
//   { "id": 2, "name": "Câu 2", "examId": 5, "thangDiem": 2.5 },
//   { "id": 3, "name": "Câu 3", "examId": 5, "thangDiem": 2.5 },
//   { "id": 4, "name": "Diem Danh", "examId": 6, "thangDiem": 2.5 },
//   { "id": 5, "name": "Dinh Ky", "examId": 6, "thangDiem": 2.5 },
//   { "id": 6, "name": "Câu 1", "examId": 7, "thangDiem": 2.5 },
//   { "id": 7, "name": "Câu 2", "examId": 7, "thangDiem": 2.5 },
//   { "id": 8, "name": "Câu 1", "examId": 8, "thangDiem": 5.0 },
//   { "id": 9, "name": "Câu 2", "examId": 8, "thangDiem": 5.0 },
//   { "id": 10, "name": "Câu 2", "examId": 9, "thangDiem": 5.0 },
//   { "id": 11, "name": "Câu 2x", "examId": 10, "thangDiem": 5.0 },
// ];

// const ketQuas = [
//   { "id": 1, "temporaryScore": 3.0, "officialScore": 3.2, "questionId": 1, "studentId": 1 },
//   { "id": 2, "temporaryScore": 2.0, "officialScore": 2.2, "questionId": 2, "studentId": 1 },
//   { "id": 3, "temporaryScore": 2.0, "officialScore": 2.1, "questionId": 3, "studentId": 1 },
//   { "id": 4, "temporaryScore": 2.0, "officialScore": null, "questionId": 4, "studentId": 1 },
//   { "id": 5, "temporaryScore": 2.2, "officialScore": null, "questionId": 5, "studentId": 1 },
//   { "id": 6, "temporaryScore": 2.0, "officialScore": 2.2, "questionId": 6, "studentId": 1 },
//   { "id": 7, "temporaryScore": 2.3, "officialScore": 2.4, "questionId": 7, "studentId": 1 },
//   { "id": 8, "temporaryScore": 4.5, "officialScore": null, "questionId": 8, "studentId": 1 },
//   { "id": 9, "temporaryScore": 4.8, "officialScore": null, "questionId": 9, "studentId": 1 },
//   { "id": 10, "temporaryScore": 4.81, "officialScore": null, "questionId": 10, "studentId": 1 },
//   { "id": 11, "temporaryScore": 4.81, "officialScore": null, "questionId": 11, "studentId": 1 },
//   { "id": 12, "temporaryScore": 4.85, "officialScore": null, "questionId": 11, "studentId": 2 },
// ];

export default function KetQuaHocTapPage() {
  return (
    <Layout>
      <StudentResult studentId={getStudentId()} />
    </Layout>
  );
}
