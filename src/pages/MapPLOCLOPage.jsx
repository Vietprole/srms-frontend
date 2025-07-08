import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getFilteredCLOs } from "@/api-new/api-clo";
import { getFilteredPLOs } from "@/api-new/api-plo";
import {
  getAllProgrammes,
  getCoursesInProgramme,
  getFilteredProgrammes,
} from "@/api-new/api-programme";
import { getAllCourses } from "@/api-new/api-course";
import MappingTable from "@/components/MappingTable";
import { ComboBox } from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import Layout from "./Layout";
import { createSearchURL } from "@/utils/string";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getPIsByPLOId,
  getCLOsByPIId,
  updateCLOsToPI,
  getFilteredPIs,
} from "@/api-new/api-pi";
import { getFilteredCourses } from "@/api-new/api-course";
import { getProgrammeManagerId } from "@/utils/storage";
import { updateCLOsToPLO, getCLOsByPLOId } from "@/api-new/api-plo";

export default function MapPLOCLOPage() {
  const [cLOs, setCLOs] = useState([]);
  const [pis, setPIs] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programmeIdParam = searchParams.get("programmeId");
  const courseIdParam = searchParams.get("courseId");
  const [programmeItems, setProgrammeItems] = useState([]);
  const [courseItems, setCourseItems] = useState([]);
  const [programmeId, setProgrammeId] = useState(programmeIdParam);
  const [courseId, setCourseId] = useState(courseIdParam);
  const [comboBoxCourseId, setComboBoxCourseId] = useState(courseIdParam);
  const [comboBoxProgrammeId, setComboBoxProgrammeId] =
    useState(programmeIdParam);
  // const [isEditable, setIsEditable] = useState(false);
  const [toggledData, setToggledData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [extraHeaders, setExtraHeaders] = useState({});
  const baseUrl = "/mapploclo";
  const programmeManagerId = getProgrammeManagerId();

  const fetchProgrammeData = useCallback(async () => {
    try {
      const dataProgramme = await getFilteredProgrammes(
        null,
        programmeManagerId
      );
      const mappedComboBoxItems = dataProgramme.map((programme) => ({
        label: `${programme.code} - ${programme.name}`,
        value: programme.id,
      }));
      setProgrammeItems(mappedComboBoxItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [programmeManagerId]);

  const fetchCourseData = useCallback(async () => {
    try {
      if (!comboBoxProgrammeId) {
        setCourseItems([]);
        return;
      }
      const dataCourse = await getCoursesInProgramme(
        comboBoxProgrammeId,
        null,
        true
      );
      const mappedCourseItems = dataCourse.map((course) => ({
        label: `${course.code} - ${course.name}`,
        value: course.id,
      }));
      setCourseItems(mappedCourseItems);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  }, [comboBoxProgrammeId]);

  const fetchPLOCLOData = useCallback(async () => {
    try {
      if (!programmeId || !courseId) {
        setCLOs([]);
        setPIs([]);
        setToggledData({});
        setExtraHeaders({});
        return;
      }

      const [cLOsData, pLOsData] = await Promise.all([
        getFilteredCLOs(courseId),
        getFilteredPLOs(programmeId, courseId, null),
      ]);

      setCLOs(cLOsData);

      // Fetch PIs for the selected programme and course
      // const piData = await getFilteredPIs(null, programmeId, courseId);
      console.log("pLOsData", pLOsData);
      // const piDataPromises = pLOsData.map((plo) => getFilteredPIs(plo.id, null, courseId, null));
      // const pisResults = await Promise.all(piDataPromises);
      // console.log("pisResults", pisResults);

      // const extraHeaders = pisResults.reduce((acc, pisGroup) => {
      //   const ploId = pisGroup[0]?.ploId;
      //   if (ploId) {
      //     const plo = pLOsData.find((plo) => plo.id === ploId);
      //     acc[ploId] = {
      //       colSpan: pisGroup.length,
      //       header: plo.name,
      //     };
      //   }
      //   return acc;
      // }, {});
      const piData = pLOsData
      // const piData = pisResults.flat();
      setPIs(piData);
      // setExtraHeaders(extraHeaders);

      // Prepare the toggled data
      const toggledData = {};
      for (const pi of piData) {
        const cloData = await getCLOsByPLOId(pi.id);
        toggledData[pi.id] = cloData.map((clo) => clo.id);
      }
      setToggledData(toggledData);
    } catch (error) {
      console.error("Error fetching PLO - CLO data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, programmeId]);

  useEffect(() => {
    fetchProgrammeData();
    fetchCourseData();
    fetchPLOCLOData();
  }, [fetchCourseData, fetchProgrammeData, fetchPLOCLOData]);

  const handleGoClick = () => {
    setProgrammeId(comboBoxProgrammeId);
    setCourseId(comboBoxCourseId);
    const url = createSearchURL(baseUrl, {
      programmeId: comboBoxProgrammeId,
      courseId: comboBoxCourseId,
    });
    navigate(url);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex gap-2">
        <ComboBox
          items={programmeItems}
          setItemId={setComboBoxProgrammeId}
          initialItemId={programmeId}
          placeholder="Chọn CTĐT"
          width="500px"
        />
        <ComboBox
          items={courseItems}
          setItemId={setComboBoxCourseId}
          initialItemId={courseId}
          placeholder={
            comboBoxProgrammeId ? "Chọn Học phần" : "Vui lòng chọn CTĐT trước"
          }
        />
        <Button onClick={handleGoClick}>Go</Button>
      </div>
      <MappingTable
        listRowItem={cLOs}
        listColumnItem={pis}
        toggledDataFromParent={toggledData}
        updateRowItemsToColumnItem={updateCLOsToPLO}
        getRowItemsByColumnItemId={getCLOsByPLOId}
      />
    </Layout>
  );
}
