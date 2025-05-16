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
import SaveIcon from '@mui/icons-material/Save';
import { getHocPhansByNganhId,updateHocPhanCotLois } from "@/api/api-nganh";
import { getRole } from "@/utils/storage";
import { TableVirtuoso } from "react-virtuoso";
import { useRef } from "react";
import { useCallback } from "react";
import React from "react";
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
  const virtuosoRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

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
  const [originalData, setOriginalData] = useState([]);
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    if (open && nganhId) {
      fetchData();
    }
    const role = getRole();
    setUserRole(role);
  }, [nganhId, open]);

  const fetchData = async () => {
    try {
      const nganhs = await getNganhById(nganhId);
      const hocphans = await getHocPhansByNganhId(nganhId);
      const totalCredits = hocphans.reduce((total, hocPhan) => total + hocPhan.soTinChi, 0);
      setOriginalData(hocphans);
      setHocPhanDaChon(hocphans);
      setFilteredData(hocphans);
      setNganh(nganhs);
      setTongSoTinChi(totalCredits);
      

    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ngành:", error);
    }
  };

  const handleClose = () => {
    setSearchQuery(""); // Reset search query when closing dialog
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
    if (!hasPermission()) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Bạn không có quyền thực hiện thao tác này!");
      setOpenSnackbar(true);
      return;
    }
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
    if (!hasPermission()) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Bạn không có quyền thực hiện thao tác này!");
      setOpenSnackbar(true);
      return;
    }
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
  const handleToggleCotLoi = (hocPhanId) => {
    setFilteredData((prevData) =>
      prevData.map((hp) =>
        hp.id === hocPhanId ? { ...hp, laCotLoi: !hp.laCotLoi } : hp
      )
    );
  };
  
  const handleSaveCotLoi = async () => {
    if (!hasPermission()) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Bạn không có quyền thực hiện thao tác này!");
      setOpenSnackbar(true);
      return;
    }
    const updatedHocPhans = filteredData.map((hp) => ({
      HocPhanId: hp.id,
      LaCotLoi: hp.laCotLoi
    }));
  
    try {
      const rp=await updateHocPhanCotLois(nganhId, updatedHocPhans);
      if(rp.status===200){
        setSnackbarSeverity("success");
        setSnackbarMessage("Cập nhật học phần cốt lõi thành công!");
        setOpenSnackbar(true);
        fetchData();
      }
      else{
        setSnackbarSeverity("error");
        setSnackbarMessage("Cập nhật học phần cốt lõi thất bại!");
        setOpenSnackbar(true);
      }

      
    } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Cập nhật học phần cốt lõi thất bại!");
        setOpenSnackbar(true);
        console.log("error",error);
    }
  };
  const hasChanges = () => {
    return JSON.stringify(originalData) !== JSON.stringify(filteredData);
  };
  
  const hasPermission = () => {
    return userRole === 'Admin' || userRole === 'NguoiPhuTrachCTĐT';
  };
  
  const handleUnauthorizedAction = () => {
    setSnackbarSeverity("error");
    setSnackbarMessage("Bạn không có quyền thực hiện thao tác này!");
    setOpenSnackbar(true);
  };

  const columns = [
  { width: 60, label: "", dataKey: "select", align: "center" },
  { width: 50, label: "STT", dataKey: "index", align: "center" },
  { width: 150, label: "Mã học phần", dataKey: "maHocPhan", align: "center" },
  { width: 250, label: "Tên học phần", dataKey: "ten", align: "left" },
  { width: 100, label: "Số tín chỉ", dataKey: "soTinChi", align: "center" },
];
function fixedHeaderContent() {
  return (
    <StyledTableRow>
      {columns.map((column) => (
        <StyledTableCell
          key={column.dataKey}
          align={column.align}
          style={{ width: column.width, padding: "6px 8px", backgroundColor: "#0071A6", color: "white" }}
        >
          {column.dataKey === "select" ? (
            <Checkbox
              sx={{ color: "#fff", padding: "5px" }}
              indeterminate={
                selectedHocPhans.length > 0 &&
                selectedHocPhans.length < hocPhanChuaChon.length
              }
              checked={
                hocPhanChuaChon.length > 0 &&
                selectedHocPhans.length === hocPhanChuaChon.length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedHocPhans(hocPhanChuaChon.map((row) => row.id));
                } else {
                  setSelectedHocPhans([]);
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
          checked={selectedHocPhans.includes(row.id)}
          onChange={() => handleSelectHocPhan(row.id)}
        />
      </StyledTableCell>
      <StyledTableCell align="center">{index + 1}</StyledTableCell>
      <StyledTableCell align="center">{row.maHocPhan}</StyledTableCell>
      <StyledTableCell align="left">{row.ten}</StyledTableCell>
      <StyledTableCell align="center">{row.soTinChi}</StyledTableCell>
    </>
  );
}
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
                  <Button 
                    sx={{width:"100%"}} 
                    variant="outlined" 
                    color="error" 
                    startIcon={<DeleteIcon/>} 
                    onClick={handleOpenAlertDialog} 
                    disabled={!hasPermission() || selectedDeleteHocPhan.length === 0}
                  >
                    Xóa học phần
                  </Button>
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
                <Button 
                  sx={{width:"100%"}} 
                  variant="contained" 
                  endIcon={<AddIcon/>} 
                  onClick={openDialogAdd}
                  disabled={!hasPermission()}
                >
                  Thêm học phần
                </Button>
                <Dialog fullWidth maxWidth={"md"} open={openAddDialog} onClose={handleCloseDialogAdd} 
                
                >
                  <DialogTitle>Thêm học phần vào ngành</DialogTitle>
                  <DialogContent style={{ height: "400px", padding: 10 }}>
                  <TableVirtuoso
  ref={virtuosoRef}
  data={hocPhanChuaChon}
  components={VirtuosoTableComponents}
  fixedHeaderContent={fixedHeaderContent}
  itemContent={rowContent}
  firstItemIndex={0}
  initialTopMostItemIndex={scrollIndex}
  rangeChanged={(range) => setScrollIndex(range.startIndex)}
/>

  </DialogContent>

                    <DialogActions>
                      <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
                      <Button variant="contained" color="primary" onClick={()=>{handleSubmitAddHocPhan()}} disabled={hocPhanChuaChon.length === 0}>Thêm</Button>
                    </DialogActions>
                </Dialog>
              </div>
              <div style={styles.btnSave}>
                <Button 
                  sx={{width:"100%"}} 
                  variant="contained" 
                  startIcon={<SaveIcon/>}  
                  disabled={!hasPermission() || !hasChanges()} 
                  onClick={handleSaveCotLoi}
                >
                  Lưu
                </Button>
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
                    <StyledTableCell align="center">Là cốt lõi</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {filteredData.length === 0 ? (
    <TableRow>
      <StyledTableCell colSpan={7} align="center">
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
        <StyledTableCell align="center" width={150}>{row.soTinChi}</StyledTableCell>
        <StyledTableCell align="center" width={150}>
          <Checkbox
            checked={row.laCotLoi}
            onChange={() => handleToggleCotLoi(row.id)}
          />
        </StyledTableCell>
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
