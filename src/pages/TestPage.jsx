import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Layout from './Layout';
import { getAllLopHocPhans } from '@/api/api-lophocphan';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
function TestPage() 
{
  const styles = {
    main:
    {
      width: '100%',
      height: '91vh',
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
      width: '22%',
      height: '80%',
      marginBottom: '10px',
    },
  };
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc



  

  

  useEffect(() => {
    fetchData();
    
  }, []); 
  
  
  const fetchData = async () => {
    const lophocphans = await getAllLopHocPhans();
    setData(lophocphans);
    setFilteredData(lophocphans);
  };
  
  

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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
    cursor: 'pointer',
  },
  }));



  return (
    <Layout>
      <div style={styles.main}>
      <div style={styles.title}>
        <span>Danh sách lớp học phần</span>
        <div style={styles.btnMore}>
          <IconButton aria-label="more actions"><MoreVertIcon/></IconButton>
        </div>
      </div>
      <div style={styles.tbActions}>
      <div style={styles.ipSearch}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "2px solid #ccc", // Viền ngoài
              borderRadius: "20px", // Bo tròn góc
              padding: "4px 8px", // Khoảng cách nội dung
              width: "100%", // Chiều rộng toàn khung tìm kiếm
              maxWidth: "100%", // Đảm bảo full width
              "&:focus-within": {
                border: "2px solid #337AB7", // Đổi màu viền khi focus
              },
              height: "100%",
            }}
          >
            <TextField
              fullWidth
              fontSize="10px"
              placeholder="Tìm kiếm theo tên lớp học phần..."
              variant="standard"
              autoComplete='off'
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <React.Fragment>
                    <IconButton aria-label="more actions">
                      <SearchIcon sx={{ color: "#888" }} />
                    </IconButton>
                  </React.Fragment>
                ),
              }}
              // value={searchQuery} // Liên kết giá trị tìm kiếm với state
              // onChange={handleSearchChange} // Gọi hàm xử lý khi thay đổi
            />
          </Box>
        </div>
        <div style={styles.cbKhoa}>
          {/* <Autocomplete
            sx={{ width: "100%" }}
            options={schoolYears}
            getOptionLabel={(option) => option.label}
            required
            value={selectedNamHocFilter}
            onChange={handleNamHocChange}
            renderInput={(params) => (
              <TextField {...params} label="Chọn năm học" size="small" />
            )}
          /> */}
        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained">Tạo lớp học phần</Button>

        </div>
      </div>
      <div style={styles.table}>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: "#0071A6" }}>
            <TableRow>
              <StyledTableCell align="center">STT</StyledTableCell>
              <StyledTableCell align="center">Mã lớp học phần</StyledTableCell>
              <StyledTableCell align="center">Tên lớp học phần</StyledTableCell>
              <StyledTableCell align="center">Giảng viên dạy</StyledTableCell>
              <StyledTableCell align="center">Học kỳ</StyledTableCell>
              <StyledTableCell align="center">Năm học</StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ overflowY: "auto" }}>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <StyledTableRow key={row.maHocKy || index}>
                  <StyledTableCell align="center" width={50}>{index + 1}</StyledTableCell>
                  <StyledTableCell align="center" width={200}>{row.maLopHocPhan}</StyledTableCell>
                  <StyledTableCell align="center">{row.ten}</StyledTableCell>
                  <StyledTableCell align="center" width={250}>{row.tenGiangVien}</StyledTableCell>
                  <StyledTableCell align="center" width={150}>{row.tenHocKy}</StyledTableCell>
                  <StyledTableCell align="center" width={150}>{row.namHoc}</StyledTableCell>
                  <StyledTableCell align="center" width={150}>
                  <Tooltip title="Sửa thông tin lớp học phần">
                    <IconButton
        
                    ><EditIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Danh sách sinh viên">
                    <IconButton
        
                    ><FormatListBulletedIcon/></IconButton>
                  </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell align="center" colSpan={4}>
                  Không có dữ liệu
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
    </div>
    </Layout>
  );
};

export default TestPage;
