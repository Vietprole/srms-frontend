import * as React from 'react';
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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Layout from "./Layout";
import { useState, useEffect } from "react";
import {
  getAllKhoas,
  addKhoa,
} from "@/api/api-khoa";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
function TestPage() 
{
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [tenKhoa, setTenKhoa] = useState(""); // Lưu giá trị Tên khoa
  const [maKhoa, setMaKhoa] = useState(""); // Lưu giá trị Mã khoa
  const [errorTenKhoa, setErrorTenKhoa] = useState(false); // Lưu trạng thái lỗi của Tên khoa
  const [errorMaKhoa, setErrorMaKhoa] = useState(false); // Lưu trạng thái lỗi của Mã khoa
  const isAlphabetWithSpaces = (text) => /^[a-zA-Z\s\u00C0-\u1EF9]+$/.test(text); // Kiểm tra tên khoa chỉ có chữ và khoảng trắng
  const isNumericCode = (text) => /^\d{3}$/.test(text); // Kiểm tra mã khoa là 3 ký tự số
  const [openSnackbar, setOpenSnackbar] = useState(false); // Quản lý việc hiển thị Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");  // Dùng để điều chỉnh mức độ của Snackbar
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const handleClickOpen = () => {
    console.log("Dialog is opening...");
    setOpen(true);
  };

  const handleClose = () => {
    setDisabled(false);
    setOpen(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const khoas = await getAllKhoas();
    setData(khoas);
  };
  
  useEffect(() => {
    // Only set filteredData once data has been loaded
    setFilteredData(data);
  }, [data]);
  
  const filterData = (query) => {
    if (!query.trim()) {
      setFilteredData(data); // If search query is empty, show all data
    } else {
      const filtered = data.filter((row) =>
        row.ten.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };
  
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value); 
    filterData(value); 
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
  const handleInputChange = (field, value) => {
    let isValid = true;

    // Kiểm tra tên khoa
    if (field === "tenKhoa") {
      setTenKhoa(value);
      if (!value.trim()) { // Kiểm tra nếu tên khoa trống
        setErrorTenKhoa(true);
        isValid = false;
      } else if (!isAlphabetWithSpaces(value)) { // Kiểm tra tên khoa không hợp lệ
        setErrorTenKhoa(true);
        isValid = false;
      } else {
        setErrorTenKhoa(false);
      }
    }

    // Kiểm tra mã khoa
    if (field === "maKhoa") {
      setMaKhoa(value);
      if (!value.trim()) {  // Kiểm tra nếu mã khoa trống
        setErrorMaKhoa(true);
        isValid = false;
      } else if (!isNumericCode(value)) {  // Kiểm tra mã khoa chỉ có 3 ký tự số
        setErrorMaKhoa(true);
        isValid = false;
      } else {
        setErrorMaKhoa(false);
      }
    }

    // Cập nhật trạng thái của nút "Lưu"
    // Nếu có lỗi ở bất kỳ trường nào hoặc nếu một trong hai trường trống, nút "Lưu" sẽ bị vô hiệu hóa
    setDisabled(!(isValid && tenKhoa.trim() && maKhoa.trim() && !errorTenKhoa && !errorMaKhoa));
  };
  const handleBlur = (field, value) => {
    let isValid = true;

    // Kiểm tra tên khoa
    if (field === "tenKhoa") {
      setTenKhoa(value);
      if (!value.trim()) { // Kiểm tra nếu tên khoa trống
        setErrorTenKhoa(true);
        isValid = false;
      } else if (!isAlphabetWithSpaces(value)) { // Kiểm tra tên khoa không hợp lệ
        setErrorTenKhoa(true);
        isValid = false;
      } else {
        setErrorTenKhoa(false);
      }
    }

    // Kiểm tra mã khoa
    if (field === "maKhoa") {
      setMaKhoa(value);
      if (!value.trim()) {  // Kiểm tra nếu mã khoa trống
        setErrorMaKhoa(true);
        isValid = false;
      } else if (!isNumericCode(value)) {  // Kiểm tra mã khoa chỉ có 3 ký tự số
        setErrorMaKhoa(true);
        isValid = false;
      } else {
        setErrorMaKhoa(false);
      }
    }

    // Cập nhật trạng thái của nút "Lưu"
    // Nếu có lỗi ở bất kỳ trường nào hoặc nếu một trong hai trường trống, nút "Lưu" sẽ bị vô hiệu hóa
    setDisabled(!(isValid && tenKhoa.trim() && maKhoa.trim() && !errorTenKhoa && !errorMaKhoa));
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  
  const handleSubmit = async () => {
    const khoaData = {
      ten: tenKhoa,
      maKhoa: maKhoa
    };
  
    try {
      const response = await addKhoa(khoaData);  // Gọi hàm addKhoa
      if (response.status === 201) {  
        setSnackbarMessage("Khoa đã được thêm thành công!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        fetchData();
        handleClose();
      } else {
        setSnackbarMessage("Lỗi: Không thể thêm khoa");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      setSnackbarMessage("Lỗi: Không thể thêm khoa");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuopen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Layout>
      <div style={styles.main}>
      <div style={styles.title}>
        <span>Danh sách khoa</span>
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
              height: "100%"
            }}
          >
            <TextField
              fullWidth
              fontSize="10px"
              placeholder="Tìm kiếm theo tên khoa..."
              variant="standard"
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
              value={searchQuery} // Liên kết giá trị tìm kiếm với state
              onChange={handleSearchChange} // Gọi hàm xử lý khi thay đổi
            />
          </Box>
        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained" onClick={handleClickOpen}>Tạo khoa</Button>
          <Dialog id='addKhoa' open={open} onClose={handleClose} fullWidth>
                      <DialogTitle>Tạo khoa mới:</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Thêm khoa mới vào hệ thống
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenKhoa'
                          margin="dense"
                          label="Tên khoa"
                          fullWidth
                          variant="standard"
                          onInput={(e) => handleInputChange("tenKhoa", e.target.value)} // Sử dụng onInput để kiểm tra tính hợp lệ ngay khi nhập liệu
                          onBlur={(e) => handleBlur("tenKhoa", e.target.value)} // Sử dụng onBlur để kiểm tra tính hợp lệ
                          helperText="Tên khoa không được để trống và không được chứa các kí tự đặc biệt"
                          error={errorTenKhoa}
                        />
                        <TextField
                          autoFocus
                          id='maKhoa'
                          required
                          margin="dense"
                  
                          label="Mã khoa"
                          fullWidth
                          variant="standard"
                          onInput={(e) => handleInputChange("maKhoa", e.target.value)} // Sử dụng onInput để kiểm tra tính hợp lệ ngay khi nhập liệu
                          onBlur={(e) => handleBlur("maKhoa", e.target.value)} // Sử dụng onBlur để kiểm tra tính hợp lệ
                          helperText="Mã khoa chỉ gồm 3 kí tự số và không được chứa các kí tự chữ và các kí tự đặc biệt"
                          error={errorMaKhoa}
                        />

                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button
                          disabled={disabled}
                          onClick={(event) => {
                            event.preventDefault();
                            handleSubmit();
                          }}
                        >
                          Lưu
                        </Button>
                      </DialogActions>
                    </Dialog>
        </div>
      </div>
      <div style={styles.table}>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={menuopen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
       <TableContainer component={Paper}>
       <Table sx={{ minWidth: 700 }} aria-label="customized table">
         <TableHead sx={{position: 'sticky',top: 0,  zIndex: 1,backgroundColor: "#0071A6",}}>
           <TableRow>
            <StyledTableCell align="center" >STT</StyledTableCell>
             <StyledTableCell align="center" >Tên Khoa</StyledTableCell>
             <StyledTableCell align="center" >Mã Khoa</StyledTableCell>
             <StyledTableCell align="center"></StyledTableCell>

           </TableRow>
         </TableHead>
         <TableBody sx={{overflowY:"auto"}}> 
          {filteredData.map((row, index) => (
            <StyledTableRow key={row.ten}>
              <StyledTableCell component="th" scope="row" align="center" width={50}>
                {index + 1} {/* Số thứ tự */}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row.ten}
              </StyledTableCell>
              <StyledTableCell align="center">{row.maKhoa}</StyledTableCell>
              <StyledTableCell align="center" width={150}>
                <IconButton><EditIcon></EditIcon></IconButton>   
                <IconButton
                
                id="demo-positioned-button"
                aria-controls={menuopen ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuopen ? 'true' : undefined}
                onClick={handleClick}
                >
                  <MoreHorizIcon />
                </IconButton>       
                     
              </StyledTableCell>
            </StyledTableRow>
          ))}
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
    marginLeft: 'auto', // Đẩy phần tử sang phải
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
export default TestPage;
