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
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { useState, useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  getAllKhoas
} from "@/api/api-khoa";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../Layout';
import {getAllGiangViens,addGiangVien,getGiangVienById,updateGiangVien,deleteGiangVien} from "@/api/api-giangvien";
function GiangVienPage() 
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
      marginLeft: '10px',
      marginBottom: '10px',
    },
  };
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [khoas, setKhoas] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [selectedKhoa, setSelectedKhoa] = useState(null); // Lưu khoa được chọn
  const [selectedKhoaFilter, setSelectedKhoaFilter] = useState(null); // Lưu khoa được chọn để lọc dữ liệu
  const [tenGiangVien, setTenGiangVien] = useState("");
  const [errorTenGiangVien, setErrorTenGiangVien] = useState(false);
  const [tenKhoa, setTenKhoa] = useState("");
  const [giangVienId, setGiangVienId] = useState(null);
  const [khoaId, setKhoaId] = useState("");
  const handleOpenEditDialog  = async (giangVienId) => {
    const giangVien = await getGiangVienById(giangVienId);
    setTenGiangVien(giangVien.ten);
    setTenKhoa(giangVien.tenKhoa);
    setOpenEditDialog(true);
    setKhoaId(giangVien.khoaId);
    setGiangVienId(giangVienId);
  };  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setTenGiangVien("");
    setTenKhoa("");
    setKhoaId("");
    setGiangVienId(null);
    setErrorTenGiangVien(false);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  }
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedKhoa(null);
    setTenGiangVien("");

  }

  const handleKhoaChange = (event, newValue) => {
    setSelectedKhoaFilter(newValue);
    if (!newValue) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) => row.tenKhoa === newValue.ten);
      setFilteredData(filtered);
    }
  };


  useEffect(() => {
    fetchData();
  }, []); 
  
  
  const fetchData = async () => {
    const giangvien = await getAllGiangViens();
    setData(giangvien);
    setFilteredData(giangvien);
    const khoa = await getAllKhoas();
    setKhoas(khoa);
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

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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

  const handleSubmitAdd = async () => {
    if (tenGiangVien.trim() === "") {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng nhập tên giảng viên");
      setOpenSnackbar(true);
      return;
    }
    if (!selectedKhoa) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng chọn khoa");
      setOpenSnackbar(true);
      return;
    }
    const newGiangVien = {
      ten: tenGiangVien,
      khoaId: selectedKhoa.id,
    };
    try {
      const rp =await addGiangVien(newGiangVien);
      if(rp.status===201)
      {
        setSnackbarMessage("Thêm giảng viên thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseAddDialog();
        fetchData();
      }
      else
      {
        setSnackbarMessage("Thêm giảng viêm thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }

  };
  const handleSubmitEditDialog = async () => {
    if (tenGiangVien.trim() === "") {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng nhập tên giảng viên");
      setOpenSnackbar(true);
      return;
    }
    const data = {
      ten: tenGiangVien,
      khoaId: khoaId,
    };
    try {
      const rp =await updateGiangVien(giangVienId,data);
      if(rp.status===200)
      {
        setSnackbarMessage("Cập nhật giảng viên thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseEditDialog();
        fetchData();
      }else if(rp.status===404)
      {
        setSnackbarMessage("Không tìm thấy giảng viên");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
      else
      {
        setSnackbarMessage("Cập nhật giảng viêm thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Cập nhật giảng viêm thất bại");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.log(error);
    }
  };

  const handleOpenDeleteDialog = (giangVienId) => {
    setGiangVienId(giangVienId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setGiangVienId(null);
  };

  const handleDeleteGiangVien = async () => {
    try {
      await deleteGiangVien(giangVienId);
      setSnackbarMessage("Xóa giảng viên thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      fetchData();
    } catch (error) {
      setSnackbarMessage("Xóa giảng viên thất bại");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Layout>
      <div style={styles.main}>
      <div style={styles.title}>
        <span>Danh sách giảng viên</span>
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
              placeholder="Tìm kiếm theo tên giảng viên..."
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
              value={searchQuery} // Liên kết giá trị tìm kiếm với state
              onChange={handleSearchChange} // Gọi hàm xử lý khi thay đổi
            />
          </Box>
        </div>
        <div style={styles.cbKhoa}>
        <Autocomplete
          sx={{ width: "100%" }}
          options={khoas}
          getOptionLabel={(option) => option.ten || ""}
          required
          value={selectedKhoaFilter}
          onChange={handleKhoaChange}
          renderInput={(params) => (
            <TextField {...params} label="Chọn khoa" size="small" />
          )}
        />


        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained" onClick={handleOpenAddDialog}>Tạo giảng viên</Button>
          <Dialog id='themGiangVien' fullWidth open={openAddDialog} onClose={handleCloseAddDialog} >
                      <DialogTitle>Tạo giảng viên mới:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Thêm giảng viên mới vào hệ thống
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenGiangVien'
                          margin="dense"
                          label="Tên giảng viên"
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setTenGiangVien(e.target.value.trim())}
                          error={errorTenGiangVien}
                          onInput={(e) => setErrorTenGiangVien(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập tên giảng viên"
                          autoComplete='off'
                        />
          
                       <Autocomplete
                          options={khoas}
                          getOptionLabel={(option) => option.ten || ''}
                          noOptionsText="Không tìm thấy khoa"
                          required
                          id="disable-clearable"
                          disableClearable
                          onChange={(event, newValue) => setSelectedKhoa(newValue)} // Cập nhật state khi chọn khoa
                          renderInput={(params) => (
                            <TextField {...params} label="Chọn khoa" variant="standard" />
                          )}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseAddDialog} >Hủy</Button>
                        <Button
                          onClick={handleSubmitAdd}
                        >
                          Lưu
                        </Button>
                      </DialogActions>
                    </Dialog>
        </div>
      </div>
      <div style={styles.table}>
      
       <TableContainer component={Paper}>
       <Table sx={{ minWidth: 700 }} aria-label="customized table">
         <TableHead sx={{position: 'sticky',top: 0,  zIndex: 1,backgroundColor: "#0071A6",}}>
          <TableRow>
            <StyledTableCell align="center">STT</StyledTableCell>
            <StyledTableCell align="center">Tên giảng viên</StyledTableCell>
            <StyledTableCell align="center">Tên Khoa</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
          </TableRow>

         </TableHead>
         <TableBody sx={{ overflowY: "auto" }}>
            {filteredData.map((row, index) => (
              <StyledTableRow key={row.maHocPhan || index}>
                <StyledTableCell align="center" width={150}>{index + 1}</StyledTableCell>
                <StyledTableCell align="center">{row.ten}</StyledTableCell>
                <StyledTableCell align="center" width={450}>{row.tenKhoa}</StyledTableCell>
                <StyledTableCell align="center" width={150}>
                  <Tooltip title="Sửa giảng viên">
                    <IconButton onClick={() => handleOpenEditDialog(row.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa giảng viên">
                    <IconButton onClick={() => handleOpenDeleteDialog(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
              
            ))}
            <Dialog id='suaGiangVien' fullWidth open={openEditDialog} onClose={handleCloseEditDialog}>
                      <DialogTitle>Sửa thông tin giảng viên:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Sửa thông tin giảng viên này
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenGiangVien'
                          margin="dense"
                          label="Tên giảng viên"
                          defaultValue={tenGiangVien}
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setTenGiangVien(e.target.value.trim())}
                          error={errorTenGiangVien}
                          onInput={(e) => setErrorTenGiangVien(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập tên giảng viên"
                          autoComplete='off'
                        />
                        <TextField
                          autoFocus
                          required
                          id='tenKhoa'
                          margin="dense"
                          label="Thuộc khoa"
                          defaultValue={tenKhoa}
                          fullWidth
                          variant="standard"
                          helperText="Không thể thay đổi khoa"
                          autoComplete='off'
                          focused={false}
                          InputProps={{ readOnly: true }}
                        />
          
                       
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseEditDialog} >Hủy</Button>
                        <Button
                          onClick={handleSubmitEditDialog}
                        >
                          Lưu
                        </Button>
                      </DialogActions>
                    </Dialog>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
              <DialogTitle>Xóa Giảng Viên</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bạn có chắc chắn muốn xóa giảng viên này không?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                <Button onClick={handleDeleteGiangVien}>Xóa</Button>
              </DialogActions>
            </Dialog>
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

export default GiangVienPage;
