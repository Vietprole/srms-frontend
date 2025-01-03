import { useState, useEffect, useCallback } from "react";
// import { getStudents, getGradeComponents, getQuestions, getGrades } from "@/lib/api"
// import { StudentGrades, GradeComponent, Question, Grade } from "@/types/grades"
import { getBaiKiemTrasByLopHocPhanId } from "@/api/api-baikiemtra";
import { getKetQuas } from "@/api/api-ketqua";
import { getCauHoisByBaiKiemTraId } from "@/api/api-cauhoi";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// import { set } from "react-hook-form";
import Layout from "@/pages/Layout";
import { getLopHocPhans } from "@/api/api-lophocphan";
import { getSinhVienId } from "@/utils/storage";
import { getRole } from "@/utils/storage";

// const lopHocPhans = [
//   { "id": 1, "ten": "PBL6 - Vẽ kỹ thuật cơ khí" },
//   { "id": 2, "ten": "PBL5 - CNPM" },
//   { "id": 3, "ten": "PBL4 - CNPM" },
// ];

// const baiKiemTras = [
//   { "id": 5, "loai": "GK", "lopHocPhanId": 1 },
//   { "id": 6, "loai": "CK", "lopHocPhanId": 1 },
//   { "id": 7, "loai": "GK", "lopHocPhanId": 2 },
//   { "id": 8, "loai": "CK", "lopHocPhanId": 2 },
//   { "id": 9, "loai": "BT", "lopHocPhanId": 3 },
//   { "id": 10, "loai": "BT", "lopHocPhanId": 1 },
// ];

// const cauHois = [
//   { "id": 1, "ten": "Câu 1", "baiKiemTraId": 5, "thangDiem": 3.5 },
//   { "id": 2, "ten": "Câu 2", "baiKiemTraId": 5, "thangDiem": 2.5 },
//   { "id": 3, "ten": "Câu 3", "baiKiemTraId": 5, "thangDiem": 2.5 },
//   { "id": 4, "ten": "Diem Danh", "baiKiemTraId": 6, "thangDiem": 2.5 },
//   { "id": 5, "ten": "Dinh Ky", "baiKiemTraId": 6, "thangDiem": 2.5 },
//   { "id": 6, "ten": "Câu 1", "baiKiemTraId": 7, "thangDiem": 2.5 },
//   { "id": 7, "ten": "Câu 2", "baiKiemTraId": 7, "thangDiem": 2.5 },
//   { "id": 8, "ten": "Câu 1", "baiKiemTraId": 8, "thangDiem": 5.0 },
//   { "id": 9, "ten": "Câu 2", "baiKiemTraId": 8, "thangDiem": 5.0 },
//   { "id": 10, "ten": "Câu 2", "baiKiemTraId": 9, "thangDiem": 5.0 },
//   { "id": 11, "ten": "Câu 2x", "baiKiemTraId": 10, "thangDiem": 5.0 },
// ];

// const ketQuas = [
//   { "id": 1, "diemTam": 3.0, "diemChinhThuc": 3.2, "cauHoiId": 1, "sinhVienId": 1 },
//   { "id": 2, "diemTam": 2.0, "diemChinhThuc": 2.2, "cauHoiId": 2, "sinhVienId": 1 },
//   { "id": 3, "diemTam": 2.0, "diemChinhThuc": 2.1, "cauHoiId": 3, "sinhVienId": 1 },
//   { "id": 4, "diemTam": 2.0, "diemChinhThuc": null, "cauHoiId": 4, "sinhVienId": 1 },
//   { "id": 5, "diemTam": 2.2, "diemChinhThuc": null, "cauHoiId": 5, "sinhVienId": 1 },
//   { "id": 6, "diemTam": 2.0, "diemChinhThuc": 2.2, "cauHoiId": 6, "sinhVienId": 1 },
//   { "id": 7, "diemTam": 2.3, "diemChinhThuc": 2.4, "cauHoiId": 7, "sinhVienId": 1 },
//   { "id": 8, "diemTam": 4.5, "diemChinhThuc": null, "cauHoiId": 8, "sinhVienId": 1 },
//   { "id": 9, "diemTam": 4.8, "diemChinhThuc": null, "cauHoiId": 9, "sinhVienId": 1 },
//   { "id": 10, "diemTam": 4.81, "diemChinhThuc": null, "cauHoiId": 10, "sinhVienId": 1 },
//   { "id": 11, "diemTam": 4.81, "diemChinhThuc": null, "cauHoiId": 11, "sinhVienId": 1 },
//   { "id": 12, "diemTam": 4.85, "diemChinhThuc": null, "cauHoiId": 11, "sinhVienId": 2 },
// ];

