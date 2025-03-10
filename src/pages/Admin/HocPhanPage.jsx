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
import { useState, useEffect,useRef } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  getAllKhoas
} from "@/api/api-khoa";
import { getAllHocPhans,addHocPhan,getHocPhanById,updateHocPhan } from '@/api/api-hocphan';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../Layout';

function HocPhanPage() 
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [khoas, setKhoas] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [selectedKhoaFilter, setSelectedKhoaFilter] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [tenHocPhan, setTenHocPhan] = useState("");
  const [soTinChi, setSoTinChi] = useState("");
  const [selectedKhoa, setSelectedKhoa] = useState(null);
  const [errorTenHocPhan, setErrorTenHocPhan] = useState(false);
  const [errorSoTinChi, setErrorSoTinChi] = useState(false);
  const soTinChiRef = useRef("");
  const tenHocPhanRef = useRef("");
  const [maHocPhan, setMaHocPhan] = useState("");
  const [tenKhoa, setTenKhoa] = useState("");
  const [hocPhanId, setHocPhanId] = useState("");
  const handleOpenEditDialog = async(hocPhanId) => {
    const hocphan = await getHocPhanById(hocPhanId);
    if(hocphan.status===200)
    {
     
      setTenHocPhan(hocphan.data.ten);
      setSoTinChi(hocphan.data.soTinChi);
      setSelectedKhoa(hocphan.data.khoa);
      tenHocPhanRef.current = hocphan.data.ten;
      soTinChiRef.current = hocphan.data.soTinChi;
      setMaHocPhan(hocphan.data.maHocPhan);
      setTenKhoa(hocphan.data.tenKhoa);
      setHocPhanId(hocPhanId);
      setOpenEditDialog(true);

    }
    else if(hocphan.status===404)
    {
      setSnackbarMessage("Không tìm thấy học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
    else
    {
      setSnackbarMessage("Lỗi không xác định");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseDialogEditHocPhans = () => {
    setOpenEditDialog(false);
    setTenHocPhan("");
    setSoTinChi("");
    setSelectedKhoa(null);
    setErrorTenHocPhan(false);
    setErrorSoTinChi(false);
    setTenKhoa("");
    tenHocPhanRef.current = "";
    soTinChiRef.current = "";

  };
  const handleOpenAddDialog = async() => {
    setOpenAddDialog(true);
  };
  const handleCloseDialogAddHocPhans = () => {
    setTenHocPhan("");
    setSoTinChi("");
    setSelectedKhoa(null);
    setErrorTenHocPhan(false);
    setErrorSoTinChi(false);
    setOpenAddDialog(false);
  };

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
    const hocphans = await getAllHocPhans();
    setData(hocphans);
    setFilteredData(hocphans); 
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

  const handleAddSubmit = async () => {
    if (tenHocPhan.trim() === "") {
      
      setErrorTenHocPhan(true);
      setSnackbarMessage("Vui lòng nhập tên học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if(soTinChi.trim() === "")
    {
      setErrorSoTinChi(true);
      setSnackbarMessage("Vui lòng nhập số tín chỉ");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!selectedKhoa) {
      setSnackbarMessage("Vui lòng chọn khoa");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const hocphanData = {
      ten: tenHocPhan,
      soTinChi: soTinChi,
      khoaId: selectedKhoa.id,
    };
    try {
      const rp =await addHocPhan(hocphanData);
      if(rp.status===201)
      {
        setSnackbarMessage("Thêm học phần thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogAddHocPhans();
        fetchData();
      }
      else
      {
        setSnackbarMessage("Thêm học phần thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  const handleSubmitEdit = async () => {
    if (tenHocPhanRef.current.trim() === "") {
      setErrorTenHocPhan(true);
      setSnackbarMessage("Vui lòng nhập tên học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if(soTinChiRef.current.trim() === "")
    {
      setErrorSoTinChi(true);
      setSnackbarMessage("Vui lòng nhập số tín chỉ");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const hocphanData = {
      ten: tenHocPhanRef.current,
      soTinChi: soTinChiRef.current,
    };
    try {
      const rp =await updateHocPhan(hocPhanId,hocphanData);
      if(rp.status===200)
      {
        setSnackbarMessage("Cập nhật học phần thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogEditHocPhans();
        fetchData();
      }else if(rp.status===404)
      {
        setSnackbarMessage("Không tìm thấy học phần");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
      else
      {
        setOpenSnackbar(true);
        setSnackbarMessage("Cập nhật học phần thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };


  return (
    <Layout>
      <div style={styles.main}>
      <div style={styles.title}>
        <span>Danh sách học phần</span>
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
              placeholder="Tìm kiếm theo tên học phần..."
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
          // disableClearable
          value={selectedKhoaFilter}
          onChange={handleKhoaChange}
          renderInput={(params) => (
            <TextField {...params} label="Chọn khoa" size="small" />
          )}
        />


        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained" onClick={()=>{handleOpenAddDialog()}} >Tạo học phần</Button>
          <Dialog id='themHocPhan' fullWidth open={openAddDialog} onClose={handleCloseDialogAddHocPhans}>
                      <DialogTitle>Tạo học phần mới:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Thêm học phần mới vào hệ thống
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenHocPhan'
                          margin="dense"
                          label="Tên học phần"
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setTenHocPhan(e.target.value.trim())}
                          error={errorTenHocPhan}
                          onInput={(e) => setErrorTenHocPhan(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập tên học phần"
                          autoComplete='off'
                        />
                        <TextField
                          autoFocus
                          required
                          id="soTinChi"
                          margin="dense"
                          label="Số tín chỉ"
                          variant="standard"
                          inputRef={soTinChiRef}
                          onChange={(e) => {
                            const value = e.target.value;
                            
                            // Cho phép số thập phân (chỉ 1 dấu '.')
                            if (/^\d*\.?\d*$/.test(value)) {
                              soTinChiRef.current = value; 
                              setErrorSoTinChi(false);
                            } else {
                              soTinChiRef.current = ""; 
                              e.target.value = ""; 
                              setErrorSoTinChi(true);
                            }
                          }}
                          onBlur={(e) => setSoTinChi(e.target.value.trim())}
                          inputProps={{ maxLength: 5 }}
                          error={errorSoTinChi}
                          helperText={errorSoTinChi ? "Vui lòng nhập số hợp lệ" : "Vui lòng nhập số tín chỉ"}  
                          autoComplete="off"
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
                        <Button onClick={handleCloseDialogAddHocPhans}>Hủy</Button>
                        <Button
                          onClick={()=>{handleAddSubmit()}}
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
            <StyledTableCell align="center">Mã học phần</StyledTableCell>
            <StyledTableCell align="center">Tên học phần</StyledTableCell>
            <StyledTableCell align="center">Số tín chỉ</StyledTableCell>
            <StyledTableCell align="center">Tên Khoa</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
          </TableRow>

         </TableHead>
         <TableBody sx={{ overflowY: "auto" }}>
            {filteredData.map((row, index) => (
              <StyledTableRow key={row.maHocPhan || index}>

                
                <StyledTableCell align="center" width={40}>{index + 1}</StyledTableCell>
                <StyledTableCell align="center" width={150}>{row.maHocPhan}</StyledTableCell>
                <StyledTableCell align="left">{row.ten}</StyledTableCell>
                <StyledTableCell align="center" width={150}>{row.soTinChi}</StyledTableCell>
                <StyledTableCell align="center" width={300}>{row.tenKhoa}</StyledTableCell>
                <StyledTableCell align="center" width={150}>
                  <Tooltip title="Sửa thông tin học phần">
                    <IconButton
                      onClick={() => handleOpenEditDialog(row.id)}
                    ><EditIcon /></IconButton>
                  </Tooltip>
        
                </StyledTableCell>
              </StyledTableRow>
              
            ))}
            <Dialog id='suaHocPhan' fullWidth open={openEditDialog} onClose={handleCloseDialogEditHocPhans}>
                      <DialogTitle>Sửa học phần:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Sửa thông tin học phần
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='maHocPhan'
                          margin="dense"
                          label="Mã học phần"
                          fullWidth
                          variant="standard"
                          defaultValue={maHocPhan}
                          helperText="Mã học phần không thể thay đổi"
                          autoComplete='off'
                          focused={false}
                          InputProps={{ readOnly: true }}
                        />
                        <TextField
                          autoFocus
                          required
                          id='tenHocPhan'
                          margin="dense"
                          label="Tên học phần"
                          fullWidth
                          variant="standard"
                          defaultValue={tenHocPhan}
                          onChange={(e) => (tenHocPhanRef.current = e.target.value)} 
                          onBlur={(e) => setErrorTenHocPhan(e.target.value.trim() === "")}
                          error={errorTenHocPhan}
                          helperText="Vui lòng nhập tên học phần"
                          autoComplete='off'
                        />
                        <TextField
                          autoFocus
                          required
                          id="soTinChi"
                          margin="dense"
                          label="Số tín chỉ"
                          variant="standard"
                          defaultValue={soTinChi}
                          inputRef={soTinChiRef}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                              soTinChiRef.current = value; 
                              setErrorSoTinChi(false);
                            } else {
                              soTinChiRef.current = ""; 
                              e.target.value = ""; 
                              setErrorSoTinChi(true);
                            }
                          }}
                          onBlur={(e) => setSoTinChi(e.target.value.trim())}
                          inputProps={{ maxLength: 5 }}
                          error={errorSoTinChi}
                          helperText={errorSoTinChi ? "Vui lòng nhập số hợp lệ" : ""}  
                          autoComplete="off"
                        />
                        <TextField
                          autoFocus
                          required
                          id='tenKhoa'
                          margin="dense"
                          label="Thuộc khoa"
                          fullWidth
                          variant="standard"
                          defaultValue={tenKhoa}
                          helperText="Không thể thay đổi khoa"
                          autoComplete='off'
                          focused={false}
                          InputProps={{ readOnly: true }}
                        />
                       
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialogEditHocPhans}>Hủy</Button>
                        <Button
                          onClick={()=>{handleSubmitEdit()}}
                        >
                          Lưu
                        </Button>
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

export default HocPhanPage;
