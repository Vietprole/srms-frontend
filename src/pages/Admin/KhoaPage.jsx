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
import Tooltip  from '@mui/material/Tooltip';
import Layout from '../Layout';
import { useState, useEffect,useCallback } from "react";
import {
  getAllFaculties,
  addFaculty,
  updateFaculty,
  getFacultyById
} from "@/api/api-faculties";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Autocomplete } from '@mui/material';
function KhoaPage() 
{
  const [khoaEditId, setKhoaEditId] = useState(""); // Lưu giá trị ID khoa cần sửa
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [disabledEdit, setDisabledEdit] = React.useState(true);
  const [tenKhoa, setTenKhoa] = useState(""); // Lưu giá trị Tên khoa
  const [maKhoa, setMaKhoa] = useState(""); // Lưu giá trị Mã khoa
  const [errorTenKhoa, setErrorTenKhoa] = useState(false); // Lưu trạng thái lỗi của Tên khoa
  const [errorMaKhoa, setErrorMaKhoa] = useState(false); // Lưu trạng thái lỗi của Mã khoa
  const isAlphabetWithSpaces = (text) => /^[a-zA-Z\s\u00C0-\u1EF9]+$/.test(text); // Kiểm tra tên khoa chỉ có chữ và khoảng trắng
  const isNumericCode = (text) => /^\d{3}$/.test(text); // Kiểm tra mã khoa là 3 ký tự số
  const [openSnackbar, setOpenSnackbar] = useState(false); // Quản lý việc hiển thị Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");  // Dùng để điều chỉnh mức độ của Snackbar
  const [tenKhoaEdit, setTenKhoaEdit] = useState(""); // Lưu giá trị Tên khoa
  const [maKhoaEdit, setMaKhoaEdit] = useState(""); // Lưu giá trị Mã khoa
  const [errorTenKhoaEdit, setErrorTenKhoaEdit] = useState(false); // Lưu trạng thái lỗi của Tên khoa
  const [errorMaKhoaEdit, setErrorMaKhoaEdit] = useState(false); // Lưu trạng thái lỗi của Mã khoa
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [pageSize, setPageSize] = useState(20); // 👈 Số bản ghi/trang mặc định
  const pageSizeOptions = [20,50, 100];
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalItems, setTotalItems] = useState(0); // Tổng số bản ghi thực tế
  const startRow = (currentPage - 1) * pageSize + 1;
