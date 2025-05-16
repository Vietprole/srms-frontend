import  { useEffect, useState } from "react";
import Layout from './Layout';
import { useParams } from "react-router-dom";
import { 
  getSinhViensByLopHocPhanId, 
  getSinhViensNotInLopHocPhanId,
  getLopHocPhanById,
  removeSinhVienFromLopHocPhan,
  addSinhViensToLopHocPhan
  
} from "@/api/api-lophocphan";
import  Typography  from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Button  from "@mui/material/Button";
import React, { useRef } from "react";
import { TableVirtuoso } from "react-virtuoso";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function StudentInCoursePage() {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState({});
  const [sinhViensInCourse, setSinhViensInCourse] = useState([]);
  const [sinhViensNotInCourse, setSinhViensNotInCourse] = useState([]);
  const virtuosoRef = useRef(null);
  const [selectedSinhViens, setselectedSinhViens] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Quản lý việc hiển thị Snackbar
  const [openAddDialog, setOpenAddDialog] = useState(false); // Quản lý việc hiển thị Dialog thêm sinh viên
  const [selectedAddSinhVien, setSelectedAddSinhVien] = useState([]);


  const handleOpenAddDialog =async () => {
    const res = await getSinhViensNotInLopHocPhanId(courseId);
    setSinhViensNotInCourse(res);
    setOpenAddDialog(true);
  };
const handleCloseDialogAdd = () => {
  setOpenAddDialog(false);
  setSelectedAddSinhVien([]); // Đặt lại danh sách sinh viên đã chọn
};
  
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Thông điệp hiển thị trong Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Mức độ nghiêm trọng của thông điệp (success, error, warning, info)
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  function handleSelectSinhVien(id) {
    setselectedSinhViens((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }
  function handleSelectAddSinhVien(id) {
    setSelectedAddSinhVien((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }



  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      textAlign: "center",
      padding: "4px 8px", // giảm chiều cao
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      textAlign: "center",
      padding: "4px 8px", // giảm chiều cao
    },
  }));
  const handleRemoveSelectedSinhViens = async () => {
    if (!selectedSinhViens.length) 
    {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Vui lòng chọn ít nhất một sinh viên để xóa.");
      setOpenSnackbar(true);
      return;
    }
  
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa các sinh viên đã chọn khỏi lớp học phần?");
    if (!confirm) return;
  
    try {
      const results = await Promise.allSettled(
        selectedSinhViens.map((sinhVienId) =>
          removeSinhVienFromLopHocPhan(courseId, sinhVienId)
        )
      );
  
      const failedIds = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          if (result.value.status !== 200) {
            failedIds.push(selectedSinhViens[index]);
          }
        } else {
          failedIds.push(selectedSinhViens[index]);
        }
      });
  
      if (failedIds.length > 0) {
        setSnackbarSeverity("error");
        setSnackbarMessage(`Không thể xóa ${failedIds.length} sinh viên.`);
      } else {
        setSnackbarSeverity("success");
        setSnackbarMessage("Xóa sinh viên thành công.");
      }
  
      setOpenSnackbar(true);
      await fetchSinhViensInCourse(); // refresh danh sách
      setselectedSinhViens([]);
    } catch (error) {
      console.error("Lỗi khi xóa sinh viên:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Đã xảy ra lỗi khi xóa sinh viên.");
      setOpenSnackbar(true);
    }
  };
  
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  }));
  
  const columns = [
    { dataKey: "select", label: "", align: "center", width: 50 },
    { dataKey: "stt", label: "STT", align: "center", width: 60 },
    { dataKey: "maSinhVien", label: "Mã sinh viên", align: "center", width: 150 },
    { dataKey: "ten", label: "Tên sinh viên", align: "left", width: 300 },
    { dataKey: "soTinChi", label: "Thuộc khoa", align: "center", width: 200 },
  ];
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
    TableRow: StyledTableRow,
    // eslint-disable-next-line react/display-name
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    TableCell: StyledTableCell,
  };
  function fixedHeaderContent() {
    const allIds = sinhViensInCourse.map((row) => row.id); 
    const isAllSelected = selectedSinhViens.length === allIds.length && allIds.length > 0;
    const isIndeterminate = selectedSinhViens.length > 0 && !isAllSelected;
  
    return (
      <StyledTableRow>
        {columns.map((column) => (
          <StyledTableCell
            key={column.dataKey}
            align={column.align}
            style={{
              width: column.width,
              padding: "4px 8px",
              backgroundColor: "#0071A6",
              color: "white",
            }}
          >
            {column.dataKey === "select" ? (
              <Checkbox
                sx={{ color: "#fff", padding: "0" }}
                indeterminate={isIndeterminate}
                checked={isAllSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    setselectedSinhViens(allIds); // ✅ chọn tất cả đúng list
                  } else {
                    setselectedSinhViens([]); // ✅ bỏ chọn
                  }
                }}
              />
            ) : (
              column.label
            )}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    );
  }
  
  
  function fixedHeaderContentAdd() {
    const allIds = sinhViensNotInCourse.map((row) => row.id);
    const isAllSelected = selectedAddSinhVien.length === allIds.length && allIds.length > 0;
    const isIndeterminate = selectedAddSinhVien.length > 0 && !isAllSelected;
  
    return (
      <StyledTableRow>
        {columns.map((column) => (
          <StyledTableCell
            key={column.dataKey}
            align={column.align}
            style={{
              width: column.width,
              padding: "4px 8px",
              backgroundColor: "#0071A6",
              color: "white",
            }}
          >
            {column.dataKey === "select" ? (
              <Checkbox
                sx={{ color: "#fff", padding: "0" }}
                indeterminate={isIndeterminate}
                checked={isAllSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAddSinhVien(allIds); // ✅ chọn tất cả
                  } else {
                    setSelectedAddSinhVien([]); // ✅ bỏ chọn
                  }
                }}
              />
            ) : (
              column.label
            )}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    );
  }
  
  
  function rowContent(index, row) {
    return (
      <>
        <StyledTableCell align="center">
          <Checkbox
            checked={selectedSinhViens.includes(row.id)}
            onChange={() => handleSelectSinhVien(row.id)}
          />
        </StyledTableCell>
        <StyledTableCell align="center">{index + 1}</StyledTableCell>
        <StyledTableCell align="center">{row.maSinhVien}</StyledTableCell>
        <StyledTableCell align="left">{row.ten}</StyledTableCell>
        <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
      </>
    );
  }
  function rowContentAdd(index, row) {
    return (
      <>
        <StyledTableCell align="center">
          <Checkbox
            checked={selectedAddSinhVien.includes(row.id)}
            onChange={() => handleSelectAddSinhVien(row.id)}
          />
        </StyledTableCell>
        <StyledTableCell align="center">{index + 1}</StyledTableCell>
        <StyledTableCell align="center">{row.maSinhVien}</StyledTableCell>
        <StyledTableCell align="left">{row.ten}</StyledTableCell>
        <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
      </>
    );
  }
  
  
  
  
  
  const fetchCourseInfo = async () => {
    try {
      const res = await getLopHocPhanById(courseId);
      setCourseInfo(res);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin lớp học phần:", err);
    }
  };

  const fetchSinhViensInCourse = async () => {
    try {
      const res = await getSinhViensByLopHocPhanId(courseId);
      console.log("Sinh viên trong lớp:", res);
      setSinhViensInCourse(res);
    } catch (err) {
      console.error("Lỗi khi lấy sinh viên trong lớp:", err);
    }
  };

  const fetchSinhViensNotInCourse = async () => {
    try {
      const res = await getSinhViensNotInLopHocPhanId(courseId);
      setSinhViensNotInCourse(res);
    } catch (err) {
      console.error("Lỗi khi lấy sinh viên chưa thuộc lớp:", err);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseInfo();
      fetchSinhViensInCourse();
    }
  }, [courseId]);

  const handleSubmitAddSinhVien = async () => {
    if (selectedAddSinhVien.length === 0) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Vui lòng chọn ít nhất một sinh viên để thêm.");
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const response = await addSinhViensToLopHocPhan(courseId, selectedAddSinhVien);
      if (response?.status === 201) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Thêm sinh viên vào lớp học phần thành công!");
        setOpenSnackbar(true);
        setOpenAddDialog(false);
        setSelectedAddSinhVien([]);
        await fetchSinhViensInCourse();
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Thêm sinh viên thất bại. Vui lòng thử lại.");
        setOpenSnackbar(true);
        setOpenAddDialog(false);
        setSelectedAddSinhVien([]);
        setSinhViensNotInCourse([]);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Đã xảy ra lỗi khi thêm sinh viên.");
      setOpenSnackbar(true);
      setOpenAddDialog(false);
      setSelectedAddSinhVien([]);
      setSinhViensNotInCourse([]);
    }
  };
  
  return (
    <Layout>
      <div style={styles.main}>
<Box 
  sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: 2 
  }}
