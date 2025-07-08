import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getCLOsByClassId } from '@/api-new/api-clo';
import { getQuestionsByExamId, getCLOsByQuestionId, updateCLOsToCauHoi } from '@/api-new/api-cauhoi';
import { getBaiKiemTrasByLopHocPhanId } from '@/api-new/api-baikiemtra';
import MappingTable from '@/components/MappingTable';
import { getLopHocPhanById } from '@/api/api-lophocphan';

export default function NoiCauHoiCLO() {
  const [cauHois, setCauHois] = useState([]);
  const [cLOs, setCLOs] = useState([]);
  const [toggledData, setToggledData] = useState({});
  const { lopHocPhanId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [extraHeaders, setExtraHeaders] = useState({});

  const fetchData = useCallback(async () => {
    try {
      //   const lopHocPhan = await getLopHocPhanById(lopHocPhanId);
      // const hocPhanId = lopHocPhan.hocPhanId;
      const baiKiemTrasData = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
      const [cLOsData] = await Promise.all([
        getCLOsByClassId(lopHocPhanId),
      ]);
  
      const cauHoisPromises = baiKiemTrasData.map(baiKiemTra =>
        getQuestionsByExamId(baiKiemTra.id)
      );
  
      const cauHoisResults = await Promise.all(cauHoisPromises);
      console.log("cauHoisResults", cauHoisResults);
      // Create extraHeaders object
      const extraHeaders = cauHoisResults.reduce((acc, cauHoisGroup, index) => {
        const examId = cauHoisGroup[0]?.examId;
        if (examId) {
          const baiKiemTra = baiKiemTrasData.find(bkt => bkt.id === examId);
          acc[examId] = {
            colSpan: cauHoisGroup.length,
            header: baiKiemTra.type
          };
        }
        return acc;
      }, {});

      const cauHoisData = cauHoisResults.flat();

      setCLOs(cLOsData);
      setCauHois(cauHoisData);
      setExtraHeaders(extraHeaders);

      const toggledData = {};
      for (const cauHoi of cauHoisData) {
        const cauHoisData = await getCLOsByQuestionId(cauHoi.id);
        toggledData[cauHoi.id] = cauHoisData.map(clo => clo.id);
      }
      setToggledData(toggledData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // const extraHeaders = {
  //   1: {colSpan: 4, header: "GK"},
  //   2: {colSpan: 5, header: "CK"},
  //   3: {colSpan: 5, header: "QT"}
  // }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MappingTable
      listRowItem={cLOs}
      listColumnItem={cauHois}
      extraHeaders={extraHeaders}
      toggledDataFromParent={toggledData}
      updateRowItemsToColumnItem={updateCLOsToCauHoi}
      getRowItemsByColumnItemId={getCLOsByQuestionId}
    />
  );
}