const endRow = Math.min(currentPage * pageSize, totalItems);
useEffect(() => {
  fetchData(); // Gọi API để lấy danh sách khoa ngay khi trang load
}, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenEdit = async (id) => {
    const khoaData =await getFacultyById(id);
    setTenKhoaEdit(khoaData.ten);
    setMaKhoaEdit(khoaData.maKhoa);
    setKhoaEditId(id);
    setOpenEdit(true);
  }

  const handleClickCloseEdit = () => {
    setOpenEdit(false);
    setKhoaEditId("");
    setTenKhoaEdit("");
    setMaKhoaEdit("");
  };

  const handleClose = () => {
    setDisabled(false);
    setOpen(false);
  };
  useEffect(() => {
    if (!data.length) return; // ⛔ Không làm gì khi data chưa load xong
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
  
    const filtered = !searchQuery.trim()
      ? data
      : data.filter((row) =>
          row.ten.toLowerCase().includes(searchQuery.toLowerCase())
        );
  
    setFilteredData(filtered.slice(startIndex, endIndex));
    setTotalItems(filtered.length);
  }, [data, searchQuery, currentPage, pageSize]);
  
  
  const fetchData = async () => {
    const khoas = await getAllFaculties();
    console.log(khoas);
    setData(khoas);
  };

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

  const handleInputChangeEdit = useCallback((field, value) => {
    let isValid = true;

    // Kiểm tra tên khoa
    if (field === 'tenKhoa') {
      setTenKhoaEdit(value);
      if (!value.trim()) { // Kiểm tra nếu tên khoa trống
        setErrorTenKhoaEdit(true);
        isValid = false;
      } else if (!isAlphabetWithSpaces(value)) { // Kiểm tra tên khoa không hợp lệ
        setErrorTenKhoaEdit(true);
        isValid = false;
      } else {
        setErrorTenKhoaEdit(false);
      }
    }

    // Kiểm tra mã khoa
    if (field === 'maKhoa') {
      setMaKhoaEdit(value);
      if (!value.trim()) {  // Kiểm tra nếu mã khoa trống
        setErrorMaKhoaEdit(true);
        isValid = false;
      } else if (!isNumericCode(value)) {  // Kiểm tra mã khoa chỉ có 3 ký tự số
        setErrorMaKhoaEdit(true);
        isValid = false;
      } else {
        setErrorMaKhoaEdit(false);
      }
    }

    // Cập nhật trạng thái của nút "Lưu"
    // Nếu có lỗi ở bất kỳ trường nào hoặc nếu một trong hai trường trống, nút "Lưu" sẽ bị vô hiệu hóa
    setDisabledEdit(!(isValid && tenKhoaEdit.trim() && maKhoaEdit.trim() && !errorMaKhoaEdit && !errorTenKhoaEdit));
  }, [tenKhoaEdit, maKhoaEdit, errorMaKhoaEdit, errorTenKhoaEdit]);

  const handleBlurEdit = useCallback((field, value) => {
    let isValid = true;

    // Kiểm tra tên khoa
    if (field === 'tenKhoa') {
      setTenKhoaEdit(value);
      if (!value.trim()) { // Kiểm tra nếu tên khoa trống
        setErrorTenKhoaEdit(true);
        isValid = false;
      } else if (!isAlphabetWithSpaces(value)) { // Kiểm tra tên khoa không hợp lệ
        setErrorTenKhoaEdit(true);
        isValid = false;
      } else {
        setErrorTenKhoaEdit(false);
      }
    }

    // Kiểm tra mã khoa
    if (field === 'maKhoa') {
      setMaKhoaEdit(value);
      if (!value.trim()) {  // Kiểm tra nếu mã khoa trống
        setErrorMaKhoaEdit(true);
        isValid = false;
      } else if (!isNumericCode(value)) {  // Kiểm tra mã khoa chỉ có 3 ký tự số
        setErrorMaKhoaEdit(true);
        isValid = false;
      } else {
        setErrorMaKhoaEdit(false);
      }
    }

    // Cập nhật trạng thái của nút "Lưu"
    // Nếu có lỗi ở bất kỳ trường nào hoặc nếu một trong hai trường trống, nút "Lưu" sẽ bị vô hiệu hóa
    setDisabledEdit(!(isValid && tenKhoaEdit.trim() && maKhoaEdit.trim() && !errorMaKhoaEdit && !errorTenKhoaEdit));
  }, [tenKhoaEdit, maKhoaEdit, errorMaKhoaEdit, errorTenKhoaEdit]);

  const handleInputChange = useCallback((field, value) => {
    let isValid = true;

    // Kiểm tra tên khoa
    if (field === 'tenKhoa') {
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
    if (field === 'maKhoa') {
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
  }, [tenKhoa, maKhoa, errorTenKhoa, errorMaKhoa]);


  const handleBlur = useCallback((field, value) => {
    let isValid = true;

    // Kiểm tra tên khoa
    if (field === 'tenKhoa') {
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
    if (field === 'maKhoa') {
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
  }, [tenKhoa, maKhoa, errorTenKhoa, errorMaKhoa]);  // Các dependencies

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  
  const handleSubmitEdit = async () => {
    const khoaData = {
      ten: tenKhoaEdit.trim(),
      maKhoa: maKhoaEdit
    };
  
    try {
      const response = await updateFaculty(khoaEditId,khoaData);  // Gọi hàm updateFaculty
      if (response.status === 200) {  
        setSnackbarMessage("Khoa đã được cập nhật thành công!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        fetchData();
        handleClickCloseEdit();
      } else {
        setSnackbarMessage("Lỗi: Không thể cập nhật khoa");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.log("error: ", error);
      setSnackbarMessage("Lỗi: Không thể cập nhật khoa");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = async () => {
    const khoaData = {
      ten: tenKhoa.trim(),
      maKhoa: maKhoa
    };
  
    try {
      const response = await addFaculty(khoaData);  // Gọi hàm addFaculty
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
      console.log("error: ", error);
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

  // Thêm state để lưu thông tin user
  const [userRole, setUserRole] = useState('');

  // Thêm useEffect để lấy thông tin user từ localStorage khi component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.role || '');
  }, []);
  
  // Sửa lại phần kiểm tra role
  const isAdmin = userRole === 'Admin';
  const canManageKhoa = isAdmin;

  return (
    <Layout>
      <div style={styles.main}>
      <div style={styles.title}>
        <span>Danh sách khoa</span>
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
        {canManageKhoa && (
          <div style={styles.btnCreate}>
            <Button 
              sx={{width:"100%"}} 
              variant="contained" 
              onClick={handleClickOpen}
            >
              Tạo khoa
            </Button>
          </div>
        )}
      </div>
      <div style={styles.table}>
      
       <TableContainer component={Paper}>
       <Table sx={{ minWidth: 600 }} aria-label="customized table">
         <TableHead sx={{position: 'sticky',top: 0,  zIndex: 1,backgroundColor: "#0071A6",height:"5vh"}}>
           <TableRow>
            <StyledTableCell align="center" >STT</StyledTableCell>
             <StyledTableCell align="center" >Tên Khoa</StyledTableCell>
             <StyledTableCell align="center" >Mã Khoa</StyledTableCell>
             {canManageKhoa && (
               <StyledTableCell align="center"></StyledTableCell>
             )}

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
              {canManageKhoa && (
                <StyledTableCell align="center" width={150}>
                  <Tooltip title="Sửa khoa">
                    <IconButton onClick={() => handleClickOpenEdit(row.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              )}
            </StyledTableRow>
            
          ))}
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
      <div style={styles.divPagination}>
  {/* Phân trang bên trái */}
  <Box display="flex" alignItems="center">
  <Box
    sx={{
      ...styles.squareStyle,
      borderLeft: '1px solid #ccc',
      borderTopLeftRadius: '6px',
      borderBottomLeftRadius: '6px',
      opacity: currentPage === 1 ? 0.5 : 1,
      pointerEvents: currentPage === 1 ? 'none' : 'auto',
    }}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    <ArrowLeftIcon fontSize="small" />
  </Box>

  {[...Array(Math.ceil(totalItems / pageSize)).keys()].slice(0, 5).map(i => {
    const page = i + 1;
    return (
      <Box
        key={page}
        sx={{
          ...styles.squareStyle,
          ...(currentPage === page
            ? { backgroundColor: '#0071A6', color: '#fff', fontWeight: 'bold' }
            : {}),
        }}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </Box>
    );
  })}

  <Box
    sx={{
      ...styles.squareStyle,
      borderTopRightRadius: '6px',
      borderBottomRightRadius: '6px',
      opacity: currentPage >= Math.ceil(totalItems / pageSize) ? 0.5 : 1,
      pointerEvents: currentPage >= Math.ceil(totalItems / pageSize) ? 'none' : 'auto',
    }}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    <ArrowRightIcon fontSize="small" />
  </Box>
</Box>


  {/* Bên phải: Autocomplete + Dòng thông tin */}
  <Box display="flex" alignItems="center" gap={2}>
    <Box display="flex" alignItems="center" gap={1}>
      <span style={{ fontSize: 14 }}>Số bản ghi/trang:</span>
      <Autocomplete
        disableClearable
        options={pageSizeOptions}
        size="small"
        sx={{ width: 80, backgroundColor: "#fff", borderRadius: "4px" }}
        value={pageSize}
        onChange={(event, newValue) => {
          setPageSize(newValue);
          // Optionally update current page
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" size="small" />
        )}
      />
    </Box>
    {/* Thông tin dòng */}
    <span style={{ fontSize: 14, color: '#333' }}>
      Dòng {startRow} đến {endRow} / {totalItems}
    </span>

  </Box>
</div>



      <Dialog id='editKhoa' open={openEdit} onClose={handleClickCloseEdit} fullWidth>
                      <DialogTitle>Sửa khoa:</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Sửa thông tin khoa
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenKhoa'
                          margin="dense"
                          label="Tên khoa"
                          fullWidth
                          variant="standard"
                          value={tenKhoaEdit} // Gán giá trị từ state
                          onInput={(e) => handleInputChangeEdit("tenKhoa", e.target.value)} // Sử dụng onInput để kiểm tra tính hợp lệ ngay khi nhập liệu
                          onBlur={(e) => handleBlurEdit("tenKhoa", e.target.value)} // Sử dụng onBlur để kiểm tra tính hợp lệ
                          helperText="Tên khoa không được để trống và không được chứa các kí tự đặc biệt"
                          autoComplete='off'
                          error={errorTenKhoaEdit}
                        >
                        </TextField>
                        <TextField
                          autoFocus
                          id='maKhoa'
                          required
                          margin="dense"
                          label="Mã khoa"
                          fullWidth
                          variant="standard"
                          helperText="Mã khoa chỉ gồm 3 kí tự số và không được chứa các kí tự chữ và các kí tự đặc biệt"
                          value={maKhoaEdit} // k thể sửa mã khoa
                          inputProps={{ maxLength: 3 }}
                          autoComplete='off'
                          error={errorMaKhoaEdit}
                        />

                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClickCloseEdit}>Hủy</Button>
                        <Button
                         disabled={disabledEdit}
                         onClick={(event) => {
                            handleSubmitEdit();
                           event.preventDefault();
                         }}
                        >
                          Lưu
                        </Button>
                      </DialogActions>
                    </Dialog>
      </div>
     
    </Layout>
  );
};
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
  },
  tbActions: {
    width: '100%',
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: '10px',
  },
  ipSearch: {
    width: '25%',
    height: 40,
    justifyContent: 'flex-start',
    borderRadius: '5px',
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
  },
  divPagination: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between', // 👉 chia trái & phải
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
  }
  
  
  
  
};

export default KhoaPage;
