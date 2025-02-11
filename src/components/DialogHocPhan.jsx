import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { getNganhById } from "@/api/api-nganh";
import Typography  from "@mui/material/Typography";
import DialogContentText from '@mui/material/DialogContentText';
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Fragment } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add'; 
import DeleteIcon from '@mui/icons-material/Delete';
import { getHocPhans,getAllHocPhanNotNganhId } from "@/api/api-hocphan";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Checkbox from "@mui/material/Checkbox";
import { addHocPhansToNganh } from "@/api/api-nganh";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { removeHocPhanFromNganh } from "@/api/api-nganh";
import { set } from "date-fns";

function DialogHocPhan({ nganhId, open, onClose }) {
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
      
    },
    btnDelete: {
      width: "18%",
      height: "100%",
      marginLeft: "auto",
      padding: "0 10px",
    },
  };

  const [nganh, setNganh] = useState(null);
  const [hocPhanDaChon, setHocPhanDaChon] = useState([]);
  const [hocPhanChuaChon, setHocPhanChuaChon] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedHocPhans, setSelectedHocPhans] = useState([]);
  const [selectedDeleteHocPhan, setSelectedDeleteHocPhan] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tongSoTinChi, setTongSoTinChi] = useState(0);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(hocPhanDaChon); // Lưu dữ liệu đã lọc

  useEffect(() => {
    if (open && nganhId) {
      fetchData();
    }
  }, [nganhId, open]);

  const fetchData = async () => {
    try {
      const nganhs = await getNganhById(nganhId);
      const hocphans = await getHocPhans(null,nganhId, null);
      const totalCredits = hocphans.reduce((total, hocPhan) => total + hocPhan.soTinChi, 0);
      setHocPhanDaChon(hocphans);
      setFilteredData(hocphans);
      setNganh(nganhs);
      setTongSoTinChi(totalCredits);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ngành:", error);
    }
  };

  const handleClose = () => {
    onClose();
  };

    
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value); 
    filterData(value); 
  };

  const filterData = (query) => {
    if (!query.trim()) {
      setFilteredData(hocPhanDaChon); // If search query is empty, show all data
    } else {
      const filtered = hocPhanDaChon.filter((row) =>
        row.ten.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
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
  

  const openDialogAdd =async () => {
    const hocphans = await getAllHocPhanNotNganhId(nganhId);
    setHocPhanChuaChon(hocphans);
    setOpenAddDialog(true);
    fetchData();
  }

  const handleCloseDialogAdd = () => {
    setOpenAddDialog(false);
    setSelectedHocPhans([]);
    
  }

  const handleSelectHocPhan = (hocPhanId) => {
    setSelectedHocPhans((prevSelected) =>
      prevSelected.includes(hocPhanId)
        ? prevSelected.filter((id) => id !== hocPhanId) // Remove id if already selected
        : [...prevSelected, hocPhanId] // Add id if not selected
    );
  };

  const handleSelect = (id) => {
    setSelectedDeleteHocPhan((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id); // Bỏ chọn
      } else {
        return [...prevSelected, id]; // Chọn
      }
    });
  };
  
  const handleSubmitAddHocPhan = async () => {
    try {
      const response = await addHocPhansToNganh(nganhId, selectedHocPhans);
      if (response.status === 200) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Thêm học phần vào ngành thành công!");
        setOpenSnackbar(true);
        setOpenAddDialog(false);
        setSelectedHocPhans([]); // Reset selected checkboxes here
        fetchData();
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Thêm học phần vào ngành thất bại!");
        setOpenSnackbar(true);
        setHocPhanChuaChon(await getAllHocPhanNotNganhId(nganhId));
        setSelectedHocPhans([]); // Reset selected checkboxes here
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Thêm học phần vào ngành thất bại!");
      setOpenSnackbar(true);
      console.error("Lỗi khi thêm học phần vào ngành: ", error);
      setSelectedHocPhans([]); // Reset selected checkboxes here if there's an error
    }
  };
  

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleDeleteHocPhan = async () => {
    let successCount = 0;
    let failureCount = 0;
  
    try {
      for (const hocPhanId of selectedDeleteHocPhan) {
        const response = await removeHocPhanFromNganh(nganhId, hocPhanId);
  
        if (response.status === 204) {
          successCount++;
        } else {
          failureCount++;
        }
      }
      if (successCount > 0 || failureCount > 0) {
        setSnackbarSeverity("success");
        setSnackbarMessage(`Đã xóa thành công: ${successCount}, thất bại: ${failureCount}`);
        setOpenSnackbar(true);
        setSelectedDeleteHocPhan([]);
      } else {
        setSnackbarSeverity("info");
        setSnackbarMessage("Không có học phần nào được chọn.");
        setOpenSnackbar(true);
        setSelectedDeleteHocPhan([]);
      }
      fetchData();
      setOpenAlertDialog(false);
    } catch (error) {
      console.error("Lỗi khi xóa học phần:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Có lỗi xảy ra khi xóa học phần!");
      setOpenSnackbar(true);
      setSelectedDeleteHocPhan([]);
    }
  };
  
  const handleOpenAlertDialog = () => {
    setOpenAlertDialog(true);
  };
  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
    setSelectedDeleteHocPhan([]);
  };
  

  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={open}
      onClose={handleClose}
      TransitionProps={{
        onExited: () => setNganh(null), // Đặt lại giá trị khi Dialog đóng hoàn toàn
      }}
    >
      <DialogTitle fontSize={"18px"} fontWeight={"bold"}>
        Danh sách học phần thuộc ngành:  
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
              <div style={styles.tfSearch}>
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
                      <Fragment>
                        <IconButton aria-label="more actions">
                          <SearchIcon sx={{ color: "#888" }} />
                        </IconButton>
                      </Fragment>
                    ),
                  }}
                  value={searchQuery} // Liên kết giá trị tìm kiếm với state
                  onChange={handleSearchChange} // Gọi hàm xử lý khi thay đổi
                />
              </Box>
              </div>
              <div style={styles.btnDelete}>
                  <Button sx={{width:"100%"}} variant="outlined" color="error" startIcon={<DeleteIcon/>} onClick={()=>{handleOpenAlertDialog()}} disabled={selectedDeleteHocPhan.length===0}>Xóa học phần</Button>
                  <Dialog 
                    open={openAlertDialog} 
                    onClose={handleCloseAlertDialog} 
                    aria-labelledby="alert-dialog-title" 
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Bạn có chắc chắn muốn xóa học phần đã chọn khỏi ngành không?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={()=>{handleCloseAlertDialog()}}>Hủy</Button>
                      <Button variant="contained"  onClick={()=>{handleDeleteHocPhan()}}>Xóa</Button>

                    </DialogActions>
                  </Dialog>
              </div>
              <div style={styles.btnAdd}>
                <Button sx={{width:"100%"}} variant="contained" endIcon={<AddIcon/>} onClick={openDialogAdd}>Thêm học phần</Button>
                <Dialog fullWidth maxWidth={"md"} open={openAddDialog} onClose={handleCloseDialogAdd} 
                
                >
                  <DialogTitle>Thêm học phần vào ngành</DialogTitle>
                  <DialogContent>
                    <TableContainer component={Paper} sx={{ maxHeight: "350px", overflowY: "auto" }}>
                      <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#0071A6" }}>
                          <TableRow>
                            <StyledTableCell align="center" width={"60pxpx"}> {/* Giảm padding ở đây */}
                            <Checkbox
                              sx={{ color: "#fff", padding: "5px" }} // Reduced padding of checkbox
                              indeterminate={selectedHocPhans.length > 0 && selectedHocPhans.length < hocPhanChuaChon.length}
                              checked={selectedHocPhans.length === hocPhanChuaChon.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedHocPhans(hocPhanChuaChon.map((row) => row.id)); // Select all
                                } else {
                                  setSelectedHocPhans([]); // Deselect all
                                }
                              }}
                            />

                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: "6px 8px" }}width={"50px"}>STT</StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: "6px 8px" }}>Mã học phần</StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: "6px 8px" }}>Tên học phần</StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: "6px 8px" }}>Số tín chỉ</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(hocPhanChuaChon && Array.isArray(hocPhanChuaChon) && hocPhanChuaChon.length > 0) ? (
                            hocPhanChuaChon.map((row, index) => (
                              <StyledTableRow key={row.id} sx={{ height: "30px" }}>
                                <StyledTableCell align="center" sx={{ padding: "4px 8px" }}>
                                  <Checkbox
                                    checked={selectedHocPhans.includes(row.id)}  // Using row.id here
                                    onChange={() => handleSelectHocPhan(row.id)} // Pass row.id to handle selection
                                  />
                                </StyledTableCell>
                                <StyledTableCell align="center" width={50} sx={{ padding: "4px 8px" }}>
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="center" width={150} sx={{ padding: "4px 8px" }}>
                                  {row.maHocPhan}  {/* If you want to keep showing 'maHocPhan', leave it as is */}
                                </StyledTableCell>
                                <StyledTableCell align="left" sx={{ padding: "4px 8px" }}>
                                  {row.ten}
                                </StyledTableCell>
                                <StyledTableCell align="center" sx={{ padding: "4px 8px" }}>
                                  {row.soTinChi}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                Không có học phần nào để hiển thị
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
                      <Button variant="contained" color="primary" onClick={()=>{handleSubmitAddHocPhan()}} disabled={hocPhanChuaChon.length === 0}>Thêm</Button>
                    </DialogActions>
                </Dialog>
              </div>
              
            </div>
            <div style={styles.mainContent}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: "#0071A6" }}>
                    <TableRow>
                      <StyledTableCell align="center">
                        <Checkbox
                          sx={{ color: "#fff" }}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Chọn tất cả học phần
                              setSelectedDeleteHocPhan(hocPhanDaChon.map((row) => row.id));
                            } else {
                              // Bỏ chọn tất cả
                              setSelectedDeleteHocPhan([]);
                            }
                          }}
                          checked={selectedDeleteHocPhan.length === hocPhanDaChon.length}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">STT</StyledTableCell>
                      <StyledTableCell align="center">Mã học phần</StyledTableCell>
                      <StyledTableCell align="center">Tên học phần</StyledTableCell>
                      <StyledTableCell align="center">Thuộc khoa</StyledTableCell>
                      <StyledTableCell align="center">Số tín chỉ</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <StyledTableCell colSpan={6} align="center">
                          Chưa có học phần được thêm vào ngành
                        </StyledTableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row, index) => (
                        <StyledTableRow key={row.id || index}>
                          <StyledTableCell align="center">
                            <Checkbox
                              checked={selectedDeleteHocPhan.includes(row.id)}
                              onChange={() => handleSelect(row.id)}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center" width={50}>{index + 1}</StyledTableCell>
                          <StyledTableCell align="center" width={150}>{row.maHocPhan}</StyledTableCell>
                          <StyledTableCell align="left">{row.ten}</StyledTableCell>
                          <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
                          <StyledTableCell align="center" width={200}>{row.soTinChi}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>



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

export default DialogHocPhan;
