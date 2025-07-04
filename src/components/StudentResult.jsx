import { useEffect, useState, useCallback } from "react";
import { getBaiKiemTrasByLopHocPhanId } from "@/api-new/api-baikiemtra";
import { getKetQuas } from "@/api-new/api-ketqua";
import { getQuestionsByExamId } from "@/api-new/api-cauhoi";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getFilteredClasses } from "@/api-new/api-class";
import StudentPLOScore from "@/components/StudentPLOScore";

export const StudentResult = ({ studentId }) => {
  // const [studentId, setStudentId] = useState(getStudentId());
  const [useTemporaryScore, setUseTemporaryScore] = useState(true);
  const [data, setData] = useState({
    lopHocPhans: [],
    baiKiemTras: [],
    cauHois: [],
    ketQuas: [],
  });
  // const role = getRole();

  useEffect(() => {
    const fetchData = async () => {
      const lopHocPhans = await getFilteredClasses(null, null, null, studentId);
      const allBaiKiemTras = [];
      const allCauHois = [];

      for (const lopHocPhan of lopHocPhans) {
        const baiKiemTras = await getBaiKiemTrasByLopHocPhanId(lopHocPhan.id);
        allBaiKiemTras.push(...baiKiemTras);

        for (const baiKiemTra of baiKiemTras) {
          const cauHois = await getQuestionsByExamId(baiKiemTra.id);
          allCauHois.push(...cauHois);
        }
      }

      const ketQuas = await getKetQuas(null, studentId, null);
      setData({
        lopHocPhans,
        baiKiemTras: allBaiKiemTras,
        cauHois: allCauHois,
        ketQuas,
      });
    };
    fetchData();
  }, [studentId]);

  const getUniqueBaiKiemTraLoai = useCallback(() => {
    return [...new Set(data.baiKiemTras.map((bkt) => bkt.type))];
  }, [data.baiKiemTras]);

  return (
    <div className="w-full">
      <StudentPLOScore studentId={studentId} />
      <h1 className="text-2xl font-bold mb-2 mt-2">Kết quả học tập</h1>
      <div className="flex items-center space-x-2">
        <Label htmlFor="diem-mode">Điểm tạm</Label>
        <Switch
          id="diem-mode"
          onCheckedChange={(check) => {
            setUseTemporaryScore(!check);
          }}
        />
        <Label htmlFor="diem-mode">Điểm chính thức</Label>
      </div>
      <div className="text-md">
        Cách thức hiển thị điểm: điểm/điểm tối đa của bài/câu hỏi đánh giá &nbsp;&nbsp; điểm bài/câu hỏi đánh giá (thang 10)
      </div>
      {/* <div>
        <span className="text-blue-600">Điểm màu xanh dương</span>: giảng viên chưa xác nhận điểm này
      </div>
      <div>
        <span className="text-green-600">Điểm màu xanh lá</span>: giảng viên đã xác nhận điểm này
      </div> */}
      <div className="w-full max-w-full overflow-x-auto">
        <table className="border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 min-w-[200px]">
                Lớp học phần
              </th>
              <th className="border border-gray-300 min-w-[200px]">
                Mã lớp học phần
              </th>
              {getUniqueBaiKiemTraLoai().map((type) => (
                <th key={type} className="border border-gray-300">
                  {type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.lopHocPhans.map((lhp) => (
              <tr key={lhp.id}>
                <td className="border border-gray-300">{lhp.name}</td>
                <td className="border border-gray-300">{lhp.code}</td>
                {getUniqueBaiKiemTraLoai().map((type) => {
                  const bkt = data.baiKiemTras.find(
                    (b) => b.type === type && b.classId === lhp.id
                  );

                  const cauHois = bkt
                    ? data.cauHois.filter((ch) => ch.examId === bkt.id)
                    : [];

                  return (
                    <td
                      key={`${lhp.id}-${type}`}
                      className="border border-gray-300 p-0"
                    >
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            {cauHois.map((cauHoi) => {
                              const ketQua = data.ketQuas.find(
                                (kq) => kq.questionId === cauHoi.id
                              );
                              return (
                                <td
                                  key={cauHoi.id}
                                  className="border-l first:border-l-0 border-gray-200"
                                >
                                  <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <div className="font-medium text-sm text-center border-b border-gray-200 pb-1 w-full">
                                      {cauHoi.name}
                                    </div>
                                    <div className="flex items-center text-sm">
                                      {console.log("ketQua", ketQua)}
                                      {/* <span className={`${ketQua?.isConfirmed ? "text-green-600" : "text-blue-600"} text-center`}>
                                        {useTemporaryScore &&
                                          (ketQua?.temporaryScore === 0
                                            ? 0
                                            : ketQua?.temporaryScore || "-")}
                                        {!useTemporaryScore &&
                                          (ketQua?.officialScore === 0
                                            ? 0
                                            : ketQua?.officialScore || "-")}
                                      </span> */}
                                      <span className="text-blue-600">
                                        {ketQua?.isConfirmed
                                          ? useTemporaryScore
                                            ? ketQua.temporaryScore
                                              ? ketQua.temporaryScore
                                              : "-"
                                            : ketQua.OfficialScore
                                            ? ketQua.OfficialScore
                                            : "-"
                                          : "-"}
                                      </span>
                                      <span>/{cauHoi.scale}</span>
                                      <span className="ml-2">
                                        {cauHoi.weight}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
