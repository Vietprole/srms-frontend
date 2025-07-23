import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "@/utils/storage";

const downloadExcelFile = async (url, fileName) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: getAccessToken(),
      },
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error("Lỗi tải file Excel:", err);
    alert("Không thể tải file. Vui lòng thử lại.");
  }
};


export const exportAllFaculties = () =>
  downloadExcelFile(`${API_BASE_URL}/api/export/faculties`, "Danh sách khoa.xlsx");

export const exportAllTeachers = () =>
  downloadExcelFile(`${API_BASE_URL}/api/export/teachers`, "Danh sách giảng viên.xlsx");

export const exportTeachersByWorkUnit = (workUnitId) =>
  downloadExcelFile(
    `${API_BASE_URL}/api/export/teachers/workunit/${workUnitId}`,
    "Danh sách giảng viên theo đơn vị công tác.xlsx"
  );

export const exportStudentsByFaculty = (facultyId) =>
  downloadExcelFile(
    `${API_BASE_URL}/api/export/students/faculty/${facultyId}`,
    "Danh sách sinh viên theo khoa.xlsx"
  );

export const exportStudentsByProgramme = (programmeId) =>
  downloadExcelFile(
    `${API_BASE_URL}/api/export/students/programme/${programmeId}`,
    "Danh sách sinh viên theo chương trình đào tạo.xlsx"
  );

export const exportAllCourses = () =>
  downloadExcelFile(`${API_BASE_URL}/api/export/courses`, "Danh sách học phần.xlsx");

export const exportCoursesByFaculty = (facultyId) =>
  downloadExcelFile(
    `${API_BASE_URL}/api/export/courses/faculty/${facultyId}`,
    "Danh sách học phần theo khoa.xlsx"
  );

export const exportCoursesByProgramme = (programmeId) =>
  downloadExcelFile(
    `${API_BASE_URL}/api/export/courses/programme/${programmeId}`,
    "Danh sách học phần theo chương trình đào tạo.xlsx"
  );

export const exportAllClasses = () =>
  downloadExcelFile(`${API_BASE_URL}/api/export/classes`, "Danh sách lớp học phần.xlsx");

export const exportClassesByCourse = (courseId) =>
  downloadExcelFile(
    `${API_BASE_URL}/api/export/classes/course/${courseId}`,
    "Danh sách lớp học phần theo học phần.xlsx"
  );

export const exportClassesBySemester = (semesterId) =>
  downloadExcelFile(
    `${API_BASE_URL}/api/export/classes/semester/${semesterId}`,
    "Danh sách lớp học phần theo học kỳ.xlsx"
  );

export const exportClassesByTeacher = (teacherId) =>
  downloadExcelFile(
    `${API_BASE_URL}/api/export/classes/teacher/${teacherId}`,
    "Danh sách lớp học phần theo giảng viên.xlsx"
  );

export const exportScoreCLO = (classId, isBase10 = false, passedThreshold = 0.5) => {
  const query = `?isBase10=${isBase10}&passedThreshold=${passedThreshold}`;
  const fileName = `Diem_CLO_Lop_${classId}${isBase10 ? "_He10" : ""}.xlsx`;
  return downloadExcelFile(`${API_BASE_URL}/api/export/score/clo/${classId}${query}`, fileName);
};

export const exportScoreComponent = (classId, examId, useTemporaryScore = true) => {
  const query = `?classId=${classId}&examId=${examId}&useTemporaryScore=${useTemporaryScore}`;
  const fileName = `Bang_diem_${useTemporaryScore ? "tam_thoi" : "chinh_thuc"}_Cua_Lop_Hoc_Phan.xlsx`;
  return downloadExcelFile(`${API_BASE_URL}/api/export/score/component${query}`, fileName);
};
export const importGradeFromExcel = async (classId, examId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/export/grades/import?classId=${classId}&examId=${examId}`,
      formData,
      {
        headers: {
          Authorization: getAccessToken(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("Lỗi khi import điểm:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi không xác định khi import điểm",
    };
  }
};
