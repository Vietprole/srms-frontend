import * as React from "react";
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
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Fade } from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { getAllKhoas } from "@/api/api-khoa";
import {
  getNganhs,
  addNganh,
  getNganhById,
  updateNganh,
} from "@/api/api-nganh";

import Layout from "../Layout";
import TestDialog from "@/components/DialogHocPhan";
import { getAccountsByRole } from "@/api/api-accounts";
import { getRole, getNguoiQuanLyCTDTId } from "@/utils/storage";
import { getNganhsByNguoiQuanLyId } from "@/api/api-nganh";
import { useCallback } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import DialogPLO from "../../components/DialogPLO";
import AssignmentIcon from '@mui/icons-material/Assignment';
import DialogPLOHocPhan from "../../components/DialogMappingPLO_Cource";
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
function TestPage() {
  const styles = {
    main: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
  
    title: {
      width: '100%',
      fontSize: '1.2em',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  
    btnMore: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginLeft: 'auto',
    },
  
    tbActions: {
      width: '100%',
      marginTop: 10,
      display: 'flex',
      alignItems: 'center', // căn giữa dọc cho cả dòng
      gap: '10px',          // khoảng cách giữa các phần tử
      paddingBottom: '10px',
    },
    
  
    ipSearch: {
      width: '30%',
      height: 40,
      justifyContent: 'flex-start',
      borderRadius: '5px',
    },
  
    cbKhoa: {
      width: "22%",
      display: "flex",
      alignItems: "center",
      height: 40, // 👈 Thêm chiều cao cụ thể
      marginLeft: "10px",
    },
    
    
  
    btnCreate: {
      width: '10%',
      height: 40,
      display: 'flex',
      marginLeft: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      color: 'white',
      cursor: 'pointer',
    },
  
    table: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      width: '100%', // 👈 thêm dòng này
    },
    
  
    divPagination: {
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #eee',
      backgroundColor: '#f5f5f5',
      padding: '5px 10px',
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
  
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [openAddNganh, setOpenAddNganh] = React.useState(false);
  const [openEditNganh, setOpenEditNganh] = React.useState(false);
  const [khoas, setKhoas] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [errorTenNganh, setErrorTenNganh] = useState(false);
  const [selectedKhoa, setSelectedKhoa] = useState(null);
  const [tenNganh, setTenNganh] = useState("");
  const [maNganh, setMaNganh] = useState("");
  const [nganhId, setNganhId] = useState("");
  const inputRef = useRef("");
  const [selectedKhoaFilter, setSelectedKhoaFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [taikhoans, setTaiKhoans] = useState([]);
  const [selectedTaiKhoan, setSelectedTaiKhoan] = useState(null);
  const [openPLO, setOpenPLO] = useState(false); // Dialog PLO nếu cần sử dụng
  const [openDialogPLOHocPhan, setOpenDialogPLOHocPhan] = useState(false);

  const handleOpenPLO = (id) => {
    setNganhId(id); // Lưu id nganh để sử dụng trong Dialog PLO
    setOpenPLO(true);
  };
  const handleClosePLO = () => {

    setOpenPLO(false);
  };

  const handleOpenDialogPLOHocPhan = (id) => {
    setNganhId(id);
    setOpenDialogPLOHocPhan(true);
  }
  const handleCloseDialogPLOHocPhan = () => {
    setOpenDialogPLOHocPhan(false);
  }
  
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


  const role = getRole();
  const nguoiQuanLyCTDTId = getNguoiQuanLyCTDTId();

  const handleKhoaChange = (event, newValue) => {
    setSelectedKhoaFilter(newValue);
    setPage(1); // 👉 Reset về trang đầu tiên
  
    if (!newValue) {
      setFilteredData(data); 
    } else {
      const filtered = data.filter((row) => row.tenKhoa === newValue.ten);
      setFilteredData(filtered);
    }
  };
  

  const handleOpenDialog = (id) => {
    setNganhId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenEdit = async (id) => {
    const nganh = await getNganhById(id);
    const taikhoans = await getAccountsByRole(6); // Đợi API trả về dữ liệu
    setTaiKhoans(taikhoans);
    setTenNganh(nganh.ten);
    setMaNganh(nganh.maNganh);
    setSelectedKhoa(nganh.tenKhoa);
    inputRef.current = nganh.ten;
    setOpenEditNganh(true);
    setNganhId(id);
    setSelectedTaiKhoan(nganh.nguoiQuanLyId);
  };

  const handleAddNganhs = async () => {
    const khoas = await getAllKhoas(); // Đợi API trả về dữ liệu
    setKhoas(khoas);
    const taikhoans = await getAccountsByRole(6); // Đợi API trả về dữ liệu
    setTaiKhoans(taikhoans);
    setOpenAddNganh(true);
  };

  const handleCloseEditNganh = () => {
    setOpenEditNganh(false);
    setErrorTenNganh(false);
    setSelectedKhoa(null);
    setTenNganh("");
    setMaNganh("");
    setNganhId("");
    setTaiKhoans([]);
  };

  const handleCloseNganhs = () => {
    setOpenAddNganh(false);
    setErrorTenNganh(false);
    setSelectedKhoa(null);
    setSelectedTaiKhoan(null);
    setTaiKhoans([]);
  };
  const handleSubmit = async () => {
    if (tenNganh.trim() === "") {
      setSnackbarMessage("Tên ctđt không được để trống");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setErrorTenNganh(true);
      return;
    }
    if (selectedKhoa === null) {
      setSnackbarMessage("Vui lòng chọn khoa");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (selectedTaiKhoan === null) {
      setSnackbarMessage("Vui lòng chọn người quản lý");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const nganhData = {
      ten: tenNganh.trim(),
      khoaId: selectedKhoa.id,
      nguoiQuanLyId: selectedTaiKhoan.id,
    };

    try {
      const response = await addNganh(nganhData);
      if (response.status === 201) {
        setSnackbarMessage("Thêm ctđt thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        fetchData();
        handleCloseNganhs();
      } else if (response.status === 409) {
        setSnackbarMessage("CTĐT đã tồn tại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage("Lỗi: Không thể thêm ctđt");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.log("error: ", error);
      setSnackbarMessage("Lỗi: Không thể thêm ctđt");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  // console.log("role, nguoiQuanLyCTDTId: ", role, nguoiQuanLyCTDTId);
  const fetchData = useCallback(async () => {
    const khoa = await getAllKhoas();
    setKhoas(khoa);
    if (role === "NguoiPhuTrachCTĐT" && nguoiQuanLyCTDTId !== 0) {
      const nganhData = await getNganhsByNguoiQuanLyId(nguoiQuanLyCTDTId);
      setData(nganhData);
      return;
    }
    const nganhs = await getNganhs();
    console.log("nganhs: ", nganhs);
    setData(nganhs);
  }, [role, nguoiQuanLyCTDTId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Only set filteredData once data has been loaded
    setFilteredData(data);
  }, [data]);

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

  const handleEditSubmit = async (nganhId) => {
    if (inputRef.current.trim() === "") {
      setSnackbarMessage("Tên ctđt không được để trống");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setErrorTenNganh(true);
      return;
    }
    if (selectedTaiKhoan === null) {
      setSnackbarMessage("Vui lòng chọn người quản lý");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const nganhData = {
      ten: inputRef.current.trim(),
      nguoiQuanLyId: selectedTaiKhoan,
    };
    try {
      const response = await updateNganh(nganhId, nganhData);
      if (response.status === 200) {
        setSnackbarMessage("Sửa tên ctđt thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        fetchData();
        handleCloseEditNganh();
      } else if (response.status === 404) {
        setSnackbarMessage("CTĐT không tồn tại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage("Lỗi: Sửa tên ctđt không thành công");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.log("error: ", error);
      setSnackbarMessage("Lỗi: Không thể sửa ctđt");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(1); // 👉 Reset về trang đầu tiên khi tìm kiếm
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
  const [anchorPosition, setAnchorPosition] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleOpenPopover = (event, rowId) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setAnchorPosition({ top: rect.bottom, left: rect.left });
    setSelectedRowId(rowId);
  };
  
  const handleClosePopover = () => {
    setAnchorPosition(null);
    setSelectedRowId(null);
  };
  
  return (
    <Layout>
      <div style={styles.main}>
        <div style={styles.title}>
          <span>Danh sách chương trình đào tạo</span>
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
                placeholder="Tìm kiếm theo tên chương trình đào tạo..."
                variant="standard"
                autoComplete="off"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <React.Fragment>
                      <IconButton aria-label="more actions" size="small">
                        <SearchIcon sx={{ color: "#888" }} fontSize="small" />
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
            size="small" // 👉 Nhỏ gọn lại để align đẹp
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
            {role === "Admin" && (
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                onClick={handleAddNganhs}
              >
                Tạo ctđt
              </Button>
            )}
            <Dialog
              id="addNganh"
              fullWidth
              open={openAddNganh}
              onClose={handleCloseNganhs}
            >
              <DialogTitle>Tạo ctđt mới:</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Thêm ctđt mới vào hệ thống
                </DialogContentText>
                <TextField
                  autoFocus
                  required
                  id="tenNganh"
                  margin="dense"
                  label="Tên ctđt"
                  fullWidth
                  variant="standard"
                  onBlur={(e) => setTenNganh(e.target.value.trim())}
                  error={errorTenNganh}
                  onInput={(e) =>
                    setErrorTenNganh(e.target.value.trim() === "")
                  }
                  helperText="Vui lòng nhập tên ctđt"
                  autoComplete="off"
                />
                <Autocomplete
                  options={khoas}
                  getOptionLabel={(option) => option.ten || ""}
                  noOptionsText="Không tìm thấy khoa"
                  required
                  id="disable-clearable"
                  disableClearable
                  onChange={(event, newValue) => setSelectedKhoa(newValue)} // Cập nhật state khi chọn khoa
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn khoa"
                      variant="standard"
                    />
                  )}
                />
                <Autocomplete
                  options={taikhoans}
                  getOptionLabel={(option) => option.ten || ""}
                  noOptionsText="Không tìm thấy tài khoản"
                  required
                  id="disable-clearable"
                  disableClearable
                  sx={{ marginTop: "10px" }}
                  onChange={(event, newValue) => setSelectedTaiKhoan(newValue)} // Cập nhật state khi chọn khoa
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn người quản lý"
                      variant="standard"
                    />
                  )}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseNganhs}>Hủy</Button>
                <Button onClick={handleSubmit}>Lưu</Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
        <div style={styles.table}>
          <DialogPLO
            open={openPLO}
            onClose={handleClosePLO}
            nganhId={nganhId}
          />
          <DialogPLOHocPhan
            open={openDialogPLOHocPhan}
            onClose={handleCloseDialogPLOHocPhan}
            nganhId={nganhId}
          />
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
                  <StyledTableCell align="center">Mã CTĐT</StyledTableCell>
                  <StyledTableCell align="center">Tên CTĐT</StyledTableCell>
                  <StyledTableCell align="center">
                    Người quản lí
                  </StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflowY: "auto" }}>
  {paginatedData.map((row, index) => (
    <StyledTableRow key={row.id}>
      <StyledTableCell align="center">{(page - 1) * pageSize + index + 1}</StyledTableCell>
      <StyledTableCell align="center">{row.maNganh}</StyledTableCell>
      <StyledTableCell align="center">{row.ten}</StyledTableCell>
      <StyledTableCell align="center">{row.tenNguoiQuanLy}</StyledTableCell>
        <StyledTableCell align="center">
          <IconButton
            size="small"
            onClick={(e) => handleOpenPopover(e, row.id)}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>

          {/* Popover chỉ hiện với row đang chọn */}
          {selectedRowId === row.id && (
            <Popover
              open={Boolean(anchorPosition)}
              anchorReference="anchorPosition"
              anchorPosition={anchorPosition}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{
                sx: { p: 1.5, minWidth: 160 }
              }}
            >
              <MenuItem onClick={() => {
                handleClickOpenEdit(row.id);
                handleClosePopover();
              }}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Sửa CTĐT
              </MenuItem>

              <MenuItem onClick={() => {
                handleOpenDialog(row.id);
                handleClosePopover();
              }}>
                <FormatListBulletedIcon fontSize="small" sx={{ mr: 1 }} />
                Xem danh sách học phần
              </MenuItem>

              <MenuItem onClick={() => {
                handleOpenPLO(row.id);
                handleClosePopover();
              }}>
                <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
                Quản lý PLO
              </MenuItem>
              <MenuItem onClick={() => {
                handleOpenDialogPLOHocPhan(row.id);
                handleClosePopover();
              }}>
                <ChecklistRtlIcon fontSize="small" sx={{ mr: 1 }} />
                Nối PLO-Học phần
              </MenuItem>
            </Popover>
          )}
        </StyledTableCell>


    </StyledTableRow>
  ))}

  <TestDialog
    nganhId={nganhId}
    open={openDialog}
    onClose={handleCloseDialog}
  />
</TableBody>

            </Table>
          </TableContainer>
          <Dialog
            id="editNganh"
            fullWidth
            open={openEditNganh}
            onClose={handleCloseEditNganh}
            TransitionComponent={Fade}
          >
            <DialogTitle>Sửa ctđt:</DialogTitle>
            <DialogContent>
              <DialogContentText>Sửa thông tin ctđt</DialogContentText>
              {/* Mã ctđt: Chỉ đọc */}
              <TextField
                required
                margin="dense"
                label="Mã ctđt"
                fullWidth
                variant="standard"
                InputProps={{ readOnly: true }}
                focused={false}
                value={maNganh}
                autoComplete="off"
                helperText="Mã ctđt không thể thay đổi"
              />
              <TextField
                required
                margin="dense"
                label="Tên ctđt"
                fullWidth
                variant="standard"
                defaultValue={tenNganh}
                error={errorTenNganh}
                onChange={(e) => (inputRef.current = e.target.value)} // Lưu vào ref, không setState
                onBlur={(e) => setErrorTenNganh(e.target.value.trim() === "")}
                helperText={
                  errorTenNganh ? "Tên ctđt không được để trống" : ""
                }
                autoComplete="off"
              />
              <TextField
                required
                margin="dense"
                label="Thuộc khoa"
                fullWidth
                variant="standard"
                defaultValue={selectedKhoa}
                helperText="Không thể thay đổi khoa"
                InputProps={{ readOnly: true }}
                focused={false}
                autoComplete="off"
              />
              <Autocomplete
                options={taikhoans}
                getOptionLabel={(option) => option.ten || ""}
                noOptionsText="Không tìm thấy tài khoản"
                required
                id="disable-clearable"
                disableClearable
                value={
                  taikhoans.find((tk) => tk.id === selectedTaiKhoan) || null
                } // <- Ghim selected
                onChange={(event, newValue) =>
                  setSelectedTaiKhoan(newValue?.id || null)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn người quản lý"
                    variant="standard"
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditNganh}>Hủy</Button>
              <Button onClick={() => handleEditSubmit(nganhId)}>Lưu</Button>
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
      borderLeft: '1px solid #ccc',
      borderTopLeftRadius: '6px',
      borderBottomLeftRadius: '6px',
      opacity: page === 1 ? 0.5 : 1,
      pointerEvents: page === 1 ? 'none' : 'auto',
    }}
    onClick={() => setPage(page - 1)}
  >
    <ArrowLeftIcon fontSize="small" />
  </Box>

  {pagesToShow.map((item, idx) =>
  item === 'more' ? (
    <Box key={`more-${idx}`} sx={{ ...styles.squareStyle, pointerEvents: 'none' }}>
      <MoreHorizIcon fontSize="small" />
    </Box>
  ) : (
    <Box
      key={item}
      sx={{
        ...styles.squareStyle,
        ...(page === item
          ? { backgroundColor: '#0071A6', color: '#fff', fontWeight: 'bold' }
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
      borderTopRightRadius: '6px',
      borderBottomRightRadius: '6px',
      opacity: page >= totalPages ? 0.5 : 1,
      pointerEvents: page >= totalPages ? 'none' : 'auto',
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
    <span style={{ fontSize: 14, color: '#333' }}>
      Dòng {startRow} đến {endRow} / {totalItems}
    </span>
  </Box>
</div>
      </div>
    </Layout>
  );
}

export default TestPage;
