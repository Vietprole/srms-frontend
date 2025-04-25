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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { useState, useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Layout from './Layout';
import {
  getLopHocPhans,
  deleteLopHocPhan,
  addLopHocPhan,
  updateLopHocPhan,
  getLopHocPhanById,
} from "@/api/api-lophocphan";
import { getAllHocPhans } from "@/api/api-hocphan";
import { getAllHocKys } from "@/api/api-hocky";
import { getAllGiangViens } from "@/api/api-giangvien";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { 
  Checkbox,
  Grid,
  Typography,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { 
  getSinhViensByLopHocPhanId, 
  getSinhViensNotInLopHocPhanId,
  addSinhViensToLopHocPhan,
  removeSinhVienFromLopHocPhan 
} from "@/api/api-lophocphan";
import VirtualizedAutocomplete from '../components/VirtualizedAutocomplete';
const styles = {
  main: {
    width: '100%',
    height: '91vh',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    padding: "10px",
  },
  title: {
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
  btnMore: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },
  tbActions: {
    width: '100%',
    height: '6%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ipSearch: {
    width: '25%',
    height: '100%',
    justifyContent: 'flex-start',
    borderRadius: '5px',
  },
  btnCreate: {
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
  table: {
    width: '100%',
    height: '98%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '10px',
    overflowY: 'auto',
  },
  filters: {
    width: '22%',
    height: '80%',
    marginLeft: '10px',
    marginBottom: '10px',
  },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0071A6",
    color: theme.palette.common.white,
    borderRight: '1px solid #ddd',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '5px 10px',
    borderRight: '1px solid #ddd',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: "#D3F3FF",
    cursor: 'pointer',
  },
}));

