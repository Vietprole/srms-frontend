import  { useEffect, useState } from "react";
import Layout from './Layout';
import { useParams } from "react-router-dom";
import  Typography  from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Button  from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import {getClassById,getStudentsInClass,removeStudentsFromClass} from "@/api/api-classes";
import  TextField  from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DialogAddSinhVienClass from "../components/DialogAddSinhVienClass";
export default function StudentInCoursePage() {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0071A6",
      color: theme.palette.common.white,
      borderRight: "1px solid #ddd", // Đường phân cách dọc
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: "5px 10px", // Thêm padding cho các hàng
      borderRight: "1px solid #ddd", // Đường phân cách dọc
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: "#D3F3FF", // Màu nền khi hover
      cursor: "pointer", // Tùy chọn: Thêm hiệu ứng con trỏ
    },
  }));
  const { courseId } = useParams(); 
  const [courseInfo, setCourseInfo] = useState({});
  const [sinhViensInCourse, setSinhViensInCourse] = useState([]);
  const [selectedSinhViens, setselectedSinhViens] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const [openDialogAddSinhVien, setOpenDialogAddSinhVien] = useState(false); // Dialog để thêm sinh viên
  
  const handleOpenDialogAddSinhVien = () => {
    setOpenDialogAddSinhVien(true);
  };
  const handleCloseDialogAddSinhVien = () => {
    setOpenDialogAddSinhVien(false);
  };


  
  const [pageSize, setPageSize] = useState(20); // tùy chọn mặc định
  const pageSizeOptions = [20,50,100]; // tuỳ bạn thêm số lựa chọn

  const totalItems = sinhViensInCourse.length;
  const startRow = (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalItems);
  const totalPages = Math.ceil(totalItems / pageSize);
  let pagesToShow = [];
  
  if (totalPages <= 4) {
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (page <= 3) {
      pagesToShow = [1, 2, 3, 'more', totalPages];
    } else if (page >= totalPages - 2) {
      pagesToShow = [1, 'more', totalPages - 2, totalPages - 1, totalPages];
    } else {
      pagesToShow = [1, 'more', page - 1, page, page + 1, 'more', totalPages];
    }
  }

  // Lấy dữ liệu cho trang hiện tại
  const paginatedData = sinhViensInCourse.slice((page - 1) * pageSize, page * pageSize);

  
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
  
  const handleRemoveSelectedSinhViens = async () => {
    if (!selectedSinhViens.length) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Vui lòng chọn ít nhất một sinh viên để xóa.");
      setOpenSnackbar(true);
      return;
    }
  
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa các sinh viên đã chọn khỏi lớp học phần?");
    if (!confirm) return;
  
    try {
      await removeStudentsFromClass(courseId, selectedSinhViens); // Gửi 1 mảng
      setSnackbarSeverity("success");
      setSnackbarMessage("Xóa sinh viên thành công.");
      setselectedSinhViens([]);
      await fetchSinhViensInCourse(); // refresh danh sách
    } catch (error) {
      console.error("Lỗi khi xóa sinh viên:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Đã xảy ra lỗi khi xóa sinh viên.");
    }
  
    setOpenSnackbar(true);
  };
  
  const fetchCourseInfo = async () => {
    try {
      const res = await getClassById(courseId);
      setCourseInfo(res);
      console.log("Thông tin lớp học phần:", res);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin lớp học phần:", err);
    }
  };

  const fetchSinhViensInCourse = async () => {
    try {
      const res = await getStudentsInClass(courseId);
  
      // 👉 Sort theo tên tăng dần (bạn có thể đổi thành code hoặc bất kỳ field nào)
      const sortedList = res.sort((a, b) => a.name.localeCompare(b.name));
  
      console.log("Sinh viên trong lớp (đã sắp xếp):", sortedList);
      setSinhViensInCourse(sortedList);
    } catch (err) {
      console.error("Lỗi khi lấy sinh viên trong lớp:", err);
    }
  };
  
  useEffect(() => {
    if (courseId) {
      fetchCourseInfo();
      fetchSinhViensInCourse();
    }
  }, [courseId]);
