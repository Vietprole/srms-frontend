import Layout from "./Layout";
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Tooltip,
  Autocomplete,
  Snackbar,
  Backdrop,
  CircularProgress
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllLopHocPhans, updateCongThucDiem } from "@/api/api-lophocphan";
import { 
  getBaiKiemTrasByLopHocPhanId, 
  getAllBaiKiemTras, 
  addBaiKiemTra, 
  deleteBaiKiemTra,
  updateBaiKiemTra 
} from "@/api/api-baikiemtra";
import VirtualizedAutocomplete from "../components/VirtualizedAutocomplete";
// Styled components
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
    marginBottom: '20px'
  },
  filters: {
    width: '22%',
    height: '80%',
    marginLeft: '10px',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    height: '98%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '10px',
    overflowY: 'auto',
  },
};

export default function CongThucDiemPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lopHocPhanIdParam = searchParams.get("lopHocPhanId");
  
  // States
  const [data, setData] = useState([]);
  const [lophocphanItems, setLopHocPhanItems] = useState([]);
  const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam);
  const [comboBoxLopHocPhanId, setComboBoxLopHocPhanId] = useState(lopHocPhanIdParam);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  // Thêm states cho form tạo mới
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newBaiKiemTra, setNewBaiKiemTra] = useState({
    loai: '',
    trongSo: 0,
    ngayMoNhapDiem: null,
    hanNhapDiem: null,
    hanDinhChinh: null,
    lopHocPhanId: null
  });
  const [formErrors, setFormErrors] = useState({
    loai: false,
    trongSo: false,
    ngayMoNhapDiem: false,
    hanNhapDiem: false,
    hanDinhChinh: false
  });

  // Thêm vào phần khai báo states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBaiKiemTraId, setSelectedBaiKiemTraId] = useState(null);

  // Thêm states cho form sửa
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editBaiKiemTra, setEditBaiKiemTra] = useState({
    id: null,
    loai: '',
    trongSo: 0,
    ngayMoNhapDiem: null,
    hanNhapDiem: null,
    hanDinhChinh: null,
    lopHocPhanId: null
  });
  const [editFormErrors, setEditFormErrors] = useState({
    loai: false,
    trongSo: false,
    ngayMoNhapDiem: false,
    hanNhapDiem: false,
    hanDinhChinh: false
  });

  const fetchData = useCallback(async () => {
    try {
    const dataLopHocPhan = await getAllLopHocPhans();
    setLopHocPhanItems(dataLopHocPhan);
      
      let baiKiemTraData = [];
    if (lopHocPhanId === null) {
        baiKiemTraData = await getAllBaiKiemTras();
    } else {
        baiKiemTraData = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
    }
      
      setData(baiKiemTraData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbarMessage("Lỗi khi tải dữ liệu");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  }, [lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setLopHocPhanId(comboBoxLopHocPhanId);
    if (comboBoxLopHocPhanId === null) {
      navigate(`/congthucdiem`);
      return;
    }
    navigate(`/congthucdiem?lopHocPhanId=${comboBoxLopHocPhanId}`);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
    const loais = data.map(item => item.loai);
    const uniqueLoais = new Set(loais);
    if (loais.length !== uniqueLoais.size) {
        setSnackbarMessage("Không được trùng loại bài kiểm tra");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      return;
    }

    let sum = 0;
      data.forEach(item => {
      sum += item.trongSo;
    });

      if (sum !== 1) {
        setSnackbarMessage("Tổng trọng số phải bằng 1");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      await updateCongThucDiem(lopHocPhanId, data);
      setSnackbarMessage("Lưu công thức điểm thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      await fetchData();
    } catch (error) {
      console.log(error);
      setSnackbarMessage("Lỗi khi lưu công thức điểm");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm hàm xử lý đóng/mở dialog
  const handleOpenAddDialog = () => {
    if (!lopHocPhanId) {
      setSnackbarMessage("Vui lòng chọn lớp học phần trước");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    setNewBaiKiemTra({
      ...newBaiKiemTra,
      lopHocPhanId: lopHocPhanId
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewBaiKiemTra({
      loai: '',
      trongSo: 0,
      ngayMoNhapDiem: null,
      hanNhapDiem: null,
      hanDinhChinh: null,
      lopHocPhanId: null
    });
    setFormErrors({
      loai: false,
      trongSo: false,
      ngayMoNhapDiem: false,
      hanNhapDiem: false,
      hanDinhChinh: false
    });
  };

  // Thêm hàm validate form
  const validateForm = () => {
    const errors = {
      loai: !newBaiKiemTra.loai,
      trongSo: newBaiKiemTra.trongSo <= 0 || newBaiKiemTra.trongSo > 1,
      ngayMoNhapDiem: !newBaiKiemTra.ngayMoNhapDiem,
      hanNhapDiem: !newBaiKiemTra.hanNhapDiem,
      hanDinhChinh: !newBaiKiemTra.hanDinhChinh
    };

    setFormErrors(errors);

    return !Object.values(errors).some(error => error);
  };

  // Thêm hàm xử lý tạo mới
  const handleAddBaiKiemTra = async () => {
    if (!validateForm()) {
      setSnackbarMessage("Vui lòng kiểm tra lại thông tin");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Chuyển đổi dữ liệu để gửi lên backend
    const baiKiemTraData = {
      Loai: newBaiKiemTra.loai,
      TrongSo: newBaiKiemTra.trongSo ? parseFloat(newBaiKiemTra.trongSo) : null,
      NgayMoNhapDiem: newBaiKiemTra.ngayMoNhapDiem,
      HanNhapDiem: newBaiKiemTra.hanNhapDiem,
      HanDinhChinh: newBaiKiemTra.hanDinhChinh,
      LopHocPhanId: newBaiKiemTra.lopHocPhanId
    };

    try {
      setIsLoading(true);
      await addBaiKiemTra(baiKiemTraData);
      setSnackbarMessage("Thêm bài kiểm tra thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseAddDialog();
    await fetchData();
    } catch (error) {
      setSnackbarMessage(error.message || "Lỗi khi thêm bài kiểm tra");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm hàm xử lý thay đổi input
  const handleInputChange = (field) => (event) => {
    setNewBaiKiemTra({
      ...newBaiKiemTra,
      [field]: event.target.value
    });
    setFormErrors({
      ...formErrors,
      [field]: false
    });
  };

  // Thêm hàm xử lý mở dialog xóa
  const handleOpenDeleteDialog = (baiKiemTraId) => {
    setSelectedBaiKiemTraId(baiKiemTraId);
    setOpenDeleteDialog(true);
  };

  // Thêm hàm xử lý đóng dialog xóa
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBaiKiemTraId(null);
  };

  // Thêm hàm xử lý xóa
  const handleDeleteBaiKiemTra = async () => {
    try {
      setIsLoading(true);
      await deleteBaiKiemTra(selectedBaiKiemTraId);
      setSnackbarMessage("Xóa bài kiểm tra thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      await fetchData();
    } catch (error) {
      setSnackbarMessage(error.message || "Lỗi khi xóa bài kiểm tra");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm hàm xử lý mở dialog sửa
  const handleOpenEditDialog = (baiKiemTra) => {
    setEditBaiKiemTra({
      id: baiKiemTra.id,
      loai: baiKiemTra.loai,
      trongSo: baiKiemTra.trongSo,
      ngayMoNhapDiem: baiKiemTra.ngayMoNhapDiem,
      hanNhapDiem: baiKiemTra.hanNhapDiem,
      hanDinhChinh: baiKiemTra.hanDinhChinh,
      lopHocPhanId: baiKiemTra.lopHocPhanId
    });
    setOpenEditDialog(true);
  };

  // Thêm hàm xử lý đóng dialog sửa
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditBaiKiemTra({
      id: null,
      loai: '',
      trongSo: 0,
      ngayMoNhapDiem: null,
      hanNhapDiem: null,
      hanDinhChinh: null,
      lopHocPhanId: null
    });
    setEditFormErrors({
      loai: false,
      trongSo: false,
      ngayMoNhapDiem: false,
      hanNhapDiem: false,
      hanDinhChinh: false
    });
  };

  // Thêm hàm validate form sửa
  const validateEditForm = () => {
    const errors = {
      loai: !editBaiKiemTra.loai,
      trongSo: editBaiKiemTra.trongSo <= 0 || editBaiKiemTra.trongSo > 1,
      ngayMoNhapDiem: !editBaiKiemTra.ngayMoNhapDiem,
      hanNhapDiem: !editBaiKiemTra.hanNhapDiem,
      hanDinhChinh: !editBaiKiemTra.hanDinhChinh
    };

    setEditFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  // Thêm hàm xử lý thay đổi input trong form sửa
  const handleEditInputChange = (field) => (event) => {
    setEditBaiKiemTra({
      ...editBaiKiemTra,
      [field]: event.target.value
    });
    setEditFormErrors({
      ...editFormErrors,
      [field]: false
    });
  };

  // Thêm hàm xử lý cập nhật
  const handleUpdateBaiKiemTra = async () => {
    if (!validateEditForm()) {
      setSnackbarMessage("Vui lòng kiểm tra lại thông tin");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Chuyển đổi dữ liệu để gửi lên backend
    const baiKiemTraData = {
      Loai: editBaiKiemTra.loai,
      TrongSo: editBaiKiemTra.trongSo ? parseFloat(editBaiKiemTra.trongSo) : null,
      NgayMoNhapDiem: editBaiKiemTra.ngayMoNhapDiem,
      HanNhapDiem: editBaiKiemTra.hanNhapDiem,
      HanDinhChinh: editBaiKiemTra.hanDinhChinh
    };

    try {
      setIsLoading(true);
      await updateBaiKiemTra(editBaiKiemTra.id, baiKiemTraData);
      setSnackbarMessage("Cập nhật bài kiểm tra thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseEditDialog();
      await fetchData();
    } catch (error) {
      setSnackbarMessage(error.message || "Lỗi khi cập nhật bài kiểm tra");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div style={styles.main}>
        <div style={styles.title}>
          <span>Công thức tính điểm</span>
          <div style={styles.btnMore}>
            <IconButton aria-label="more actions">
              <MoreVertIcon/>
            </IconButton>
          </div>
        </div>

        <div style={styles.tbActions}>
          <Box sx={{ display: 'flex', gap: 2, width: '100%', alignItems: 'center' }}>
            {/* <Autocomplete
              options={lophocphanItems}
              getOptionLabel={(option) => option.label || ""}
              value={lophocphanItems.find(item => item.value === comboBoxLopHocPhanId) || null}
              onChange={(event, newValue) => setComboBoxLopHocPhanId(newValue?.value || null)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Chọn lớp học phần" 
                  size="small"
                  sx={{ width: '300px' }}
                />
              )}
            /> */}
            <Box sx={{ width: 400,fontSize:"14" }}>
                <VirtualizedAutocomplete
                  options={lophocphanItems}
                  getOptionLabel={(option) => `${option.maLopHocPhan} - ${option.ten}`}
                  value={lophocphanItems.find(item => item.value === comboBoxLopHocPhanId) || null}
                  onChange={(event, newValue) => setComboBoxLopHocPhanId(newValue?.value || null)}
                  label="Chọn lớp học phần"
                  noOptionsText={"Không tìm thấy lớp học phần"}
                  variant="outlined"
                  size="small"
                />
              </Box>

         
            
            <Button 
              variant="contained" 
              onClick={handleGoClick}
              sx={{ height: '40px' }}
            >
              Xem
            </Button>

            <Button
              variant="contained"
              onClick={handleOpenAddDialog}
              sx={{ height: '40px' }}
              disabled={!lopHocPhanId}
            >
              Thêm bài kiểm tra
                  </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!lopHocPhanId || isLoading}
              sx={{ 
                height: '40px',
                marginLeft: 'auto'
              }}
            >
              {isLoading ? "Đang lưu..." : "Lưu công thức điểm"}
                  </Button>
          </Box>
            </div>

        <div style={styles.table}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">STT</StyledTableCell>
                  <StyledTableCell align="center">Loại</StyledTableCell>
                  <StyledTableCell align="center">Trọng số</StyledTableCell>
                  <StyledTableCell align="center">Ngày mở nhập điểm</StyledTableCell>
                  <StyledTableCell align="center">Hạn nhập điểm</StyledTableCell>
                  <StyledTableCell align="center">Hạn đính chính</StyledTableCell>
                  <StyledTableCell align="center">Ngày xác nhận</StyledTableCell>
                  <StyledTableCell align="center">Thao tác</StyledTableCell>
                </TableRow>
                          </TableHead>
                <TableBody>
                {data.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{row.loai}</StyledTableCell>
                    <StyledTableCell align="center">{row.trongSo}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.ngayMoNhapDiem ? new Date(row.ngayMoNhapDiem).toLocaleDateString('vi-VN') : ''}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.hanNhapDiem ? new Date(row.hanNhapDiem).toLocaleDateString('vi-VN') : ''}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.hanDinhChinh ? new Date(row.hanDinhChinh).toLocaleDateString('vi-VN') : ''}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.ngayXacNhan ? new Date(row.ngayXacNhan).toLocaleDateString('vi-VN') : ''}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Tooltip title="Sửa bài kiểm tra">
                        <IconButton onClick={() => handleOpenEditDialog(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa bài kiểm tra">
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
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Thêm bài kiểm tra mới</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Loại bài kiểm tra"
                value={newBaiKiemTra.loai}
                onChange={handleInputChange('loai')}
                error={formErrors.loai}
                helperText={formErrors.loai ? "Loại không được để trống" : ""}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Trọng số"
                type="number"
                value={newBaiKiemTra.trongSo}
                onChange={handleInputChange('trongSo')}
                error={formErrors.trongSo}
                helperText={formErrors.trongSo ? "Trọng số phải nằm trong khoảng từ 0 đến 1" : ""}
                margin="normal"
                inputProps={{
                  step: 0.01,
                  min: 0,
                  max: 1
                }}
              />

              <TextField
                fullWidth
                label="Ngày mở nhập điểm"
                type="datetime-local"
                value={newBaiKiemTra.ngayMoNhapDiem || ''}
                onChange={handleInputChange('ngayMoNhapDiem')}
                error={formErrors.ngayMoNhapDiem}
                helperText={formErrors.ngayMoNhapDiem ? "Vui lòng chọn ngày mở nhập điểm" : ""}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                fullWidth
                label="Hạn nhập điểm"
                type="datetime-local"
                value={newBaiKiemTra.hanNhapDiem || ''}
                onChange={handleInputChange('hanNhapDiem')}
                error={formErrors.hanNhapDiem}
                helperText={formErrors.hanNhapDiem ? "Vui lòng chọn hạn nhập điểm" : ""}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                fullWidth
                label="Hạn đính chính"
                type="datetime-local"
                value={newBaiKiemTra.hanDinhChinh || ''}
                onChange={handleInputChange('hanDinhChinh')}
                error={formErrors.hanDinhChinh}
                helperText={formErrors.hanDinhChinh ? "Vui lòng chọn hạn đính chính" : ""}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Hủy</Button>
                <Button
              onClick={handleAddBaiKiemTra}
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Thêm"}
                </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa bài kiểm tra này không?
              {data.find(item => item.id === selectedBaiKiemTraId)?.loai && (
                <Box component="span" sx={{ display: 'block', mt: 1, fontWeight: 'bold' }}>
                  Loại: {data.find(item => item.id === selectedBaiKiemTraId)?.loai}
                </Box>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              onClick={handleDeleteBaiKiemTra}
              variant="contained"
              color="error"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog 
          open={openEditDialog} 
          onClose={handleCloseEditDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Sửa bài kiểm tra</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Loại bài kiểm tra"
                value={editBaiKiemTra.loai}
                onChange={handleEditInputChange('loai')}
                error={editFormErrors.loai}
                helperText={editFormErrors.loai ? "Loại không được để trống" : ""}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Trọng số"
                type="number"
                value={editBaiKiemTra.trongSo}
                onChange={handleEditInputChange('trongSo')}
                error={editFormErrors.trongSo}
                helperText={editFormErrors.trongSo ? "Trọng số phải nằm trong khoảng từ 0 đến 1" : ""}
                margin="normal"
                inputProps={{
                  step: 0.01,
                  min: 0,
                  max: 1
                }}
              />

              <TextField
                fullWidth
                label="Ngày mở nhập điểm"
                type="datetime-local"
                value={editBaiKiemTra.ngayMoNhapDiem || ''}
                onChange={handleEditInputChange('ngayMoNhapDiem')}
                error={editFormErrors.ngayMoNhapDiem}
                helperText={editFormErrors.ngayMoNhapDiem ? "Vui lòng chọn ngày mở nhập điểm" : ""}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                fullWidth
                label="Hạn nhập điểm"
                type="datetime-local"
                value={editBaiKiemTra.hanNhapDiem || ''}
                onChange={handleEditInputChange('hanNhapDiem')}
                error={editFormErrors.hanNhapDiem}
                helperText={editFormErrors.hanNhapDiem ? "Vui lòng chọn hạn nhập điểm" : ""}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                fullWidth
                label="Hạn đính chính"
                type="datetime-local"
                value={editBaiKiemTra.hanDinhChinh || ''}
                onChange={handleEditInputChange('hanDinhChinh')}
                error={editFormErrors.hanDinhChinh}
                helperText={editFormErrors.hanDinhChinh ? "Vui lòng chọn hạn đính chính" : ""}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateBaiKiemTra}
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Backdrop for loading */}
        <Backdrop
          sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1 
          }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </Layout>
  );
}
