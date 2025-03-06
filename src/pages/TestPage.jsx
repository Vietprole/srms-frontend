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
import { getAllHocPhans,getHocPhanById } from '@/api/api-hocphan';
import { getAllKhoas } from '@/api/api-khoa';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Layout from './Layout';
import { getAllLopHocPhans } from '@/api/api-lophocphan';
import { getAllHocKys } from '@/api/api-hocky';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import AttachmentIcon from '@mui/icons-material/Attachment';
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
    }
  }
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [tenLopHocPhan, setTenLopHocPhan] = useState("");
  const [errorTenLopHocPhan, setErrorTenLopHocPhan] = useState(false);
  const [selectedHocPhan, setSelectedHocPhan] = useState(null);
  const [selectedHocKy, setSelectedHocKy] = useState(null);
  const [selectedGiangVien, setSelectedGiangVien] = useState(null);
  const [khoa, setKhoa] = useState("");
  const [nhom, setNhom] = useState("");
  const [allHocPhans, setAllHocPhans] = useState([]);
  const [hocPhanFilter, setHocPhanFilter] = useState([]);
  const [openDialogHocPhan, setOpenDialogHocPhan] = useState(false);
  const [openDialogGiangVien, setOpenDialogGiangVien] = useState(false);
  const [khoas, setKhoas] = useState([]);
  const [selectedKhoa, setSelectedKhoa] = useState(null);
  const [selectedKhoaFilter, setSelectedKhoaFilter] = useState(null);
  const [allHocKy, setAllHocKy] = useState([]);

  const handleSelectGiangVien = (event) => {
    setSelectedGiangVien(event.target.value);
  }

  const handleSelectHocPhan = (event) => {
    setSelectedHocPhan(event.target.value); 
  };

  const handleKhoaChange = (event, newValue) => {
    setSelectedKhoaFilter(newValue);
    if (!newValue) {
      setHocPhanFilter(allHocPhans); 
    } else {
      const filtered = allHocPhans.filter((row) => row.tenKhoa === newValue.ten);
      setHocPhanFilter(filtered);
    }
  };

  const handleOpenAddDialog = async () => { 
    const allHocKy = await getAllHocKys();
    setAllHocKy(allHocKy);
    setOpenAddDialog(true);
  }
  
  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    // setAllHocKy(null);
  }

  const handleOpenDialogHocPhan =async () => { // mở dialog chọn học phần
    const hocphans = await getAllHocPhans();
    setAllHocPhans(hocphans);
    setHocPhanFilter(hocphans);
    setOpenDialogHocPhan(true);
  };

  const handleCloseDialogHocPhan = () => { // đóng dialog chọn học phần
    setOpenDialogHocPhan(false);
    setSelectedKhoa(null);
    setSelectedHocPhan(null);
  }
  const handleOpenDialogGiangVien =async () => { // mở dialog chọn giang vien

    setOpenDialogGiangVien(true);
  };

  const handleCloseDialogGiangVien = () => { // đóng dialog chọn giang vien
    setOpenDialogGiangVien(false);

  }

  useEffect(() => {
    fetchData();
    
  }, []); 
  
  const fetchData = async () => {
    const lophocphans = await getAllLopHocPhans();
    const allKhoa= await getAllKhoas();
    setKhoas(allKhoa);
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

  const submicSelectedHocPhan = async () => { // đã xong
    if(selectedHocPhan ===null)
    {
      setSnackbarMessage("Bạn chưa chọn học phần!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    else
    {
      setOpenDialogHocPhan(false);
      const hocPhan = await getHocPhanById(selectedHocPhan);
      setSelectedHocPhan(hocPhan.data);
    }
  };


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
        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained" onClick={handleOpenAddDialog}>Tạo lớp học phần</Button>

              <Dialog id='taoLopHocPhan' fullWidth open={openAddDialog} onClose={handleCloseDialog} maxWidth={"md"} >
              <DialogTitle>Tạo lớp học phần mới:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Thêm lớp học phần mới vào hệ thống
                        </DialogContentText>
                        <Autocomplete
                            options={allHocKy}
                            getOptionLabel={(option) => option.tenHienThi || ''}
                            noOptionsText="Không tìm thấy khoa"
                            required
                            id="disable-clearable"
                            disableClearable
                            onChange={(event, newValue) => setSelectedHocKy(newValue)}
                            renderInput={(params) => (
                              <TextField {...params} label="Thuộc học kỳ" variant="standard" />
                            )}
                          />
                        <TextField
                          autoFocus
                          required
                          id='tenLopHocPhan'
                          margin="dense"
                          label="Tên lớp học phần"
                          fullWidth
                          variant="standard"
                          
                          helperText="Vui lòng nhập tên lớp học phần"
                          autoComplete='off'
                        />
                        <Box display="flex" alignItems="center" sx={{paddingBottom:"5px"}}>
                          <DialogContentText>Chọn học phần:</DialogContentText>
                          <Button variant="contained" sx={{marginLeft:"auto"}} onClick={handleOpenDialogHocPhan}><AttachmentIcon></AttachmentIcon> </Button>
                        </Box>
                        
                        <TableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd" }}>
                          <Table stickyHeader sx={{ minWidth: 700 }}>
                            <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#0071A6", height: "40px" }}>
                              <TableRow sx={{ height: "40px" }}>
                                <StyledTableCell align="center" sx={{ width: 150, padding: "4px 8px" }}>Mã học phần</StyledTableCell>
                                <StyledTableCell align="center" sx={{ width: 250, padding: "4px 8px" }}>Tên học phần</StyledTableCell>
                                <StyledTableCell align="center" sx={{ width: 100, padding: "4px 8px" }}>Số tín chỉ</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                            {selectedHocPhan ? (
                              <TableRow>
                                <StyledTableCell align="center">{selectedHocPhan?.maHocPhan || "N/A"}</StyledTableCell>
                                <StyledTableCell align="center">{selectedHocPhan?.ten || "N/A"}</StyledTableCell>
                                <StyledTableCell align="center">{selectedHocPhan?.soTinChi ?? 0}</StyledTableCell>
                              </TableRow>
                            ) : (
                              <TableRow>
                                <StyledTableCell align="center" colSpan={3}>Chưa có học phần nào được chọn</StyledTableCell>
                              </TableRow>
                            )}
                            </TableBody>
                              </Table>
                          </TableContainer>
                          <Box display="flex" alignItems="center" sx={{paddingBottom:"5px", paddingTop:"5px"}}>
                            <DialogContentText>Chọn giảng viên dạy:</DialogContentText>
                            <Button variant="contained" sx={{marginLeft:"auto"}}><AttachmentIcon></AttachmentIcon> </Button>
                          </Box>
                          <TableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd" }}>
                          <Table stickyHeader sx={{ minWidth: 700 }}>
                            <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#0071A6", height: "40px" }}>
                              <TableRow sx={{ height: "40px" }}>
                                <StyledTableCell align="center" sx={{ padding: "4px 8px" }}>Tên giảng viên</StyledTableCell>
                                <StyledTableCell align="center" sx={{ padding: "4px 8px" }}>Thuộc khoa</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                            {selectedGiangVien ? (
                              <TableRow>
                                <StyledTableCell align="center">{selectedHocPhan?.ten || "N/A"}</StyledTableCell>
                                <StyledTableCell align="center">{selectedHocPhan?.soTinChi ?? 0}</StyledTableCell>
                              </TableRow>
                            ) : (
                              <TableRow>
                                <StyledTableCell align="center" colSpan={2}>Chưa có giảng viên nào được chọn</StyledTableCell>
                              </TableRow>
                            )}
                            </TableBody>
                              </Table>
                          </TableContainer>
                          
                      </DialogContent>
                      <DialogActions>
                        <Button>Hủy</Button>
                        <Button

                        >
                          Lưu
                        </Button>
                      </DialogActions>
              </Dialog>
          <Dialog id='chonHocPhan' fullWidth open={openDialogHocPhan} onClose={handleCloseDialogHocPhan} maxWidth={"md"}>
            <DialogTitle>Chọn học phần:</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "40%",
                  paddingBottom: "10px",
                }}
              >
                <Autocomplete
                  sx={{ flexGrow: 1, width: "100%" ,marginTop: "10px"}}
                  options={khoas}
                  getOptionLabel={(option) => option.ten || ""}
                  value={selectedKhoaFilter}
                  onChange={handleKhoaChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Chọn khoa" size="small" />
                  )}
                />
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd" }}>
                <Table stickyHeader sx={{ minWidth: 700 }}>
                      <TableHead sx={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#0071A6" }}>
                        <TableRow>
                          <StyledTableCell align="center" sx={{ width: 40 }}></StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: 150 }}>Mã học phần</StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: 250 }}>Tên học phần</StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: 100 }}>Số tín chỉ</StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: 200 }}>Tên Khoa</StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {hocPhanFilter.length > 0 ? (
                          hocPhanFilter.map((row, index) => (
                            <StyledTableRow key={row.maHocPhan || index}>
                              <StyledTableCell align="center">
                                <RadioGroup value={selectedHocPhan} onChange={handleSelectHocPhan}>
                                  <Radio value={row.id} />
                                </RadioGroup>
                              </StyledTableCell>
                              <StyledTableCell align="center">{row.maHocPhan}</StyledTableCell>
                              <StyledTableCell align="left">{row.ten}</StyledTableCell>
                              <StyledTableCell align="center">{row.soTinChi}</StyledTableCell>
                              <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            <StyledTableCell align="center" colSpan={5}>
                              Không tìm thấy học phần nào
                            </StyledTableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>

                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={submicSelectedHocPhan}
                color="primary"
              >
              Chọn học phần này
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog id='chonGiangVien' fullWidth maxWidth={"md"} open={openDialogGiangVien} >
            <DialogTitle>Chọn giảng viên:</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "40%",
                  paddingBottom: "10px",
                }}
              >
                <Autocomplete
                  sx={{ flexGrow: 1, width: "100%" ,marginTop: "10px"}}
                  options={khoas}
                  getOptionLabel={(option) => option.ten || ""}
                  value={selectedKhoaFilter}
                  onChange={handleKhoaChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Chọn khoa" size="small" />
                  )}
                />
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd" }}>
                <Table stickyHeader sx={{ minWidth: 700 }}>
                      <TableHead sx={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#0071A6" }}>
                        <TableRow>
                          <StyledTableCell align="center" sx={{ width: 50 }}></StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: 250 }}>Tên giảng viên</StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: 200 }}>Thuộc Khoa</StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {hocPhanFilter.length > 0 ? (
                          hocPhanFilter.map((row, index) => (
                            <StyledTableRow key={row.ten || index}>
                              <StyledTableCell align="center">
                                <RadioGroup value={selectedGiangVien} onChange={handleSelectGiangVien}>
                                  <Radio value={row.id} />
                                </RadioGroup>
                              </StyledTableCell>
                              <StyledTableCell align="left">{row.ten}</StyledTableCell>
                              <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            <StyledTableCell align="center" colSpan={5}>
                              Không tìm thấy giảng viên nào
                            </StyledTableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>

                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={submicSelectedHocPhan}
                color="primary"
              >
              Chọn giảng viên này
              </Button>
            </DialogActions>
          </Dialog>


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