// Trong component cha
const handleSaveSuccess = (message) => {
  setSnackbarMessage(message);
  setSnackbarSeverity("success");
  setOpenSnackbar(true);
  fetchSinhViensInCourse(); // Refresh danh sách
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
  {courseInfo?.data?.name || '---'}
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
      onClick={handleOpenDialogAddSinhVien} // Mở dialog thêm sinh viên
    >
      Thêm sinh viên
    </Button>
  </Box>
</Box>
<div style={styles.table}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#0071A6",
                }}
              >
                <TableRow>
                  <StyledTableCell align="center">STT</StyledTableCell>
                  <StyledTableCell align="center">Mã sinh viên</StyledTableCell>
                  <StyledTableCell align="center">Tên sinh viên</StyledTableCell>
                  <StyledTableCell align="center">Thuộc CTĐT</StyledTableCell>
                  <StyledTableCell align="center">Xóa</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflowY: "auto" }}>
                {paginatedData.map((row, index) => {
                  const isSelected = selectedSinhViens.includes(row.id);
                  return (
                    <StyledTableRow key={row.id} selected={isSelected}>
                      <StyledTableCell align="center">
                        {(page - 1) * pageSize + index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.code}</StyledTableCell>
                      <StyledTableCell align="center">{row.name}</StyledTableCell>
                      <StyledTableCell align="center">{row.programmeName}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Checkbox
                        size="small"
                          checked={isSelected}
                          onChange={() => handleSelectSinhVien(row.id)}
                          color="primary"
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>


            </Table>
          </TableContainer>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MuiAlert
              variant="filled"
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
        </div>
        <DialogAddSinhVienClass
          open={openDialogAddSinhVien}
          onClose={handleCloseDialogAddSinhVien}
          nganhId={courseId}
          onSuccess={handleSaveSuccess} // ✅ Truyền xuống
        />

        <div style={styles.divPagination}>
  {/* Trái: các nút số trang */}
  <Box display="flex" alignItems="center">
  <Box
    sx={{
      ...styles.squareStyle,
      borderLeft: '1px solid #ccc',
      borderTopLeftRadius: '6px',
      borderBottomLeftRadius: '6px',
      opacity: page === 1 ? 0.5 : 1,
      pointerEvents: page === 1 ? 'none' : 'auto',
    }}
    onClick={() => setPage(page - 1)}
  >
    <ArrowLeftIcon fontSize="small" />
  </Box>

  {pagesToShow.map((item, idx) =>
  item === 'more' ? (
    <Box key={`more-${idx}`} sx={{ ...styles.squareStyle, pointerEvents: 'none' }}>
      <MoreHorizIcon fontSize="small" />
    </Box>
  ) : (
    <Box
      key={item}
      sx={{
        ...styles.squareStyle,
        ...(page === item
          ? { backgroundColor: '#0071A6', color: '#fff', fontWeight: 'bold' }
          : {}),
      }}
      onClick={() => setPage(item)}
    >
      {item}
    </Box>
  )
)}

  <Box
    sx={{
      ...styles.squareStyle,
      borderTopRightRadius: '6px',
      borderBottomRightRadius: '6px',
      opacity: page >= totalPages ? 0.5 : 1,
      pointerEvents: page >= totalPages ? 'none' : 'auto',
    }}
    onClick={() => setPage(page + 1)}
  >
    <ArrowRightIcon fontSize="small" />
  </Box>
</Box>


  {/* Phải: chọn số bản ghi + hiển thị dòng */}
  <Box display="flex" alignItems="center" gap={2}>
    <Box display="flex" alignItems="center" gap={1}>
      <span style={{ fontSize: 14 }}>Số bản ghi/trang:</span>
      <Autocomplete
  disableClearable
  options={pageSizeOptions}
  size="small"
  sx={{ width: 80, backgroundColor: "#fff", borderRadius: "4px" }}
  value={pageSize}
  getOptionLabel={(option) => option.toString()} // ✅ Convert số sang chuỗi
  onChange={(event, newValue) => {
    setPageSize(newValue);
    setPage(1); // reset về trang 1
  }}
  renderInput={(params) => (
    <TextField {...params} variant="outlined" size="small" />
  )}
/>

    </Box>
    <span style={{ fontSize: 14, color: '#333' }}>
      Dòng {startRow} đến {endRow} / {totalItems}
    </span>
  </Box>
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

    </Layout>
  );
}
const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },

  title: {
    width: '100%',
    fontSize: '1.2em',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  btnMore: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },

  tbActions: {
    width: '100%',
    marginTop: 10,
    display: 'flex',
    alignItems: 'center', // căn giữa dọc cho cả dòng
    gap: '10px',          // khoảng cách giữa các phần tử
    paddingBottom: '10px',
  },
  

  ipSearch: {
    width: '30%',
    height: 40,
    justifyContent: 'flex-start',
    borderRadius: '5px',
  },

  cbKhoa: {
    width: "22%",
    display: "flex",
    alignItems: "center",
    height: 40, // 👈 Thêm chiều cao cụ thể
    marginLeft: "10px",
  },
  
  

  btnCreate: {
    width: '10%',
    height: 40,
    display: 'flex',
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
  },

  table: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    width: '100%', // 👈 thêm dòng này
  },
  

  divPagination: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #eee',
    backgroundColor: '#f5f5f5',
    padding: '5px 10px',
  },

  squareStyle: {
    width: 40,
    height: 35,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderLeft: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#0071A6',
      color: '#fff',
    },
  },
};
