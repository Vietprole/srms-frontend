import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { getNganhById } from "@/api/api-nganh";
import Typography  from "@mui/material/Typography";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
import Checkbox from "@mui/material/Checkbox";
import {
  getPLOsByNganhId,
} from "@/api/api-plo";
import SaveIcon from '@mui/icons-material/Save';
import {getNganhsByKhoaId} from "@/api/api-nganh";
import {
  addPLO,
} from "@/api/api-plo";
// eslint-disable-next-line react/prop-types
function DialogPLO({ nganhId, open, onClose ,onAddSuccess}) {
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
      justifyContent: "space-between",
      paddingTop: "10px",
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
  const [filteredData, setFilteredData] = useState(""); // Lưu dữ liệu đã lọc
  const [khoas, setKhoas] = useState([]);
  const [selectedNganh, setSelectedNganh] = useState(null); // Lưu ctđt đã chọn
  const [selectedPLOIds, setSelectedPLOIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // tùy chọn mặc định
  const pageSizeOptions = [20,50,100]; // tuỳ bạn thêm số lựa chọn
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

  const fetchData = async (overrideNganhId = null) => {
    try {
      const nganhs = await getNganhById(nganhId);
      const khoas = await getNganhsByKhoaId(nganhs.khoaId);
      const khoasKhac = khoas.filter((nganh) => nganh.id !== nganhId);
      setKhoas(khoasKhac);
  
      const targetId = overrideNganhId || selectedNganh?.id || nganhs.id;
      const data = await getPLOsByNganhId(targetId);
      setNganh(nganhs);
      setFilteredData(data);
      setSelectedPLOIds(data.map((plo) => plo.id)); // ✅ Reset và auto check all
      setPage(1);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ctđt:", error);
      setFilteredData([]);
      setSelectedPLOIds([]);
    }
  };
  
  
  

  const handleClose = () => {
    setNganh(null); // Reset nganh khi đóng
    setSelectedNganh(null); // Reset selectedNganh khi đóng
    setSelectedPLOIds([]); // Reset selectedPLOIds khi đóng
    setPage(1); // Reset page về 1 khi đóng
    onClose();
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
  const handleSaveSelectedPLOs = async () => {
    if (!selectedNganh || selectedPLOIds.length === 0) {
      setSnackbarMessage("Vui lòng chọn ctđt và ít nhất một PLO để lưu.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const plo of filteredData) {
      if (!selectedPLOIds.includes(plo.id)) continue;
  
      const ploData = {
        ten: plo.ten,
        moTa: plo.moTa,
        nganhId: nganhId, // ✅ vẫn đúng
      };
  
      try {
        const rp = await addPLO(ploData);
        if (rp.status === 201) {
          successCount++;
        } else {
          failCount++;
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        failCount++;
      }
    }
  
    if (successCount > 0) {
      setSnackbarMessage(`Đã thêm ${successCount} PLO thành công`);
      setSnackbarSeverity("success");
  
      if (typeof onAddSuccess === "function") {
        onAddSuccess(); // ✅ gọi fetchData ở cha
      }
    }
  
    if (failCount > 0) {
      setSnackbarMessage(`${failCount} PLO thêm thất bại`);
      setSnackbarSeverity("error");
    }
  
    setOpenSnackbar(true);
    onClose(); // ✅ đóng dialog
  };
  
  
  


  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={handleClose}
      TransitionProps={{
        onExited: () => setNganh(null), // Đặt lại giá trị khi Dialog đóng hoàn toàn
      }}
    >
      <DialogTitle fontSize={"18px"} fontWeight={"bold"}>
        Thêm mới PLO từ ctđt:  
        <Typography component="span" color="info.main" fontWeight="bold">
        </Typography>

      </DialogTitle>
      <DialogContent>
        {nganh ? (
          <div style={styles.main}>
 <Box sx={styles.mainAction}>
  {/* Ô tìm kiếm + checkbox */}


  <Autocomplete
    disableClearable
    options={khoas}
    sx={{ width: "350px", backgroundColor: "#fff" }}
    getOptionLabel={(option) => option.ten}
    value={selectedNganh}
    onChange={(_, newValue) => {
      setSelectedNganh(newValue);
      if (newValue) fetchData(newValue.id);
    }}
    
    renderInput={(params) => (
      <TextField
        {...params}
        label="Chọn ctđt"
        variant="outlined"
        size="small"
        sx={{ width: "100%", backgroundColor: "#fff" }}
      />
    )}
  />
</Box>
            
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
            <StyledTableCell align="center">Chọn PLO</StyledTableCell>
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
                <StyledTableCell align="center" width={250}>{row.ten}</StyledTableCell>
                <StyledTableCell align="left">{row.moTa}</StyledTableCell>
                <StyledTableCell align="center" width={150}>
  <Checkbox
    checked={selectedPLOIds.includes(row.id)}
    onChange={(e) => {
      const isChecked = e.target.checked;
      setSelectedPLOIds((prev) =>
        isChecked ? [...prev, row.id] : prev.filter((id) => id !== row.id)
      );
    }}
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
        
        <Button
          variant="contained"
          sx={{ width: "180px", height: "40px" }}
          startIcon={<SaveIcon />}
          onClick={handleSaveSelectedPLOs}
        >
          Lưu PLO
        </Button>
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
