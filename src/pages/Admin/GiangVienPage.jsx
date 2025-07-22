import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../Layout";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../api/api-teachers";
import { getAllWorkUnits } from "../../api/api-work-units";
function GiangVienPage() {
  const styles = {
    main: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: "10px",
      boxSizing: "border-box",
      overflow: "hidden",
    },

    title: {
      width: "100%",
      fontSize: "1.2em",
      fontFamily: "Roboto",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    btnMore: {
      display: "flex",
      justifyContent: "flex-end",
      marginLeft: "auto",
    },

    tbActions: {
      width: "100%",
      marginTop: 10,
      display: "flex",
      alignItems: "center", // căn giữa dọc cho cả dòng
      gap: "10px", // khoảng cách giữa các phần tử
      paddingBottom: "10px",
    },

    ipSearch: {
      width: "25%",
      height: 40,
      justifyContent: "flex-start",
      borderRadius: "5px",
    },

    cbKhoa: {
      width: "22%",
      display: "flex",
      alignItems: "center",
      height: 40, // 👈 Thêm chiều cao cụ thể
      marginLeft: "10px",
    },

    btnCreate: {
      width: "15%",
      height: 40,
      display: "flex",
      marginLeft: "auto",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "5px",
      color: "white",
      cursor: "pointer",
    },

    table: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      width: "100%", // 👈 thêm dòng này
    },

    divPagination: {
      flexShrink: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid #eee",
      backgroundColor: "#f5f5f5",
      padding: "5px 10px",
    },

    squareStyle: {
      width: 40,
      height: 35,
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      borderLeft: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      cursor: "pointer",
      boxSizing: "border-box",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: "#0071A6",
        color: "#fff",
      },
    },
    filters: {
      width: "22%",
      height: "80%",
      marginLeft: "10px",
      marginBottom: "10px",
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
  const [tenGiangVien, setTenGiangVien] = useState("");
  const [errorTenGiangVien, setErrorTenGiangVien] = useState(false);
  const [maGiangVien, setmaGiangVien] = useState("");
  const [errorMaGiangVien, setErrorMaGiangVien] = useState(false);
  const [tenKhoa, setTenKhoa] = useState("");
  const [giangVienId, setGiangVienId] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // tùy chọn mặc định
  const pageSizeOptions = [10, 20, 50]; // tuỳ bạn thêm số lựa chọn

  const totalItems = filteredData.length;
  const startRow = (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalItems);
  const totalPages = Math.ceil(totalItems / pageSize);
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

  // Lấy dữ liệu cho trang hiện tại
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const [anchorPosition, setAnchorPosition] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleOpenPopover = (event, id) => {
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setSelectedRowId(id);
  };

  const handleClosePopover = () => {
    setAnchorPosition(null);
    setSelectedRowId(null);
  };

  const handleOpenEditDialog = async (giangVienId) => {
    const giangVien = await getTeacherById(giangVienId);
    setTenGiangVien(giangVien.name);
    setTenKhoa(giangVien.workUnitName);
    setOpenEditDialog(true);
    setGiangVienId(giangVienId);
    setmaGiangVien(giangVien.code);
  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setTenGiangVien("");
    setTenKhoa("");
    setGiangVienId(null);
    setErrorTenGiangVien(false);
  };

  const handleOpenAddDialog = async () => {
    const khoas = await getAllWorkUnits();
    setKhoas(khoas);
    setOpenAddDialog(true);
  };
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedKhoa(null);
    setTenGiangVien("");
    setmaGiangVien("");
    setErrorTenGiangVien(false);
    setErrorMaGiangVien(false);
    setSelectedKhoa(null);
    setKhoas([]); // Reset khoas khi đóng dialog
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const giangvien = await getAllTeachers();
    setData(giangvien);
    setFilteredData(giangvien);
  };

  const filterData = (query) => {
    if (!query.trim()) {
      setFilteredData(data); // If search query is empty, show all data
    } else {
      const filtered = data.filter((row) =>
        row.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSearchChange = (event) => {
    setPage(1); // Reset về trang 1 khi tìm kiếm
    const value = event.target.value;
    setSearchQuery(value);
    filterData(value);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0071A6",
      color: theme.palette.common.white,
      borderRight: "1px solid #ddd", // Đường phân cách dọc
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: "5px 10px", // Thêm padding cho các hàng
      borderRight: "1px solid #ddd", // Đường phân cách dọc
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: "#D3F3FF", // Màu nền khi hover
      cursor: "pointer", // Tùy chọn: Thêm hiệu ứng con trỏ
    },
  }));

  const handleSubmitAdd = async () => {
    if (tenGiangVien.trim() === "") {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng nhập tên giảng viên");
      setOpenSnackbar(true);
      return;
    }

    if (maGiangVien.trim() === "") {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng nhập mã giảng viên");
      setOpenSnackbar(true);
      return;
    }

    if (!selectedKhoa) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng chọn khoa");
      setOpenSnackbar(true);
      return;
    }

    // ✅ Đảm bảo đúng với CreateTeacherDTO
    const newGiangVien = {
      name: tenGiangVien,
      code: maGiangVien,
      workUnitId: selectedKhoa.id,
    };

    try {
      const rp = await createTeacher(newGiangVien); // Đổi đúng tên API mới

      if (rp.status === 201) {
        setSnackbarMessage("Thêm giảng viên thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseAddDialog();
        fetchData();
      } else {
        setSnackbarMessage("Thêm giảng viên thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(
        error?.response?.data || error.message || "Đã xảy ra lỗi"
      );
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
      name: tenGiangVien,
    };
    try {
      const rp = await updateTeacher(giangVienId, data);
      if (rp.status === 200) {
        setSnackbarMessage("Cập nhật giảng viên thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseEditDialog();
        fetchData();
      } else if (rp.status === 404) {
        setSnackbarMessage("Không tìm thấy giảng viên");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } else {
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
      await deleteTeacher(giangVienId);
      setSnackbarMessage("Xóa giảng viên thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      fetchData();
    } catch (error) {
      setSnackbarMessage("Xóa giảng viên thất bại");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.log(error);
    }
  };
  return (
    <Layout>
      <div style={styles.main}>
        <div style={styles.title}>
          <span>Danh sách giảng viên</span>
          <div style={styles.btnMore}>
            <IconButton aria-label="more actions">
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2, // spacing
            width: "100%",
            mt: 1,
            mb: 2,
          }}
        >
          {/* Tìm kiếm theo tên giảng viên */}
          <Box sx={{ minWidth: 300 /* Giảm chiều ngang */ }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "2px solid #ccc",
                borderRadius: "10px",
                px: 1.2, // padding ngang
                py: 0.5, // padding dọc
                "&:focus-within": {
                  border: "2px solid #337AB7",
                },
              }}
            >
              <TextField
                fullWidth
                variant="standard"
                placeholder="Tìm kiếm theo tên giảng viên..."
                autoComplete="off"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <IconButton aria-label="search" size="small">
                      <SearchIcon
                        sx={{ color: "#888", fontSize: 20 }}
                        fontSize="small"
                      />
                    </IconButton>
                  ),
                  sx: {
                    fontSize: 15, // chỉnh font nhỏ hơn nếu muốn
                    height: "28px", // kiểm soát trực tiếp chiều cao
                  },
                }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
            <Box sx={{ minWidth: 160 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleOpenAddDialog}
              >
                Tạo giảng viên
              </Button>
            </Box>
          </Box>

          {/* Dialog thêm giảng viên */}
          <Dialog
            id="themGiangVien"
            fullWidth
            open={openAddDialog}
            onClose={handleCloseAddDialog}
          >
            <DialogTitle>Tạo giảng viên mới:</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Thêm giảng viên mới vào hệ thống
              </DialogContentText>
              <TextField
                autoFocus
                required
                id="tenGiangVien"
                margin="dense"
                label="Tên giảng viên"
                fullWidth
                variant="standard"
                onBlur={(e) => setTenGiangVien(e.target.value.trim())}
                error={errorTenGiangVien}
                onInput={(e) =>
                  setErrorTenGiangVien(e.target.value.trim() === "")
                }
                helperText="Vui lòng nhập tên giảng viên"
                autoComplete="off"
              />
              <TextField
                autoFocus
                required
                id="maGiangVien"
                margin="dense"
                label="Mã giảng viên"
                fullWidth
                variant="standard"
                onBlur={(e) => setmaGiangVien(e.target.value.trim())}
                error={errorMaGiangVien}
                onInput={(e) =>
                  setErrorMaGiangVien(e.target.value.trim() === "")
                }
                helperText="Vui lòng nhập mã giảng viên"
                autoComplete="off"
              />
              <Autocomplete
                options={khoas}
                getOptionLabel={(option) => option.name || ""}
                noOptionsText="Không tìm thấy khoa"
                required
                id="disable-clearable"
                disableClearable
                onChange={(event, newValue) => setSelectedKhoa(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Chọn khoa" variant="standard" />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddDialog}>Hủy</Button>
              <Button onClick={handleSubmitAdd}>Lưu</Button>
            </DialogActions>
          </Dialog>
        </Box>

        <div style={styles.table}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#0071A6",
                }}
              >
                <TableRow>
                  <StyledTableCell align="center">STT</StyledTableCell>
                  <StyledTableCell align="center">
                    Mã giảng viên
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Tên giảng viên
                  </StyledTableCell>
                  <StyledTableCell align="center">Tên Khoa</StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflowY: "auto" }}>
                {paginatedData.map((row, index) => (
                  <StyledTableRow key={row.maHocPhan || index}>
                    <StyledTableCell align="center" width={150}>
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center" width={100}>
                      {row.code}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center" width={450}>
                      {row.workUnitName}
                    </StyledTableCell>
                    <StyledTableCell align="center" width={150}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenPopover(e, row.id)}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>

                      {selectedRowId === row.id && (
                        <Popover
                          open={Boolean(anchorPosition)}
                          anchorReference="anchorPosition"
                          anchorPosition={anchorPosition}
                          onClose={handleClosePopover}
                          anchorOrigin={{ vertical: "top", horizontal: "left" }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          PaperProps={{ sx: { p: 1.5, minWidth: 140 } }}
                        >
                          <MenuItem
                            onClick={() => {
                              handleOpenEditDialog(row.id);
                              handleClosePopover();
                            }}
                          >
                            <EditIcon fontSize="small" sx={{ mr: 1 }} />
                            Sửa giảng viên
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleOpenDeleteDialog(row.id);
                              handleClosePopover();
                            }}
                          >
                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                            Xóa giảng viên
                          </MenuItem>
                        </Popover>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog
            id="suaGiangVien"
            fullWidth
            open={openEditDialog}
            onClose={handleCloseEditDialog}
          >
            <DialogTitle>Sửa thông tin giảng viên:</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Sửa thông tin giảng viên này
              </DialogContentText>
              <TextField
                autoFocus
                required
                id="tenGiangVien"
                margin="dense"
                label="Tên giảng viên"
                defaultValue={tenGiangVien}
                fullWidth
                variant="standard"
                onBlur={(e) => setTenGiangVien(e.target.value.trim())}
                error={errorTenGiangVien}
                onInput={(e) =>
                  setErrorTenGiangVien(e.target.value.trim() === "")
                }
                helperText="Vui lòng nhập tên giảng viên"
                autoComplete="off"
              />
              <TextField
                autoFocus
                required
                id="maGiangVien"
                margin="dense"
                label="Mã giảng viên"
                defaultValue={maGiangVien}
                fullWidth
                variant="standard"
                helperText="Không thể thay đổi mã giảng viên"
                autoComplete="off"
                focused={false}
                InputProps={{ readOnly: true }}
              />
              <TextField
                autoFocus
                required
                id="tenKhoa"
                margin="dense"
                label="Thuộc khoa"
                defaultValue={tenKhoa}
                fullWidth
                variant="standard"
                helperText="Không thể thay đổi khoa"
                autoComplete="off"
                focused={false}
                InputProps={{ readOnly: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Hủy</Button>
              <Button onClick={handleSubmitEditDialog}>Lưu</Button>
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
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MuiAlert
              variant="filled"
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
        </div>
        <div style={styles.divPagination}>
          {/* Trái: các nút số trang */}
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
                      ? {
                          backgroundColor: "#0071A6",
                          color: "#fff",
                          fontWeight: "bold",
                        }
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
                getOptionLabel={(option) => option.toString()} // ✅ Convert số sang chuỗi
                onChange={(event, newValue) => {
                  setPageSize(newValue);
                  setPage(1); // reset về trang 1
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
      </div>
    </Layout>
  );
}

export default GiangVienPage;
