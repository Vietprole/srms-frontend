import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getCLOsByLopHocPhanId } from '@/api/api-clo';
import { getCauHoisByBaiKiemTraId, getCLOsByCauHoiId, updateCLOsToCauHoi } from '@/api/api-cauhoi';
import { getBaiKiemTrasByLopHocPhanId } from '@/api/api-baikiemtra';
import MappingTable from '@/components/MappingTable';

export default function NoiCauHoiCLO() {
  const [cauHois, setCauHois] = useState([]);
  const [cLOs, setCLOs] = useState([]);
  const [toggledData, setToggledData] = useState({});
  const { lopHocPhanId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [extraHeaders, setExtraHeaders] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const baiKiemTrasData = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
      const [cLOsData] = await Promise.all([
        getCLOsByLopHocPhanId(lopHocPhanId),
      ]);
  
      const cauHoisPromises = baiKiemTrasData.map(baiKiemTra =>
        getCauHoisByBaiKiemTraId(baiKiemTra.id)
      );
  
      const cauHoisResults = await Promise.all(cauHoisPromises);
      console.log("cauHoisResults", cauHoisResults);
      // Create extraHeaders object
      const extraHeaders = cauHoisResults.reduce((acc, cauHoisGroup, index) => {
        const baiKiemTraId = cauHoisGroup[0]?.baiKiemTraId;
        if (baiKiemTraId) {
          const baiKiemTra = baiKiemTrasData.find(bkt => bkt.id === baiKiemTraId);
          acc[baiKiemTraId] = {
            colSpan: cauHoisGroup.length,
            header: baiKiemTra.loai
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
        const cauHoisData = await getCLOsByCauHoiId(cauHoi.id);
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
      getRowItemsByColumnItemId={getCLOsByCauHoiId}
    />
  );
}
