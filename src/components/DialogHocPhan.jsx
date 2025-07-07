import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import Typography  from "@mui/material/Typography";
import DialogContentText from '@mui/material/DialogContentText';
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Checkbox from "@mui/material/Checkbox";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import { getRole } from "@/utils/storage";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Autocomplete from '@mui/material/Autocomplete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import DialogAddHocPhan from "./DialogAddHocPhan";
import FormControlLabel from "@mui/material/FormControlLabel";
import {getProgrammeById,getCoursesInProgramme,updateCourseIsCoreStatus,removeCoursesFromProgramme} from "@/api/api-programmes";

// eslint-disable-next-line react/prop-types
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
      width: "100%",
      height: "60px",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap", // nếu màn hình hẹp sẽ xuống dòng hợp lý
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
      flexGrow: 1,
      minWidth: "300px",
      gap: "10px",
    },
    
    btnDelete: {
      width: "18%",
      height: "100%",
      marginLeft: "auto", // Đẩy qua phải
      padding: "0 10px",
    },
    btnSave: {
      width: "10%",
      height: "100%",
      marginRight: "10px",
    },
    btnAdd: {
      width: "18%",
      height: "100%",
    },
    
    divPagination: {
      width: '100%',
      height: '100%',
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
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
  const [openAddHocPhan, setOpenAddHocPhan] = useState(false);
  const [nganh, setNganh] = useState(null);
  const [hocPhanDaChon, setHocPhanDaChon] = useState([]);
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // tùy chọn mặc định
  const pageSizeOptions = [20,50,100]; // tuỳ bạn thêm số lựa chọn
  const [onlyShowCotLoi, setOnlyShowCotLoi] = useState(false);


  const totalItems = filteredData.length;
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
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  
  useEffect(() => {
    if (open && nganhId) {
      fetchData();
    }
    const role = getRole();
    setUserRole(role);
  }, [nganhId, open]);

  const fetchData = async () => {
    try {
      const programme = await getProgrammeById(nganhId); // nganhId chính là programmeId
      console.log("programme", programme);
      const courses = await getCoursesInProgramme(nganhId); // có thể truyền { facultyId, isCore } nếu cần
      console.log("courses",courses);
      const totalCredits = courses.reduce((total, course) => total + course.credits, 0);

  
      setOriginalData(courses);
      setHocPhanDaChon(courses);
      setFilteredData(courses);
      setNganh(programme);
      setTongSoTinChi(totalCredits);
  
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chương trình đào tạo:", error);
    }
  };
  
  const handleClose = () => {
    setSearchQuery(""); // Reset search query when closing dialog
    setOnlyShowCotLoi(false); // Reset checkbox state
    setPage(1);
    onClose();
  };

    
  const handleSearchChange = (event) => {
    setPage(1);
    const value = event.target.value;
    setSearchQuery(value);
    filterData(value, onlyShowCotLoi);
  };
  

  const filterData = (query, cotLoiOnly = onlyShowCotLoi) => {
    let data = hocPhanDaChon;
  
    // Nếu có tìm kiếm
    if (query.trim()) {
      data = data.filter((row) =>
        row.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    // Nếu có tick checkbox cốt lõi
    if (cotLoiOnly) {
      data = data.filter((row) => row.isCore);
    }
    
  
    setFilteredData(data);
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
    height: '25px', // Reduce row height here
  }));
  

  const handleSelect = (id) => {
    setSelectedDeleteHocPhan((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id); // Bỏ chọn
      } else {
        return [...prevSelected, id]; // Chọn
      }
    });
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
  
    if (selectedDeleteHocPhan.length === 0) {
      setSnackbarSeverity("info");
      setSnackbarMessage("Không có học phần nào được chọn.");
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const status = await removeCoursesFromProgramme(nganhId, selectedDeleteHocPhan);

      if (status === 204) {
        setSnackbarSeverity("success");
        setSnackbarMessage(`Đã xóa ${selectedDeleteHocPhan.length} học phần khỏi ngành.`);
        setOpenSnackbar(true);
        setSelectedDeleteHocPhan([]);
        fetchData();
        setOpenAlertDialog(false);
      } else {
        setSnackbarSeverity("warning");
        setSnackbarMessage("Yêu cầu xoá trả về mã trạng thái bất thường.");
        setOpenSnackbar(true);
      }

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
    setHocPhanDaChon((prev) =>
      prev.map((hp) =>
        hp.id === hocPhanId ? { ...hp, isCore: !hp.isCore } : hp
      )
    );
  
    setFilteredData((prev) =>
      prev.map((hp) =>
        hp.id === hocPhanId ? { ...hp, isCore: !hp.isCore } : hp
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
      CourseId: hp.id,
      IsCore: hp.isCore
    }));
  
    try {
      const response = await updateCourseIsCoreStatus(nganhId, updatedHocPhans);
      if (response.status === 200) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Cập nhật học phần cốt lõi thành công!");
        setOpenSnackbar(true);
        fetchData();
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Cập nhật học phần cốt lõi thất bại!");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Cập nhật học phần cốt lõi thất bại!");
      setOpenSnackbar(true);
      console.error("Lỗi khi cập nhật học phần cốt lõi:", error);
    }
  };
  
  
  const hasChanges = () => {
    return hocPhanDaChon.some((hocPhan) => {
      const original = originalData.find((o) => o.id === hocPhan.id);
      return original && original.isCore !== hocPhan.isCore;
    });
  };
  
  
  
  const hasPermission = () => {
    return userRole === 'Admin' || userRole === 'NguoiPhuTrachCTĐT';
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
          {nganh ? ` ${nganh.name}` : " Đang tải..."}
        </Typography>

        <Box sx={{ display: "flex", gap: 10, alignItems: "center", mt: 0.5 }}>
          <DialogContentText component="span">
            Mã ngành:
            <Typography component="span" color="info.main" fontWeight="500"> {nganh ? nganh.code : "Đang tải..."} </Typography>
          </DialogContentText>
          <DialogContentText component="span">
            Tổng số tín chỉ: 
            <Typography component="span" color="info.main" fontWeight="500"> {tongSoTinChi ? tongSoTinChi : "0"} </Typography>
          </DialogContentText>
        </Box>
      </DialogTitle>
      <DialogContent>
        {nganh ? (
          <div style={styles.main}>
 <Box sx={styles.mainAction}>
  {/* Ô tìm kiếm + checkbox */}
  <Box sx={styles.tfSearch}>
  <Box
  sx={{
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc", // giảm border dày
    borderRadius: "16px",
    padding: "2px 6px", // giảm padding
    width: "50%",
    height: "34px", // giảm chiều cao
    "&:focus-within": {
      border: "1px solid #337AB7",
    },
  }}
>

      <TextField
        fullWidth
        placeholder="Tìm kiếm theo tên học phần..."
        variant="standard"
        autoComplete="off"
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <IconButton aria-label="search">
              <SearchIcon sx={{ color: "#888" }} />
            </IconButton>
          ),
        }}
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </Box>
    <FormControlLabel
      control={
        <Checkbox
          checked={onlyShowCotLoi}
          onChange={(e) => {
            setOnlyShowCotLoi(e.target.checked);
            filterData(searchQuery, e.target.checked);
          }}
        />
      }
      label="Chỉ hiện học phần cốt lõi"
      sx={{ whiteSpace: "nowrap" }}
    />
  </Box>

  {/* Các nút chức năng */}
  <Button
    sx={{ width: "180px", height: "40px" }}
    variant="outlined"
    color="error"
    startIcon={<DeleteIcon />}
    onClick={handleOpenAlertDialog}
    disabled={!hasPermission() || selectedDeleteHocPhan.length === 0}
  >
    Xóa học phần
  </Button>

  <Button
    sx={{ width: "100px", height: "40px" }}
    variant="contained"
    startIcon={<SaveIcon />}
    disabled={!hasPermission() || !hasChanges()}
    onClick={handleSaveCotLoi}
  >
    Lưu
  </Button>

  <Button
    variant="contained"
    sx={{ width: "180px", height: "40px" }}
    startIcon={<AddIcon />}
    onClick={() => setOpenAddHocPhan(true)}
  >
    Thêm học phần
  </Button>

  {/* Dialog xác nhận xóa */}
  <Dialog open={openAlertDialog} onClose={handleCloseAlertDialog}>
    <DialogTitle>Xác nhận xóa</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Bạn có chắc chắn muốn xóa học phần đã chọn khỏi ngành không?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseAlertDialog}>Hủy</Button>
      <Button variant="contained" onClick={handleDeleteHocPhan}>Xóa</Button>
    </DialogActions>
  </Dialog>

  {/* Dialog thêm học phần */}
  <DialogAddHocPhan
    nganhId={nganhId}
    open={openAddHocPhan}
    onClose={() => {
      setSearchQuery("");
      fetchData();
      setOpenAddHocPhan(false);
    }}
    onSavedSuccess={(message) => {
      setSnackbarMessage(message || "Thêm học phần thành công!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }}
  />
</Box>


            
            <Box sx={{ height: 500, display: "flex", flexDirection: "column" }}>
  <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "100px" }}>


        <TableContainer
        component={Paper}
        sx={{
          maxHeight: "100%", // hoặc chiều cao cố định của phần scroll
          overflowY: "auto",
        }}
      >

      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            backgroundColor: "#0071A6",
          }}
        >
          <TableRow>
            <StyledTableCell align="center">
              <Checkbox
               size="small"
                sx={{ color: "#fff" }}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDeleteHocPhan(hocPhanDaChon.map((row) => row.id));
                  } else {
                    setSelectedDeleteHocPhan([]);
                  }
                }}
                checked={selectedDeleteHocPhan.length === hocPhanDaChon.length}
              />
            </StyledTableCell>
            <StyledTableCell align="center">STT</StyledTableCell>
            <StyledTableCell align="center">Mã học phần</StyledTableCell>
            <StyledTableCell align="center">Tên học phần</StyledTableCell>
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
            paginatedData.map((row, index) => (
              <StyledTableRow key={row.id || index}>
                <StyledTableCell align="center"  width={50}>
                  <Checkbox
                    size="small"
                    checked={selectedDeleteHocPhan.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" width={50}>{index + 1}</StyledTableCell>
                <StyledTableCell align="center" width={150}>{row.code}</StyledTableCell>
                <StyledTableCell align="left">{row.name}</StyledTableCell>
                {/* <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell> */}
                <StyledTableCell align="center" width={150}>{row.credits  }</StyledTableCell>
                <StyledTableCell align="center" width={150}>
                  <Checkbox
                    size="small"
                    checked={row.isCore}
                    onChange={() => handleToggleCotLoi(row.id)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>


  <Box
    sx={{
      position: "sticky",
      bottom: 0,
      backgroundColor: "#f5f5f5",
      zIndex: 2,
      p: 1,
      borderTop: "1px solid #ccc",
    }}
  >
    {/* Nội dung phân trang bạn đã viết */}
    <div style={styles.divPagination}>
      {/* Trái: nút phân trang */}
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            ...styles.squareStyle,
            borderLeft: "1px solid #ccc",
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px",
            opacity: page === 1 ? 0.5 : 1,
            pointerEvents: page === 1 ? "none" : "auto",
          }}
          onClick={() => setPage(page - 1)}
        >
          <ArrowLeftIcon fontSize="small" />
        </Box>

        {pagesToShow.map((item, idx) =>
          item === "more" ? (
            <Box key={`more-${idx}`} sx={{ ...styles.squareStyle, pointerEvents: "none" }}>
              <MoreHorizIcon fontSize="small" />
            </Box>
          ) : (
            <Box
              key={item}
              sx={{
                ...styles.squareStyle,
                ...(page === item
                  ? { backgroundColor: "#0071A6", color: "#fff", fontWeight: "bold" }
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
            borderTopRightRadius: "6px",
            borderBottomRightRadius: "6px",
            opacity: page >= totalPages ? 0.5 : 1,
            pointerEvents: page >= totalPages ? "none" : "auto",
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
            getOptionLabel={(option) => option.toString()}
            onChange={(event, newValue) => {
              setPageSize(newValue);
              setPage(1);
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Box>
        <span style={{ fontSize: 14, color: "#333" }}>
          Dòng {startRow} đến {endRow} / {totalItems}
        </span>
      </Box>
    </div>
  </Box>
          </Box>

            {/*  */}
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
