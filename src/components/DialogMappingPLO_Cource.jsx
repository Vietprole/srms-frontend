import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { getNganhById } from "@/api/api-nganh";
import Typography  from "@mui/material/Typography";
import DialogContentText from '@mui/material/DialogContentText';
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Checkbox from "@mui/material/Checkbox";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import { getHocPhansByNganhId } from "@/api/api-nganh";
import { getPLOsByNganhId, getHocPhansByPLOId, updateHocPhansToPLO } from '@/api/api-plo';
import React from "react";
import { useRef } from "react";
import { useCallback, useMemo } from "react";

import { TableVirtuoso } from "react-virtuoso";
function DialogPLOHocPhan({ nganhId, open, onClose }) {
  const styles = {
    main: {
      display: "flex",
      width: '100%',
      height: '450px',
      overflowY: 'hidden',
      flexDirection: 'column',
    },
    mainAction: {
      display: "flex",
      width: '100%',
      height: '40px',
    },
    mainContent: {
      display: "flex",
      flexDirection: "column",
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      paddingTop: '10px',
    },
    tfSearch: {
      display: "flex",
      alignItems: "center",
      width: "25%",
      height: "100%",
    },
    btnAdd: {
      width: "18%",
      height: "100%",
      marginRight: "10px",
      
    },
    btnDelete: {
      width: "18%",
      height: "100%",
      marginLeft: "auto",
      padding: "0 10px",
    },
    btnSave: {
      width: "10%",
      height: "100%",
      
    },
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0071A6",
      color: theme.palette.common.white,
      borderRight: '1px solid #ddd', // Đường phân cách dọc
      padding: '4px 8px', // Reduced padding here
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '4px 8px', // Reduced padding for body cells
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
    height: '40px', // Reduce row height here
  }));
  const [nganh, setNganh] = useState(null);
  const [hocPhanDaChon, setHocPhanDaChon] = useState([]);
  const [lsPLO, setLsPLO] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tongSoTinChi, setTongSoTinChi] = useState(0);
  const [hocPhanTheoPLO, setHocPhanTheoPLO] = useState({}); // Biến tạm lưu trạng thái checkbox
  const [originalHocPhanTheoPLO, setOriginalHocPhanTheoPLO] = useState({});
  const virtuosoRef = useRef(null);