export default function KetQuaHocTapPage() {
  const [sinhVienId, setSinhVienId] = useState(getSinhVienId());
  const [data, setData] = useState({
    lopHocPhans: [],
    baiKiemTras: [],
    cauHois: [],
    ketQuas: [],
  });
  const role = getRole();

  useEffect(() => {
    const fetchData = async () => {
      const lopHocPhans = await getLopHocPhans(null, null, null, sinhVienId);
      const allBaiKiemTras = [];
      const allCauHois = [];
      
      for (const lopHocPhan of lopHocPhans) {
        const baiKiemTras = await getBaiKiemTrasByLopHocPhanId(lopHocPhan.id);
        allBaiKiemTras.push(...baiKiemTras);
        
        for (const baiKiemTra of baiKiemTras) {
          const cauHois = await getCauHoisByBaiKiemTraId(baiKiemTra.id);
          allCauHois.push(...cauHois);
        }
      }

      const ketQuas = await getKetQuas(null, sinhVienId, null);
      setData({
        lopHocPhans,
        baiKiemTras: allBaiKiemTras,
        cauHois: allCauHois,
        ketQuas
      });
    };
    fetchData();
  }, [sinhVienId]);

  const [isDiemTam, setIsDiemTam] = useState(true);

  const organizeData = useCallback(() => {
    const organized = data.lopHocPhans.map(lhp => {
      const relatedBaiKiemTras = data.baiKiemTras.filter(bkt => bkt.lopHocPhanId === lhp.id);
      const bktDetails = relatedBaiKiemTras.map(bkt => {
        const relatedCauHois = data.cauHois.filter(ch => ch.baiKiemTraId === bkt.id);
        const cauHoiDetails = relatedCauHois.map(ch => {
          const ketQua = data.ketQuas.find(kq => kq.cauHoiId === ch.id);
          return { ...ch, ketQua };
        });
        return { ...bkt, cauHois: cauHoiDetails };
      });
      return { ...lhp, baiKiemTras: bktDetails };
    });
    return organized;
  }, [data]);

  const groupCauHoisByName = useCallback((baiKiemTra) => {
    const cauHoisInBaiKiemTra = data.cauHois.filter(ch => ch.baiKiemTraId === baiKiemTra.id);
    const groupedCauHois = {};
    
    cauHoisInBaiKiemTra.forEach(cauHoi => {
      if (!groupedCauHois[cauHoi.ten]) {
        groupedCauHois[cauHoi.ten] = [];
      }
      groupedCauHois[cauHoi.ten].push(cauHoi);
    });
    
    return Object.entries(groupedCauHois).map(([ten, cauHois]) => ({
      ten,
      cauHois
    }));
  }, [data.cauHois]);

  const getUniqueQuestionNames = useCallback(() => {
    return [...new Set(data.cauHois.map(ch => ch.ten))];
  }, [data.cauHois]);

  const getUniqueBaiKiemTraLoai = useCallback(() => {
    return [...new Set(data.baiKiemTras.map(bkt => bkt.loai))];
  }, [data.baiKiemTras]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Kết quả học tập</h1>
      <div className="flex items-center space-x-2">
        <Label htmlFor="diem-mode">Điểm tạm</Label>
        <Switch id="diem-mode"
          onCheckedChange={(check) => {setIsDiemTam(!check)}}
        />
        <Label htmlFor="diem-mode">Điểm chính thức</Label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 min-w-[200px]">
                Lớp học phần
              </th>
              {getUniqueBaiKiemTraLoai().map(loai => (
                <th 
                  key={loai}
                  className="border border-gray-300"
                >
                  {loai}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.lopHocPhans.map(lhp => (
              <tr key={lhp.id}>
                <td className="border border-gray-300">
                  {lhp.ten}
                </td>
                {getUniqueBaiKiemTraLoai().map(loai => {
                  const bkt = data.baiKiemTras.find(
                    b => b.loai === loai && b.lopHocPhanId === lhp.id
                  );
                  
                  const cauHois = bkt 
                    ? data.cauHois.filter(ch => ch.baiKiemTraId === bkt.id)
                    : [];

                  return (
                    <td 
                      key={`${lhp.id}-${loai}`} 
                      className="border border-gray-300 p-0"
                    >
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            {cauHois.map((cauHoi) => {
                              const ketQua = data.ketQuas.find(kq => kq.cauHoiId === cauHoi.id);
                              return (
                                <td 
                                  key={cauHoi.id} 
                                  className="border-l first:border-l-0 border-gray-200"
                                >
                                  <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <div className="font-medium text-sm text-center border-b border-gray-200 pb-1 w-full">
                                      {cauHoi.ten}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="text-blue-600 min-w-[2rem] text-center">
                                        {isDiemTam && (ketQua?.diemTam === 0 ? 0 : ketQua?.diemTam || "-")}
                                        {!isDiemTam && (ketQua?.diemChinhThuc === 0 ? 0 : ketQua?.diemChinhThuc || "-")}
                                        /{cauHoi.thangDiem}
                                      </span>
                                      <span className="text-gray-600">
                                        {cauHoi.trongSo}
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
    </Layout>
  );
}
