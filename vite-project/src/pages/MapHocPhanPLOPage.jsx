import Layout from "./Layout"
import { useEffect, useState, useCallback } from 'react';
import { getPLOsByNganhId, getHocPhansByPLOId, updateHocPhansToPLO } from '@/api/api-plo';
import { getHocPhans } from '@/api/api-hocphan';
import MappingTable from '@/components/MappingTable';
import { useSearchParams } from "react-router-dom";
import {ComboBox} from '@/components/ComboBox';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { getAllNganhs } from '@/api/api-nganh';

export default function MapHocPhanPLOPage() {
  const navigate = useNavigate();
  const [hocPhans, setHocPhans] = useState([]);
  const [pLOs, setPLOs] = useState([]);
  // const [isEditable, setIsEditable] = useState(false);
  const [toggledData, setToggledData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const nganhIdParam = searchParams.get("nganhId");
  const [nganhItems, setNganhItems] = useState([]);
  const [nganhId, setNganhId] = useState(nganhIdParam);
  const [comboBoxNganhId, setComboBoxNganhId] = useState(nganhIdParam);

  const fetchData = useCallback(async () => {
    try {
      const nganhData = await getAllNganhs();
      const mappedNganhItems = nganhData.map(nganh => ({ label: nganh.ten, value: nganh.id }));
      setNganhItems(mappedNganhItems);
      const laCotLoi = true;

      if (nganhId) {
        const [hocPhansData, pLOsData] = await Promise.all([
          getHocPhans(null, nganhId, laCotLoi),
          getPLOsByNganhId(nganhId),
        ]);
        setHocPhans(hocPhansData);
        setPLOs(pLOsData);
  
        const toggledData = {};
        for (const plo of pLOsData) {
          const hocPhanData = await getHocPhansByPLOId(plo.id);
          toggledData[plo.id] = hocPhanData.map(hocPhan => hocPhan.id);
        }
        setToggledData(toggledData);
      } else {
        setHocPhans([]);
        setPLOs([]);
        setToggledData({});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [nganhId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleGoClick = () => {
    setNganhId(comboBoxNganhId);
    if (comboBoxNganhId === null) {
      navigate(`/maphocphanplo`);
      return;
    }
    navigate(`/maphocphanplo?nganhId=${comboBoxNganhId}`);
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex">
          <ComboBox items={nganhItems} setItemId={setComboBoxNganhId} initialItemId={nganhId} placeholder="Chọn Ngành"/>
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        {toggledData && hocPhans?.length > 0 && pLOs?.length > 0 && (
          <MappingTable
            listRowItem={hocPhans}
            listColumnItem={pLOs}
            toggledDataFromParent={toggledData}
            updateRowItemsToColumnItem={updateHocPhansToPLO}
            getRowItemsByColumnItemId={getHocPhansByPLOId}
          />
        )}
      </div>
    </Layout>
  );
}

