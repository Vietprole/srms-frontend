import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getCLOsByPLOId, updateCLOsToPLO,getPLOsByNganhId } from '@/api/api-plo';
import { getCLOsByLopHocPhanId } from '@/api/api-clo';
// import { getLopHocPhanById } from "../../api/api-lophocphan";
import { styled } from "@mui/material/styles";
import { TableCell, tableCellClasses } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { Table } from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import * as React from 'react';
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {getAllNganhs} from "../../api/api-nganh"
import { getHocPhansByNganhId } from "@/api/api-nganh";
import VirtualizedAutocomplete from "@/components/VirtualizedAutocomplete";
import Checkbox from '@mui/material/Checkbox';
import Layout from '../Layout';
export default function NoiCLOPLO() {

  const styles = {
    main:
    {
      width: '100%',
      height: '92vh',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'hidden',
      padding: "10px",
    },
    title:
    {
      width: '100%',
      height: '6%',
      fontSize: '1.2em',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
    btnMore:
    {
      display: 'flex',
      justifyContent: 'flex-end',
      marginLeft: 'auto',
    },
    tbActions:
    {
      width: '100%',
      height: '6%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      padding: '0px 10px',
    },
    ipSearch:
    {
      width: '25%',
      height: '100%',
      justifyContent: 'flex-start',
      borderRadius: '5px',
    },
    btnCreate:
    {
      width: '15%',
      height: '100%',
      display: 'flex',
      marginLeft: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      color: 'white',
      cursor: 'pointer',
    },
    table:
    {
      width: '100%',
      height: '98%',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '10px',
      overflowY: 'auto',
    },
    cbKhoa:
    {
      width: '28%',
      height: '80%',
      marginLeft: '10px',
      marginBottom: '10px',
    },
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0071A6",
      color: theme.palette.common.white,
      borderRight: '1px solid #ddd', // Đường phân cách dọc

    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '5px 10px', // Thêm padding cho các hàng
      borderRight: '1px solid #ddd', // Đường phân cách dọc
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
    backgroundColor:"#D3F3FF", // Màu nền khi hover
    cursor: 'pointer', // Tùy chọn: Thêm hiệu ứng con trỏ
  },
  }));
  const [cLOs, setCLOs] = useState([]);
  const [pLOs, setPLOs] = useState([]);
  const [toggledData, setToggledData] = useState({});
  const { lopHocPhanId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  // const [lopHocPhanData,setLopHocPhanData]=useState([]);
  const [nganhs,setNganhs]=useState([]);
  const [selectedNganhFilter, setSelectedNganhFilter] = useState(null);
  const [hocPhans, setHocPhans] = useState([]);
  const [selectedHocPhan, setSelectedHocPhan] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isChanged, setIsChanged] = useState(false);
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleNganhChange = async (event, newValue) => {
    setSelectedNganhFilter(newValue);
    if (newValue) {
      const hocPhansData = await getHocPhansByNganhId(newValue.id);
      setHocPhans(hocPhansData);
    } else {
      setHocPhans([]);
    }

  };
  const handleHocPhanChange = async (event, newValue) => {
    setSelectedHocPhan(newValue);
    if (newValue && selectedNganhFilter) {
      const plos= await getPLOsByNganhId(selectedNganhFilter.id);
      const cloData = await getCLOsByLopHocPhanId(newValue.id);
      setPLOs(plos);
      setCLOs(cloData);
      const toggledData = {};
      for (const plo of plos) {
        const cloData = await getCLOsByPLOId(plo.id);
        toggledData[plo.id] = cloData.map(clo => clo.id);
      }
      setToggledData(toggledData);
    } else {
      setPLOs([]);
      setCLOs([]);
    }

  };
  const handleSave = async () => {
    try {
      for (const ploId in toggledData) {
        const cloIds = toggledData[ploId];
        const response = await updateCLOsToPLO(ploId, cloIds);
  
        if (response.status !== 200) {
          throw new Error("Lưu thất bại với PLO ID: " + ploId);
        }
      }
  
      setSnackbarMessage("Lưu CLO-PLO thành công!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setIsChanged(false);
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      setSnackbarMessage("Đã xảy ra lỗi khi lưu dữ liệu.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  

  const fetchData = useCallback(async () => {
    try {
      // const lopHocPhanData = await getLopHocPhanById(lopHocPhanId);
      const nganhs= await getAllNganhs();
      setNganhs(nganhs);
      // setLopHocPhanData(lopHocPhanData);
      // const [cLOsData, pLOsData] = await Promise.all([
      //   getCLOsByLopHocPhanId(lopHocPhanData.hocPhanId),
      //   getPLOsByLopHocPhanId(lopHocPhanId),
      // ]);
      // setCLOs(cLOsData);
      // setPLOs(pLOsData);
      

      // const toggledData = {};
      // for (const plo of pLOsData) {
      //   const cloData = await getCLOsByPLOId(plo.id);
      //   console.log("CLO Data: ", pLOsData);
      //   toggledData[plo.id] = cloData.map(clo => clo.id);
      // }
      // setToggledData(toggledData);
      // console.log("Toggled Data: ", toggledData);
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
  
  const staticColumns = [
    { label: "STT", dataKey: "index", width: 70 },
    { label: "Tên CLO", dataKey: "ten", width: 300 },
  ];
  
  const dynamicColumns = pLOs.map((plo) => ({
    label: plo.ten,
    dataKey: `plo${plo.id}`,
    width: 150,
  }));
  
  const columns = [...staticColumns, ...dynamicColumns];
  
  const fixedHeaderContent = () => (
    <StyledTableRow>
      {columns.map((col) => (
        <StyledTableCell
          key={col.dataKey}
          variant="head"
          align="center"
          style={{ width: col.width }}
        >
          {col.label}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  );
  

  const VirtuosoTableComponents = {
    // eslint-disable-next-line react/display-name
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} sx={{ height: "calc(100vh - 200px)" }} />
    )),
    
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed", backgroundColor: "white" }} />
    ),
    // eslint-disable-next-line react/display-name
    TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
    TableRow: StyledTableRow, // Sử dụng StyledTableRow bạn đã định nghĩa
    // eslint-disable-next-line react/display-name
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    TableCell: StyledTableCell, // Sử dụng StyledTableCell bạn đã định nghĩa
  };

  const rowContent = (index) => {
    const clo = cLOs[index];
  
    return (
      <>
        <StyledTableCell align="center">{index + 1}</StyledTableCell>
        <StyledTableCell align="center">{clo.ten}</StyledTableCell>
  
        {pLOs.map((plo) => (
          <StyledTableCell align="center" key={`checkbox-${clo.id}-${plo.id}`}>
            <Checkbox
              checked={toggledData[plo.id]?.includes(clo.id) || false}
              onChange={() => {
                setToggledData((prev) => {
                  const current = prev[plo.id] || [];
                  const isChecked = current.includes(clo.id);
                  const updated = {
                    ...prev,
                    [plo.id]: isChecked
                      ? current.filter((id) => id !== clo.id)
                      : [...current, clo.id],
                  };
                  setIsChanged(true); // <- Đánh dấu là đã có thay đổi
                  return updated;
                });
              }}
              
            />
          </StyledTableCell>
        ))}
      </>
    );
  };
  

  return (
    <Layout>

<div className="w-full">
    <div style={styles.main}>
<div style={styles.title}>
<span>Nối PLO-CLO</span>
<div style={styles.btnMore}>
</div>
</div>
<div style={styles.tbActions}>
<div style={styles.cbKhoa}>
    
<VirtualizedAutocomplete
              options={nganhs}
              value={selectedNganhFilter}
              onChange={handleNganhChange}
              getOptionLabel={(option) => ` ${option.ten}`}
              label="Chọn ngành"
              noOptionsText="Không tìm thấy ngành"  // Thông báo nếu không có kết quả
              variant="outlined"
            />

</div>
<div style={styles.cbKhoa}>
    
<VirtualizedAutocomplete
              options={hocPhans}
              value={selectedHocPhan}
              onChange={handleHocPhanChange}
              getOptionLabel={(option) => `${option.maHocPhan || ""} - ${option.ten || ""}`}
              label="Chọn học phần"
              noOptionsText="Không tìm thấy học phần"  // Thông báo nếu không có kết quả
              variant="outlined"
            />

</div>
<div style={styles.btnCreate}>
  <Button 
    sx={{ width: "100%" }} 
    variant="contained" 
    onClick={handleSave} 
    disabled={!isChanged}
  >
    Lưu
  </Button>
</div>

</div>
<div style={styles.table}>
<TableVirtuoso
  data={cLOs}
  components={VirtuosoTableComponents}
  fixedHeaderContent={fixedHeaderContent}
  itemContent={(index) => rowContent(index)}
/>


</div>
</div>
<Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
      >
        <MuiAlert variant='filled' onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
</div>
    </Layout>
    
  );
}
