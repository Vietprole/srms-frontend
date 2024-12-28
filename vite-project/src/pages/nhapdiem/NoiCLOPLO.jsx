import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getPLOsByLopHocPhanId, getCLOsByPLOId, updateCLOsToPLO } from '@/api/api-plo';
import { getCLOsByLopHocPhanId } from '@/api/api-clo';
import MappingTable from '@/components/MappingTable';

export default function NoiCLOPLO() {
  const [cLOs, setCLOs] = useState([]);
  const [pLOs, setPLOs] = useState([]);
  // const [isEditable, setIsEditable] = useState(false);
  const [toggledData, setToggledData] = useState({});
  const { lopHocPhanId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [cLOsData, pLOsData] = await Promise.all([
        getCLOsByLopHocPhanId(lopHocPhanId),
        getPLOsByLopHocPhanId(lopHocPhanId),
      ]);
      setCLOs(cLOsData);
      setPLOs(pLOsData);

      const toggledData = {};
      for (const plo of pLOsData) {
        const cloData = await getCLOsByPLOId(plo.id);
        toggledData[plo.id] = cloData.map(clo => clo.id);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MappingTable
      listRowItem={cLOs}
      listColumnItem={pLOs}
      toggledDataFromParent={toggledData}
      updateRowItemsToColumnItem={updateCLOsToPLO}
      getRowItemsByColumnItemId={getCLOsByPLOId}
    />
  );
}