>
  <Typography 
    sx={{ 
      fontFamily: 'Roboto', 
      fontWeight: 'bold', 
      fontSize: '16px'
    }}
  >
    Danh sách sinh viên thuộc lớp học phần:{" "}
    <Box component="span" sx={{ color: '#0A65CC' }}>
      {courseInfo.ten}
    </Box>
  </Typography>

  <Box sx={{ display: 'flex', gap: 1 }}>
    <Button 
      sx={{ height: "36px", minWidth: "120px" }} 
      variant="outlined" 
      color="error" 
      startIcon={<DeleteIcon />} 
      disabled={selectedSinhViens.length === 0}
      onClick={handleRemoveSelectedSinhViens} // Gọi hàm xóa sinh viên đã chọn
    >
      Xóa sinh viên
    </Button>
    <Button 
      sx={{ height: "36px", minWidth: "140px" }} 
      variant="contained" 
      endIcon={<AddIcon />}
      onClick={handleOpenAddDialog} // Mở dialog thêm sinh viên 
    >
      Thêm sinh viên
    </Button>
  </Box>
</Box>
<TableVirtuoso
  ref={virtuosoRef}
  data={sinhViensInCourse}
  components={VirtuosoTableComponents}
  fixedHeaderContent={fixedHeaderContent}
  itemContent={rowContent}
  firstItemIndex={0}
/>

</div>
<Dialog fullWidth maxWidth={"lg"} open={openAddDialog} onClose={handleCloseDialogAdd} 
                
                >
                  <DialogTitle>Thêm sinh viên vào lớp học phần</DialogTitle>
                  <DialogContent style={{ height: "400px", padding: 10 }}>
                  <TableVirtuoso
  ref={virtuosoRef}
  data={sinhViensNotInCourse}
  components={VirtuosoTableComponents}
  fixedHeaderContent={fixedHeaderContentAdd}
  itemContent={rowContentAdd}
  firstItemIndex={0}
/>

  </DialogContent>

                    <DialogActions>
                      <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
                      <Button variant="contained" color="primary" onClick={handleSubmitAddSinhVien}  disabled={selectedAddSinhVien.length === 0}>Thêm</Button>
                    </DialogActions>
                </Dialog>
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

    </Layout>
  );
}
const styles = {
  main:
  {
    width: '100%',
    height: '90vh',
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
    width: '10%',
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
  }
};
