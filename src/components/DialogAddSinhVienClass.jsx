import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import {
  DialogTitle,
  Typography,
  DialogContent,
  CircularProgress,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  DialogActions,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {getClassById,getStudentIdsNotInClass,addStudentsToClass} from "../api/api-classes";
// eslint-disable-next-line react/prop-types
function DialogAddSinhVienClass({ nganhId, open, onClose,onSuccess   }) {
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
      marginBottom: '15px',
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
  const [hocPhanList, setHocPhanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onlySelected, setOnlySelected] = useState(false);
  const [selectedHocPhan, setSelectedHocPhan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const pageSizeOptions = [20, 50, 100];
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  
  useEffect(() => {
    if (open && nganhId) {
      fetchData();
    }
  }, [open, nganhId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [nganhData, hocPhans] = await Promise.all([
        getClassById(nganhId),
        getStudentIdsNotInClass(nganhId),
      ]);
      console.log("Ngành data:", nganhData);
      console.log("Học phần data:", hocPhans);
      setNganh(nganhData);
      setHocPhanList(hocPhans);
    } catch (error) {
      console.error("Lỗi khi load dữ liệu học phần/ngành:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setNganh(null);
    setHocPhanList([]);
    setSelectedHocPhan([]);
    setSearchTerm("");
    setOnlySelected(false);
    setPage(1);
  };

  const handleToggle = (id) => {
    setSelectedHocPhan((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Lọc theo searchTerm và onlySelected
  const filteredData = hocPhanList.filter((item) => {
    const matchSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSelected = !onlySelected || selectedHocPhan.includes(item.id);
    return matchSearch && matchSelected;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startRow = (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalItems);
  const paginatedData = filteredData.slice(startRow - 1, endRow);

  // Phân trang: Tính toán các trang hiển thị
  let pagesToShow = [];
  if (totalPages <= 4) {
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (page <= 3) {
      pagesToShow = [1, 2, 3, "more", totalPages];
    } else if (page >= totalPages - 2) {
      pagesToShow = [1, "more", totalPages - 2, totalPages - 1, totalPages];
    } else {
      pagesToShow = [1, "more", page - 1, page, page + 1, "more", totalPages];
    }
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0071A6",
      color: theme.palette.common.white,
      borderRight: "1px solid #ddd",
      padding: "4px 8px",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: "4px 8px",
      borderRight: "1px solid #ddd",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: "#D3F3FF",
      cursor: "pointer",
    },
    height: "25px",
  }));

  const handleSave = async () => {
    if (!selectedHocPhan.length) {
      setSnackbarMessage("Vui lòng chọn ít nhất một sinh viên để thêm.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoading(true);
      const res = await addStudentsToClass(nganhId, selectedHocPhan);
      if (res.status === 201) {
        onSuccess?.("Thêm sinh viên thành công"); // ✅ Gọi callback
        onClose(); // Đóng dialog
      } else {
        setSnackbarMessage("Thêm sinh viên thất bại.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setSnackbarMessage("Thêm sinh viên thất bại.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  

  
  

  return (
    <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
      <DialogTitle fontSize={"18px"} fontWeight={"bold"}>
        Thêm sinh viên vào lớp học phần:
        <Typography component="span" color="info.main" fontWeight="bold">
          {nganh ? ` ${nganh.data.name}` : " Đang tải..."}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  label="Tìm kiếm theo tên sinh viên"
                  placeholder="Nhập tên hoặc mã học phần..."
                  size="small"
                  sx={{ width: 250 }}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={onlySelected}
                      onChange={(e) => {
                        setOnlySelected(e.target.checked);
                        setPage(1);
                      }}
                      size="small"
                    />
                  }
                  label="Chỉ hiện sinh viên đã chọn"
                  sx={{ m: 0 }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
               
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  sx={{ height: 40 }}
                  onClick={handleSave}
                  disabled={loading || selectedHocPhan.length === 0}
                >
                  Lưu
                </Button>
              </Box>

            </Box>

            <Box sx={{ height: 400, display: "flex", flexDirection: "column" }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
  <TableContainer component={Paper} sx={{ flex: 1, overflowY: "auto" }}>
    <Table stickyHeader sx={{ minWidth: 400 }}>
      <TableHead>
        <TableRow>
          <StyledTableCell align="center">STT</StyledTableCell>
          <StyledTableCell align="center">Mã sinh viên</StyledTableCell>
          <StyledTableCell align="center">Tên sinh viên</StyledTableCell>
          <StyledTableCell align="center">Thuộc CTĐT</StyledTableCell>
          <StyledTableCell align="center">Chọn</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} align="center">
              Không có học phần nào.
            </TableCell>
          </TableRow>
        ) : (
          paginatedData.map((row, index) => (
            <StyledTableRow key={row.id}>
             
              <StyledTableCell align="center">{startRow + index}</StyledTableCell>
              <StyledTableCell align="center">{row.code}</StyledTableCell>
              <StyledTableCell align="left">{row.name}</StyledTableCell>
              <StyledTableCell align="center">{row.programmeName}</StyledTableCell>
              <StyledTableCell align="center">
                <Checkbox
                  size="small"
                  checked={selectedHocPhan.includes(row.id)}
                  onChange={() => handleToggle(row.id)}
                />
              </StyledTableCell>
            </StyledTableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Box>


              {/* Pagination */}
              <Box
                mt={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"

              >
                {/* Pagination Buttons */}
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
                      <Box
                        key={`more-${idx}`}
                        sx={{ ...styles.squareStyle, pointerEvents: "none" }}
                      >
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

                {/* Page Size + Info */}
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
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Đóng
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
export default DialogAddSinhVienClass;