const [scrollIndex, setScrollIndex] = useState(0);

  
  useEffect(() => {
    if (open && nganhId) {
      fetchData();
    }
  }, [nganhId, open]);

  const fetchData = async () => {
    try {
      const nganhs = await getNganhById(nganhId);
      const hocphans = await getHocPhansByNganhId(nganhId);
      const totalCredits = hocphans.reduce((total, hp) => total + hp.soTinChi, 0);
      const plos = await getPLOsByNganhId(nganhId);
      const ploHocPhanMap = {}; 
      for (const plo of plos) {
        try {
          const hpTheoPLO = await getHocPhansByPLOId(plo.id);
          ploHocPhanMap[plo.id] = hpTheoPLO.map((hp) => hp.id);
        } catch (error) {
          console.error(`Lỗi khi lấy học phần của PLO ${plo.id}:`, error);
          ploHocPhanMap[plo.id] = []; // Đảm bảo có key
        }
      }
  
      // Tạo bảng tổng hợp học phần với các PLO bool tương ứng
      const mergedList = hocphans.map((hp) => {
        const ploFlags = {};
        for (const plo of plos) {
          ploFlags[`plo${plo.id}`] = ploHocPhanMap[plo.id]?.includes(hp.id) || false;
        }
  
        return {
          id: hp.id,
          maHocPhan: hp.maHocPhan,
          ten: hp.ten,
          ...ploFlags,
        };
      });
  
      // Set state
      setNganh(nganhs);
      setLsPLO(plos);
      setHocPhanDaChon(mergedList);
      setTongSoTinChi(totalCredits);
  
      // Ngoài ra, nếu cần lưu trạng thái checkbox ban đầu để check thay đổi
      const originalMap = {};
      for (const plo of plos) {
        originalMap[plo.id] = ploHocPhanMap[plo.id];
      }
  
      setHocPhanTheoPLO(originalMap);
      setOriginalHocPhanTheoPLO(originalMap);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };
  
  
  
  const handleClose = () => {
    onClose();
  };
  

  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  
  const fixedHeaderContent = () => {
    return (
      <StyledTableRow>
        {columns.map((column) => (
          <StyledTableCell
            key={column.dataKey}
            variant="head"
            align="center"
            style={{ width: column.width, textAlign: "center" }}
          >
            {column.label}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    );
  };
  const rowContent = useCallback((index, row) => {
    console.log(`Rendering row ${index}:`, row);
  
    return (
      <>
        <StyledTableCell align="center">{index + 1}</StyledTableCell>
        <StyledTableCell align="center">{row.maHocPhan}</StyledTableCell>
        <StyledTableCell align="left">{row.ten}</StyledTableCell>
        {lsPLO.map((plo) => (
          <StyledTableCell align="center" key={`checkbox-${row.id}-${plo.id}`}>
            <Checkbox
              checked={hocPhanTheoPLO?.[plo.id]?.includes(row.id) || false}
              onChange={(e) => {
                e.stopPropagation();
                handleTogglePLOCheckbox(row.id, plo.id);
              }}
            />
          </StyledTableCell>
        ))}
      </>
    );
  }, [hocPhanTheoPLO, lsPLO]);
  
  

  const handleTogglePLOCheckbox = (hocPhanId, ploId) => {
    setHocPhanTheoPLO((prev) => {
      const currentList = prev[ploId] || [];
      const exists = currentList.includes(hocPhanId);
      const updated = exists
        ? currentList.filter((id) => id !== hocPhanId)
        : [...currentList, hocPhanId];
      return {
        ...prev,
        [ploId]: updated,
      };
    });
  };
  
  
const handleSavePLOs = async () => {
  let hasChanges = false;
  for (const ploId in hocPhanTheoPLO) {
    const current = hocPhanTheoPLO[ploId] || [];
    const original = originalHocPhanTheoPLO?.[ploId] || [];

    const currentSorted = [...current].sort();
    const originalSorted = [...original].sort();

    if (JSON.stringify(currentSorted) !== JSON.stringify(originalSorted)) {
      hasChanges = true;
      break;
    }
  }

  if (!hasChanges) {
    setSnackbarSeverity("info");
    setSnackbarMessage("Không có thay đổi nào để lưu.");
    setOpenSnackbar(true);
    return;
  }

  try {
    for (const ploId in hocPhanTheoPLO) {
      const hocPhanIds = hocPhanTheoPLO[ploId];
      const rp = await updateHocPhansToPLO(ploId, hocPhanIds); // Gọi API cập nhật
      if (rp.status !== 200) {
        throw new Error(`Lỗi khi cập nhật PLO`);
      }
    }

    setSnackbarSeverity("success");
    setSnackbarMessage("Cập nhật PLO - học phần thành công!");

    // Sau khi lưu xong, cập nhật lại dữ liệu gốc
    setOriginalHocPhanTheoPLO({ ...hocPhanTheoPLO });
  } catch (err) {
    console.error("Lỗi khi lưu:", err);
    setSnackbarSeverity("error");
    setSnackbarMessage("Cập nhật thất bại!");
  } finally {
    setOpenSnackbar(true);
  }
};
  

  const isDifferent = (a = {}, b = {}) => {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (let key of allKeys) {
      const listA = a[key] || [];
      const listB = b[key] || [];
      if (listA.length !== listB.length || !listA.every(id => listB.includes(id))) {
        return true;
      }
    }
    return false;
  };
  const staticColumns = [
    { width: 50, label: "STT", dataKey: "index", align: "center" },
    { width: 200, label: "Mã Học Phần", dataKey: "maHocPhan", align: "center" },
    { width:450,label: "Tên Học Phần", dataKey: "ten", align: "center" }
  ];
  
  // Tạo các cột động từ lsPLO
  const dynamicColumns = lsPLO.map((plo) => ({
    width: 150, // hoặc tùy chỉnh
    label: plo.ten,
    dataKey: `plo${plo.id}`, // ví dụ: plo1, plo3,...
    align: "center"
  }));
  const columns = [...staticColumns, ...dynamicColumns];
  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer
        component={Paper}
        {...props}
        ref={ref}
        sx={{
          height: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          backgroundColor: 'white',
        }}
      />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{
          borderCollapse: 'separate',
          tableLayout: 'fixed',
        }}
      />
    ),
    TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
    TableRow: StyledTableRow,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    TableCell: StyledTableCell,
  };
  
  
  
  const hasChanges = isDifferent(hocPhanTheoPLO, originalHocPhanTheoPLO);
  
  return (
    <Dialog
      maxWidth="xl"
      fullWidth
      open={open}
      onClose={handleClose}
      TransitionProps={{
        onExited: () => setNganh(null), // Đặt lại giá trị khi Dialog đóng hoàn toàn
      }}
    >
      <DialogTitle fontSize={"18px"} fontWeight={"bold"}>
        Nối PLO - Học phần thuộc ngành:
        <Typography component="span" color="info.main" fontWeight="bold">
          {nganh ? ` ${nganh.ten}` : " Đang tải..."}
        </Typography>
  
        <Box sx={{ display: "flex", gap: 10, alignItems: "center", mt: 0.5 }}>
          <DialogContentText component="span">
            Mã ngành:
            <Typography component="span" color="info.main" fontWeight="500"> {nganh ? nganh.maNganh : "Đang tải..."} </Typography>
          </DialogContentText>
          <DialogContentText component="span">
            Tổng số tín chỉ: 
            <Typography component="span" color="info.main" fontWeight="500"> {tongSoTinChi ? tongSoTinChi : "0"} </Typography>
          </DialogContentText>
          <DialogContentText component="span">
            Khoa:<Typography component="span" color="info.main" fontWeight="500"> {nganh ? nganh.tenKhoa : "Đang tải..."}</Typography>
          </DialogContentText>
        </Box>
      </DialogTitle>
      <DialogContent>
        {nganh ? (
          <div style={styles.main}>
            <div style={styles.mainAction}>
              <div style={styles.btnDelete}></div>
              <div style={styles.btnAdd}></div>
              <div style={styles.btnSave}>
                <Button 
                  sx={{ width: "100%" }} 
                  variant="contained" 
                  startIcon={<SaveIcon />} 
                  disabled={!hasChanges} 
                  onClick={handleSavePLOs}
                >
                  Lưu
                </Button>
              </div>
            </div>
            <div style={styles.mainContent}>
            <TableVirtuoso
  ref={virtuosoRef}
  style={{ height: '100%' }}
  data={hocPhanDaChon}
  components={VirtuosoTableComponents}
  itemContent={(index) => {
    const row = hocPhanDaChon[index];
    return rowContent(index, row);
  }}
  fixedHeaderContent={fixedHeaderContent}
  firstItemIndex={0}
  initialTopMostItemIndex={scrollIndex}
  rangeChanged={(range) => setScrollIndex(range.startIndex)}
/>



              
            </div>              
          </div>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Đóng</Button>
      </DialogActions>
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
    </Dialog>
  );
}

export default DialogPLOHocPhan;