export default function LopHocPhanPage() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedLopHocPhanId, setSelectedLopHocPhanId] = useState(null);

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  
  const [hocPhanItems, setHocPhanItems] = useState([]);
  const [hocKyItems, setHocKyItems] = useState([]);
  const [selectedHocPhan, setSelectedHocPhan] = useState(null);
  const [selectedHocKy, setSelectedHocKy] = useState(null);

  // Add new states for form fields
  const [tenLopHocPhan, setTenLopHocPhan] = useState("");
  const [selectedHocPhanAdd, setSelectedHocPhanAdd] = useState(null);
  const [selectedHocKyAdd, setSelectedHocKyAdd] = useState(null);
  const [selectedGiangVien, setSelectedGiangVien] = useState(null);
  const [khoa, setKhoa] = useState("");
  const [nhom, setNhom] = useState("");
  
  // Add error states
  const [errorTenLopHocPhan, setErrorTenLopHocPhan] = useState(false);
  const [errorKhoa, setErrorKhoa] = useState(false);
  const [errorNhom, setErrorNhom] = useState(false);

  const [comboBoxGiangViens, setComboBoxGiangViens] = useState([]);

  // Thêm states cho form chỉnh sửa
  const [editTenLopHocPhan, setEditTenLopHocPhan] = useState("");
  const [editSelectedGiangVien, setEditSelectedGiangVien] = useState(null);
  const [errorEditTenLopHocPhan, setErrorEditTenLopHocPhan] = useState(false);

  // Thêm vào phần khai báo states
  const [openSinhVienDialog, setOpenSinhVienDialog] = useState(false);

  // Thêm states cho quản lý sinh viên
  const [dsSinhVien, setDSSinhVien] = useState([]); // Sinh viên chưa thêm
  const [dsSinhVienDaChon, setDSSinhVienDaChon] = useState([]); // Sinh viên đã thêm
  const [selectedSinhViens, setSelectedSinhViens] = useState([]); // Sinh viên được chọn để thêm
  const [selectedSinhViensDaChon, setSelectedSinhViensDaChon] = useState([]); // Sinh viên được chọn để xóa
  const [searchSinhVien, setSearchSinhVien] = useState(""); // Tìm kiếm sinh viên chưa thêm
  const [searchSinhVienDaChon, setSearchSinhVienDaChon] = useState(""); // Tìm kiếm sinh viên đã thêm

  // Thêm state loading
  const [isLoading, setIsLoading] = useState(false);

  // Thêm states loading cho tạo mới và chỉnh sửa
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  // Thêm state để lưu thông tin lớp học phần
  const [selectedLopHocPhan, setSelectedLopHocPhan] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lopHocPhanData, hocPhanData, hocKyData, giangVienData] = await Promise.all([
        getLopHocPhans(null, null, null, null),
        getAllHocPhans(),
        getAllHocKys(),
        getAllGiangViens()
      ]);

      setData(lopHocPhanData);
      setFilteredData(lopHocPhanData);
      
      setHocPhanItems(hocPhanData.map(hp => ({ 
        label: hp.ten, 
        value: hp.id 
      })));
      
      setHocKyItems(hocKyData.map(hk => ({ 
        label: hk.tenHienThi, 
        value: hk.id 
      })));

      setComboBoxGiangViens(giangVienData.map(gv => ({
        label: gv.ten,
        value: gv.id
      })));

    } catch (error) {
      setSnackbarMessage("Lỗi khi tải dữ liệu");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    filterData(value);
  };

  const filterData = (query) => {
    if (!query.trim()) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) =>
        row.ten.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleHocPhanChange = async (event, newValue) => {
    setSelectedHocPhan(newValue);
    if (newValue || selectedHocKy) {
      const filtered = await getLopHocPhans(
        newValue?.value || null,
        selectedHocKy?.value || null,
        null,
        null
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleHocKyChange = async (event, newValue) => {
    setSelectedHocKy(newValue);
    if (newValue || selectedHocPhan) {
      const filtered = await getLopHocPhans(
        selectedHocPhan?.value || null,
        newValue?.value || null,
        null,
        null
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleOpenDeleteDialog = (lopHocPhanId) => {
    setSelectedLopHocPhanId(lopHocPhanId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedLopHocPhanId(null);
  };

  const handleDeleteLopHocPhan = async () => {
    try {
      await deleteLopHocPhan(selectedLopHocPhanId);
      setSnackbarMessage("Xóa lớp học phần thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      fetchData();
    } catch (error) {
      setSnackbarMessage("Xóa lớp học phần thất bại");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Add validation function
  const validateForm = () => {
    let isValid = true;

    if (tenLopHocPhan.trim() === "") {
      setErrorTenLopHocPhan(true);
      setSnackbarMessage("Vui lòng nhập tên lớp học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      isValid = false;
    }

    if (!selectedHocPhanAdd) {
      setSnackbarMessage("Vui lòng chọn học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      isValid = false;
    }

    if (!selectedHocKyAdd) {
      setSnackbarMessage("Vui lòng chọn học kỳ");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      isValid = false;
    }

    if (!selectedGiangVien) {
      setSnackbarMessage("Vui lòng chọn giảng viên");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      isValid = false;
    }

    if (khoa.trim() === "") {
      setErrorKhoa(true);
      setSnackbarMessage("Vui lòng nhập khóa");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      isValid = false;
    }

    if (nhom.trim() === "") {
      setErrorNhom(true);
      setSnackbarMessage("Vui lòng nhập nhóm");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      isValid = false;
    }

    return isValid;
  };

  // Add submit handler
  const handleAddSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const lopHocPhanData = {
      ten: tenLopHocPhan,
      hocPhanId: selectedHocPhanAdd.value,
      hocKyId: selectedHocKyAdd.value,
      giangVienId: selectedGiangVien.value,
      khoa: khoa,
      nhom: nhom,
      hanDeXuatCongThucDiem: new Date()
    };

    try {
      setIsLoadingAdd(true); // Bắt đầu loading
      await addLopHocPhan(lopHocPhanData);
      setSnackbarMessage("Thêm lớp học phần thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseAddDialog();
      fetchData();
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingAdd(false); // Kết thúc loading
    }
  };

  // Add close dialog handler
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setTenLopHocPhan("");
    setSelectedHocPhanAdd(null);
    setSelectedHocKyAdd(null);
    setSelectedGiangVien(null);
    setKhoa("");
    setNhom("");
    setErrorTenLopHocPhan(false);
    setErrorKhoa(false);
    setErrorNhom(false);
  };

  // Thêm hàm xử lý mở dialog chỉnh sửa
  const handleOpenEditDialog = async (lopHocPhanId) => {
    try {
      const lopHocPhan = await getLopHocPhanById(lopHocPhanId);
      setSelectedLopHocPhanId(lopHocPhanId);
      setEditTenLopHocPhan(lopHocPhan.ten);
      setEditSelectedGiangVien(comboBoxGiangViens.find(gv => gv.value === lopHocPhan.giangVienId));
      setOpenEditDialog(true);
    } catch (error) {
      setSnackbarMessage("Lỗi khi lấy thông tin lớp học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Thêm hàm đóng dialog chỉnh sửa
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditTenLopHocPhan("");
    setEditSelectedGiangVien(null);
    setErrorEditTenLopHocPhan(false);
    setSelectedLopHocPhanId(null);
  };

  // Thêm hàm validate form chỉnh sửa
  const validateEditForm = () => {
    let isValid = true;

    if (editTenLopHocPhan.trim() === "") {
      setErrorEditTenLopHocPhan(true);
      setSnackbarMessage("Vui lòng nhập tên lớp học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      isValid = false;
    }

    if (!editSelectedGiangVien) {
      setSnackbarMessage("Vui lòng chọn giảng viên");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      isValid = false;
    }

    return isValid;
  };

  // Thêm hàm xử lý submit form chỉnh sửa
  const handleEditSubmit = async () => {
    if (!validateEditForm()) {
      return;
    }

    const lopHocPhanData = {
      ten: editTenLopHocPhan,
      giangVienId: editSelectedGiangVien.value
    };

    try {
      setIsLoadingEdit(true); // Bắt đầu loading
      await updateLopHocPhan(selectedLopHocPhanId, lopHocPhanData);
      setSnackbarMessage("Cập nhật lớp học phần thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseEditDialog();
      fetchData();
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingEdit(false); // Kết thúc loading
    }
  };

  // Thêm hàm load dữ liệu sinh viên
  const loadSinhVienData = async (lopHocPhanId) => {
    try {
      const [sinhViens, sinhVienDaChon] = await Promise.all([
        getSinhViensNotInLopHocPhanId(lopHocPhanId),
        getSinhViensByLopHocPhanId(lopHocPhanId)
      ]);
      setDSSinhVien(sinhViens);
      setDSSinhVienDaChon(sinhVienDaChon);
    } catch (error) {
      setSnackbarMessage("Lỗi khi tải danh sách sinh viên");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Sửa lại hàm mở dialog
  const handleOpenSinhVienDialog = async (lopHocPhanId) => {
    try {
      setSelectedLopHocPhanId(lopHocPhanId);
      // Lấy thông tin lớp học phần
      const lopHocPhan = await getLopHocPhanById(lopHocPhanId);
      setSelectedLopHocPhan(lopHocPhan);
      setOpenSinhVienDialog(true);
      await loadSinhVienData(lopHocPhanId);
    } catch (error) {
      setSnackbarMessage("Lỗi khi tải thông tin lớp học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Sửa lại hàm xử lý thêm sinh viên
  const handleAddSinhVien = async () => {
    try {
      setIsLoading(true); // Bắt đầu loading
      await addSinhViensToLopHocPhan(selectedLopHocPhanId, selectedSinhViens);
      setSelectedSinhViens([]);
      setSelectedSinhViensDaChon([]);
      await loadSinhVienData(selectedLopHocPhanId);
      setSnackbarMessage("Thêm sinh viên thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Thêm sinh viên thất bại");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  // Sửa lại hàm xử lý xóa sinh viên
  const handleRemoveSinhVien = async () => {
    try {
      setIsLoading(true); // Bắt đầu loading
      for (const sinhVienId of selectedSinhViensDaChon) {
        await removeSinhVienFromLopHocPhan(selectedLopHocPhanId, sinhVienId);
      }
      setSelectedSinhViens([]);
      setSelectedSinhViensDaChon([]);
      await loadSinhVienData(selectedLopHocPhanId);
      setSnackbarMessage("Xóa sinh viên thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Xóa sinh viên thất bại");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  // Sửa lại hàm đóng dialog
  const handleCloseSinhVienDialog = () => {
    setOpenSinhVienDialog(false);
    setSelectedLopHocPhanId(null);
    setSelectedLopHocPhan(null); // Reset thông tin lớp học phần
    setDSSinhVien([]);
    setDSSinhVienDaChon([]);
    setSelectedSinhViens([]);
    setSelectedSinhViensDaChon([]);
    setSearchSinhVien("");
    setSearchSinhVienDaChon("");
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
            <Box sx={{
              display: "flex",
              alignItems: "center",
              border: "2px solid #ccc",
              borderRadius: "20px",
              padding: "4px 8px",
              width: "100%",
              maxWidth: "100%",
              "&:focus-within": {
                border: "2px solid #337AB7",
              },
              height: "100%",
            }}>
              <TextField
                fullWidth
                fontSize="10px"
                placeholder="Tìm kiếm theo tên lớp học phần..."
                variant="standard"
                autoComplete='off'
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
          </div>

          <div style={styles.filters}>
            <Autocomplete
              options={hocPhanItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedHocPhan}
              onChange={handleHocPhanChange}
              renderInput={(params) => (
                <TextField {...params} label="Chọn học phần" size="small" />
              )}
            />
          </div>

          <div style={styles.filters}>
            <Autocomplete
              options={hocKyItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedHocKy}
              onChange={handleHocKyChange}
              renderInput={(params) => (
                <TextField {...params} label="Chọn học kỳ" size="small" />
              )}
            />
          </div>

          <div style={styles.btnCreate}>
            <Button 
              sx={{width:"100%"}} 
              variant="contained" 
              onClick={() => setOpenAddDialog(true)}
            >
              Tạo lớp học phần
            </Button>
          </div>
        </div>

        <div style={styles.table}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead sx={{position: 'sticky', top: 0, zIndex: 1, backgroundColor: "#0071A6"}}>
                <TableRow>
                  <StyledTableCell align="center">STT</StyledTableCell>
                  <StyledTableCell align="center">Mã lớp học phần</StyledTableCell>
                  <StyledTableCell align="center">Tên lớp học phần</StyledTableCell>
                  <StyledTableCell align="center">Học phần</StyledTableCell>
                  <StyledTableCell align="center">Học kỳ</StyledTableCell>
                  <StyledTableCell align="center">Giảng viên</StyledTableCell>
                  <StyledTableCell align="center">Thao tác</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{row.maLopHocPhan}</StyledTableCell>
                    <StyledTableCell align="center">{row.ten}</StyledTableCell>
                    <StyledTableCell align="center">{row.tenHocPhan}</StyledTableCell>
                    <StyledTableCell align="center">{row.tenHocKy}</StyledTableCell>
                    <StyledTableCell align="center">{row.tenGiangVien}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Tooltip title="Sửa lớp học phần">
                        <IconButton onClick={() => handleOpenEditDialog(row.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xem danh sách sinh viên">
                        <IconButton onClick={() => handleOpenSinhVienDialog(row.id)}>
                          <FormatListBulletedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa lớp học phần">
                        <IconButton onClick={() => handleOpenDeleteDialog(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Add Dialog */}
        <Dialog 
          open={openAddDialog} 
          onClose={handleCloseAddDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Tạo lớp học phần mới</DialogTitle>
          
          {/* Thêm Backdrop loading */}
          <Backdrop
            sx={{ 
              color: '#fff', 
              zIndex: (theme) => theme.zIndex.drawer + 1,
              position: 'absolute' 
            }}
            open={isLoadingAdd}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <DialogContent>
            <DialogContentText>
              Thêm lớp học phần mới vào hệ thống
            </DialogContentText>
            
            <TextField
              autoFocus
              required
              margin="dense"
              label="Tên lớp học phần"
              fullWidth
              variant="standard"
              value={tenLopHocPhan}
              onChange={(e) => {
                setTenLopHocPhan(e.target.value);
                setErrorTenLopHocPhan(false);
              }}
              error={errorTenLopHocPhan}
              helperText={errorTenLopHocPhan ? "Vui lòng nhập tên lớp học phần" : ""}
              autoComplete="off"
            />
            <VirtualizedAutocomplete
              options={hocPhanItems}
              value={selectedHocPhanAdd}
              onChange={(e, newVal) => setSelectedHocPhanAdd(newVal)}
              getOptionLabel={(option) => ` ${option.label}`}
              label="Chọn học phần"
              noOptionsText="Không tìm thấy học phần"  // Thông báo nếu không có kết quả
            />





            <Autocomplete
              options={hocKyItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedHocKyAdd}
              onChange={(event, newValue) => setSelectedHocKyAdd(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Chọn học kỳ" variant="standard" required />
              )}
            />
<VirtualizedAutocomplete
  options={comboBoxGiangViens}
  value={selectedGiangVien}
  onChange={(e, newVal) => setSelectedGiangVien(newVal)}
  getOptionLabel={(option) => option.label || ""}
  label="Chọn giảng viên"
  noOptionsText="Không tìm thấy giảng viên"  // Thông báo nếu không có kết quả
/>


            <TextField
              required
              margin="dense"
              label="Khóa"
              variant="standard"
              value={khoa}
              onChange={(e) => {
                const value = e.target.value;
                if (/^(\d{0,2}|xx)$/.test(value)) {
                  setKhoa(value);
                  setErrorKhoa(false);
                }
              }}
              error={errorKhoa}
              helperText={errorKhoa ? "Khóa phải là số có 2 chữ số hoặc 'xx'" : ""}
              autoComplete="off"
            />

            <TextField
              required
              margin="dense"
              label="Nhóm"
              variant="standard"
              value={nhom}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,2}[A-Z]?$/.test(value)) {
                  setNhom(value);
                  setErrorNhom(false);
                }
              }}
              error={errorNhom}
              helperText={errorNhom ? "Nhóm phải có 2 chữ số đầu và có thể có 1 chữ cái viết hoa ở cuối" : ""}
              autoComplete="off"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} disabled={isLoadingAdd}>Hủy</Button>
            <Button 
              onClick={handleAddSubmit} 
              disabled={isLoadingAdd}
              startIcon={isLoadingAdd ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoadingAdd ? "Đang xử lý..." : "Lưu"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog 
          open={openEditDialog} 
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Sửa lớp học phần</DialogTitle>
          
          {/* Thêm Backdrop loading */}
          <Backdrop
            sx={{ 
              color: '#fff', 
              zIndex: (theme) => theme.zIndex.drawer + 1,
              position: 'absolute' 
            }}
            open={isLoadingEdit}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <DialogContent>
            <DialogContentText>
              Chỉnh sửa thông tin lớp học phần
            </DialogContentText>
            
            <TextField
              autoFocus
              required
              margin="dense"
              label="Tên lớp học phần"
              fullWidth
              variant="standard"
              value={editTenLopHocPhan}
              onChange={(e) => {
                setEditTenLopHocPhan(e.target.value);
                setErrorEditTenLopHocPhan(false);
              }}
              error={errorEditTenLopHocPhan}
              helperText={errorEditTenLopHocPhan ? "Vui lòng nhập tên lớp học phần" : ""}
              autoComplete="off"
            />

            <Autocomplete
              options={comboBoxGiangViens}
              getOptionLabel={(option) => option.label || ""}
              value={editSelectedGiangVien}
              onChange={(event, newValue) => setEditSelectedGiangVien(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Chọn giảng viên" variant="standard" required />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} disabled={isLoadingEdit}>Hủy</Button>
            <Button 
              onClick={handleEditSubmit} 
              disabled={isLoadingEdit}
              startIcon={isLoadingEdit ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoadingEdit ? "Đang xử lý..." : "Lưu"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Xóa Lớp Học Phần</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa lớp học phần này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
            <Button onClick={handleDeleteLopHocPhan}>Xóa</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Quản lý sinh viên */}
        <Dialog
          open={openSinhVienDialog}
          onClose={handleCloseSinhVienDialog}
          maxWidth="xl"
          fullWidth
        >
          <DialogTitle sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                Danh sách sinh viên thuộc lớp học phần
              </Typography>
              {selectedLopHocPhan && (
                <Box sx={{ display: 'flex', gap: 4, color: 'text.secondary', fontSize: '0.875rem' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography>Mã lớp học phần:</Typography>
                    <Typography sx={{ color: '#0071A6', fontWeight: 'bold' }}>
                      {selectedLopHocPhan.maLopHocPhan}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography>Tên lớp học phần:</Typography>
                    <Typography sx={{ color: '#0071A6', fontWeight: 'bold' }}>
                      {selectedLopHocPhan.ten}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography>Giảng viên:</Typography>
                    <Typography sx={{ color: '#0071A6', fontWeight: 'bold' }}>
                      {selectedLopHocPhan.tenGiangVien}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </DialogTitle>
          
          <Backdrop
            sx={{ 
              color: '#fff', 
              zIndex: (theme) => theme.zIndex.drawer + 1,
              position: 'absolute' 
            }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <DialogContent>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '70vh'
            }}>
              {/* Search and Actions Bar */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                gap: 2
              }}>
                {/* Search Box */}
                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid #ccc",
                  borderRadius: "20px",
                  padding: "4px 8px",
                  width: "25%",
                  "&:focus-within": {
                    border: "2px solid #337AB7",
                  },
                }}>
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm theo tên sinh viên..."
                    variant="standard"
                    autoComplete='off'
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <IconButton aria-label="search">
                          <SearchIcon sx={{ color: "#888" }} />
                        </IconButton>
                      ),
                    }}
                    value={searchSinhVien}
                    onChange={(e) => setSearchSinhVien(e.target.value)}
                  />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveSinhVien}
                    disabled={selectedSinhViensDaChon.length === 0 || isLoading}
                    sx={{ bgcolor: '#f44336' }}
                  >
                    {isLoading ? "Đang xử lý..." : "XÓA SINH VIÊN"}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<span>+</span>}
                    onClick={handleAddSinhVien}
                    disabled={selectedSinhViens.length === 0 || isLoading}
                    sx={{ bgcolor: '#1976d2' }}
                  >
                    {isLoading ? "Đang xử lý..." : "THÊM SINH VIÊN"}
                  </Button>
                  <Button
                    variant="contained"
                    color="default"
                    onClick={handleCloseSinhVienDialog}
                    sx={{ bgcolor: '#9e9e9e', color: 'white' }}
                  >
                    ĐÓNG
                  </Button>
                </Box>
              </Box>

              {/* Main Table */}
              <TableContainer component={Paper} sx={{ height: '100%', overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" sx={{ bgcolor: '#0071A6', color: 'white' }}>
                        <Checkbox
                          indeterminate={false}
                          checked={
                            searchSinhVien.trim() === "" ? 
                              (dsSinhVien.length > 0 && selectedSinhViens.length === dsSinhVien.length) ||
                              (dsSinhVienDaChon.length > 0 && selectedSinhViensDaChon.length === dsSinhVienDaChon.length)
                              :
                              (dsSinhVien.filter(sv => sv.ten.toLowerCase().includes(searchSinhVien.toLowerCase())).length > 0 &&
                                selectedSinhViens.length === dsSinhVien.filter(sv => sv.ten.toLowerCase().includes(searchSinhVien.toLowerCase())).length) ||
                              (dsSinhVienDaChon.filter(sv => sv.ten.toLowerCase().includes(searchSinhVien.toLowerCase())).length > 0 &&
                                selectedSinhViensDaChon.length === dsSinhVienDaChon.filter(sv => sv.ten.toLowerCase().includes(searchSinhVien.toLowerCase())).length)
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const filteredSinhVien = dsSinhVien.filter(sv => 
                                sv.ten.toLowerCase().includes(searchSinhVien.toLowerCase())
                              );
                              const filteredSinhVienDaChon = dsSinhVienDaChon.filter(sv => 
                                sv.ten.toLowerCase().includes(searchSinhVien.toLowerCase())
                              );
                              
                              setSelectedSinhViens(filteredSinhVien.map(sv => sv.id));
                              setSelectedSinhViensDaChon(filteredSinhVienDaChon.map(sv => sv.id));
                            } else {
                              setSelectedSinhViens([]);
                              setSelectedSinhViensDaChon([]);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ bgcolor: '#0071A6', color: 'white', fontWeight: 'bold' }}>STT</TableCell>
                      <TableCell sx={{ bgcolor: '#0071A6', color: 'white', fontWeight: 'bold' }}>Mã sinh viên</TableCell>
                      <TableCell sx={{ bgcolor: '#0071A6', color: 'white', fontWeight: 'bold' }}>Tên sinh viên</TableCell>
                      <TableCell sx={{ bgcolor: '#0071A6', color: 'white', fontWeight: 'bold' }}>Lớp</TableCell>
                      <TableCell sx={{ bgcolor: '#0071A6', color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dsSinhVienDaChon
                      .filter(sv => sv.ten.toLowerCase().includes(searchSinhVien.toLowerCase()))
                      .map((sv, index) => (
                        <TableRow 
                          key={sv.id}
                          hover
                          sx={{
                            '&:nth-of-type(odd)': {
                              backgroundColor: '#f5f5f5',
                            },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={false}
                              checked={selectedSinhViensDaChon.includes(sv.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSinhViensDaChon([...selectedSinhViensDaChon, sv.id]);
                                } else {
                                  setSelectedSinhViensDaChon(selectedSinhViensDaChon.filter(id => id !== sv.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{sv.maSinhVien}</TableCell>
                          <TableCell>{sv.ten}</TableCell>
                          <TableCell>{sv.lop || "N/A"}</TableCell>
                          <TableCell>Đã thêm</TableCell>
                        </TableRow>
                    ))}
                    {dsSinhVien
                      .filter(sv => sv.ten.toLowerCase().includes(searchSinhVien.toLowerCase()))
                      .map((sv, index) => (
                        <TableRow 
                          key={sv.id}
                          hover
                          sx={{
                            '&:nth-of-type(odd)': {
                              backgroundColor: '#f5f5f5',
                            },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={false}
                              checked={selectedSinhViens.includes(sv.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSinhViens([...selectedSinhViens, sv.id]);
                                } else {
                                  setSelectedSinhViens(selectedSinhViens.filter(id => id !== sv.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{dsSinhVienDaChon.length + index + 1}</TableCell>
                          <TableCell>{sv.maSinhVien}</TableCell>
                          <TableCell>{sv.ten}</TableCell>
                          <TableCell>{sv.lop || "N/A"}</TableCell>
                          <TableCell>Chưa thêm</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </DialogContent>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MuiAlert
            variant='filled'
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </Layout>
  );
}
