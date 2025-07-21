import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState,useRef } from "react";
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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Autocomplete from '@mui/material/Autocomplete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import {getProgrammeById } from "@/api/api-programmes";
import { getPLOs,createPLO,updatePLO, getPLOById, deletePLO } from "../api/api-plos";

// eslint-disable-next-line react/prop-types
function DialogPLO({ nganhId, open, onClose }) {
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
      paddingBottom: "10px",
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
  const [nganh, setNganh] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(""); // Lưu dữ liệu đã lọc
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [tenPLO, setTenPLO] = useState("");
  const [errorTenPLO, setErrorTenPLO] = useState(false);
  const [moTaPLO, setMoTaPLO] = useState("");
  const [errorMoTaPLO, setErrorMoTaPLO] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const tenPLORef = useRef("");
  const moTaPLORef = useRef("");
  const [ploID, setPloID] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPloID(null);
  };
  const handleDeleteHocPhan = async () => {
    try {
      const status = await deletePLO(ploID);
      if (status !== 204) {
        throw new Error("Xóa PLO thất bại");
      }
  
      setSnackbarMessage("Xóa PLO thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      fetchData();
    } catch (error) {
      setSnackbarMessage(error.message || "Xóa PLO thất bại");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      console.log(error);
    }
  };
  

  
  const handleOpenDeleteDialog = (idPLO) => {
    setPloID(idPLO);
    setOpenDeleteDialog(true);
  };

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // tùy chọn mặc định
  const pageSizeOptions = [20,50,100]; // tuỳ bạn thêm số lựa chọn
  const [plos, setPlos] = useState([]);



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
  }, [nganhId, open]);

  const fetchData = async () => {
    try {
      const nganhs = await getProgrammeById(nganhId);
      const data = await getPLOs({ programmeId: nganhId }); // ✅ sửa lại để dùng API mới
      setNganh(nganhs);
      setPlos(data); // dữ liệu gốc
      console.log("Dữ liệu PLO:", data);
      setFilteredData(data); // dữ liệu hiển thị
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ngành:", error);
      setSnackbarMessage(error.message || "Lỗi khi lấy dữ liệu ngành");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  
  

  const handleClose = () => {
    setSearchQuery(""); // Reset search query when closing dialog
    onClose();
  };

    
  const handleSearchChange = (event) => {
    setPage(1);
    const value = event.target.value;
    setSearchQuery(value);
    filterData(value);
  };
  const filterData = (query) => {
    let data = plos; // dùng dữ liệu gốc
  
    if (query.trim()) {
      data = data.filter((row) =>
        row.name.toLowerCase().includes(query.toLowerCase())
      );
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
    height: '30px', // Reduce row height here
  }));
  


  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleCloseDialogAdd = () => {
    setTenPLO("");
    setMoTaPLO("");
    setErrorMoTaPLO(false);
    setErrorTenPLO(false);
    setOpenAddDialog(false);
  };

  const handleAddSubmit = async () => {
    // if (tenPLO.trim() === "") {
    //   setErrorTenPLO(true);
    //   setSnackbarMessage("Vui lòng nhập tên PLO");
    //   setSnackbarSeverity("error");
    //   setOpenSnackbar(true);
    //   return;
    // }
    if (moTaPLO.trim() === "") {
      setErrorMoTaPLO(true);
      setSnackbarMessage("Vui lòng nhập mô tả cho PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const ploData = {

      description: moTaPLO,
      programmeId: nganhId,
    };
    try {
      const rp = await createPLO(ploData);
      if (rp.status === 201) {
        setSnackbarMessage("Thêm PLO thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogAdd();
        fetchData(); // Cập nhật lại dữ liệu sau khi thêm mới
      } else {
        setSnackbarMessage("Thêm PLO thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  const handleOpenAddDialog = () => {
    setTenPLO("");
    setMoTaPLO("");
    setErrorTenPLO(false);
    setErrorMoTaPLO(false);
    setOpenAddDialog(true);
  };

  const handleCloseDialogEdit = () => {
    setOpenEditDialog(false);
    setTenPLO("");
    setMoTaPLO("");
    setErrorTenPLO(false);
    setErrorMoTaPLO(false);
    tenPLORef.current = "";
    moTaPLORef.current = "";
    setPloID("");
  };

  const handleSubmitEdit = async () => {
    if (tenPLORef.current.trim() === "") {
      setErrorTenPLO(true);
      setSnackbarMessage("Vui lòng nhập tên PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (moTaPLORef.current.trim() === "") {
      setErrorMoTaPLO(true);
      setSnackbarMessage("Vui lòng nhập mô tả cho PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const ploData = {
      name: tenPLORef.current,
      description: moTaPLORef.current,
    };

    try {
      const response = await updatePLO(ploID, ploData);
      if (response.status === 200) {
        setSnackbarMessage("Cập nhật PLO thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogEdit();
        fetchData(); // Cập nhật lại dữ liệu sau khi sửa
      } else {
        setSnackbarMessage("Cập nhật PLO thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenEditDialog = async (ploID) => {
    const plo = await getPLOById(ploID);
    if (plo.status === 200) {
      setTenPLO(plo.data.name);
      setMoTaPLO(plo.data.description);
      tenPLORef.current = plo.data.name;
      moTaPLORef.current = plo.data.description;
      setPloID(ploID);
      setOpenEditDialog(true);
    } else if (plo.status === 404) {
      setSnackbarMessage("Không tìm thấy PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Lỗi không xác định");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }

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
        Danh sách các PLO thuộc CTĐT:  
        <Typography component="span" color="info.main" fontWeight="bold">
          {nganh ? ` ${nganh.name}` : " Đang tải..."}
        </Typography>

        <Box sx={{ display: "flex", gap: 10, alignItems: "center", mt: 0.5 }}>
          <DialogContentText component="span">
            Mã ngành:
            <Typography component="span" color="info.main" fontWeight="500"> {nganh ? nganh.code : "Đang tải..."} </Typography>
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
    width: "40%",
    height: "34px", // giảm chiều cao
    "&:focus-within": {
      border: "1px solid #337AB7",
    },
  }}
>

      <TextField
        fullWidth
        placeholder="Tìm kiếm theo tên PLO..."
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
  </Box>

  {/* Các nút chức năng */}




  <Button
    variant="contained"
    sx={{ width: "180px", height: "40px" }}
    startIcon={<AddIcon />}
    onClick={handleOpenAddDialog} // Mở dialog thêm PLO
  >
    Thêm PLO
  </Button>
 
</Box>
<Dialog
                id="suaPLO"
                fullWidth
                open={openEditDialog}
                onClose={handleCloseDialogEdit}
              >
                <DialogTitle>Sửa thông tin PLO:</DialogTitle>
                <DialogContent>
                  <DialogContentText>Sửa thông tin PLO</DialogContentText>
                  <TextField
                    autoFocus
                    required
                    id="suatenPLO"
                    margin="dense"
                    label="Tên PLO"
                    fullWidth
                    variant="standard"
                    defaultValue={tenPLO}
                    onChange={(e) => {
                      tenPLORef.current = e.target.value;
                      setErrorTenPLO(e.target.value.trim() === "");
                    }}
                    error={errorTenPLO}
                    helperText={errorTenPLO ? "Vui lòng nhập tên PLO" : ""}
                    autoComplete="off"
                  />
                  <TextField
                    autoFocus
                    required
                    id="suaMoTaPLO"
                    margin="dense"
                    label="Mô tả cho PLO"
                    variant="standard"
                    fullWidth
                    defaultValue={moTaPLO}
                    onChange={(e) => {
                      moTaPLORef.current = e.target.value;
                      setErrorMoTaPLO(e.target.value.trim() === "");
                    }}
                    error={errorMoTaPLO}
                    helperText={errorMoTaPLO ? "Vui lòng nhập mô tả cho PLO" : ""}
                    autoComplete="off"
                  />
                  
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialogEdit}>HỦY</Button>
                  <Button onClick={handleSubmitEdit}>LƯU</Button>
                </DialogActions>
              </Dialog>
              <Dialog
                id="themPLO"
                fullWidth
                open={openAddDialog}
                onClose={handleCloseDialogAdd}
              >
                <DialogTitle>Thêm mới PLO</DialogTitle>
                <DialogContent>
                  <DialogContentText>Nhập thông tin PLO mới</DialogContentText>
                  {/* <TextField
                    autoFocus
                    required
                    id="themTenPLO"
                    margin="dense"
                    label="Tên PLO"
                    fullWidth
                    variant="standard"
                    value={tenPLO}
                    onChange={(e) => {
                      setTenPLO(e.target.value);
                      setErrorTenPLO(e.target.value.trim() === "");
                    }}
                    error={errorTenPLO}
                    helperText={errorTenPLO ? "Vui lòng nhập tên PLO" : ""}
                    autoComplete="off"
                  /> */}
                  <TextField
                    required
                    id="themMoTaPLO"
                    margin="dense"
                    label="Mô tả cho PLO"
                    variant="standard"
                    fullWidth
                    value={moTaPLO}
                    onChange={(e) => {
                      setMoTaPLO(e.target.value);
                      setErrorMoTaPLO(e.target.value.trim() === "");
                    }}
                    error={errorMoTaPLO}
                    helperText={errorMoTaPLO ? "Vui lòng nhập mô tả cho PLO" : ""}
                    autoComplete="off"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialogAdd}>HỦY</Button>
                  <Button onClick={handleAddSubmit}>TẠO PLO</Button>
                </DialogActions>
              </Dialog>
              <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Xóa Học Phần</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Bạn có chắc chắn muốn xóa PLO này không?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                  <Button onClick={handleDeleteHocPhan} color="error">
                    Xóa
                  </Button>
                </DialogActions>
              </Dialog>


            
    <Box sx={{ height: 500, display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, overflowY: "auto" , paddingBottom: "100px"} }>


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
            <StyledTableCell align="center">STT</StyledTableCell>
            <StyledTableCell align="center">Tên PLO</StyledTableCell>
            <StyledTableCell align="center">Mô tả cho PLO</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <StyledTableCell colSpan={7} align="center">
                Chưa có PLO được thêm vào chương trình đào tạo
              </StyledTableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, index) => (
              <StyledTableRow key={row.id || index}>
                <StyledTableCell align="center" width={50}>{index + 1}</StyledTableCell>
                <StyledTableCell align="center" width={300}>{row.name}</StyledTableCell>
                <StyledTableCell align="left">{row.description}</StyledTableCell>
                <StyledTableCell align="center" width={150}>
          <Tooltip title="Sửa thông tin PLO">
            <IconButton size="small" onClick={()=> handleOpenEditDialog(row.id)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa PLO">
            <IconButton  size="small" onClick={()=>handleOpenDeleteDialog(row.id)}>
              <DeleteIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
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

export default DialogPLO;
