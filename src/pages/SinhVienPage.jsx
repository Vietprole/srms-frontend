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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { useState, useEffect, useCallback } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from './Layout';
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getSinhViens,
  deleteSinhVien,
  addSinhVien,
  updateSinhVien,
  getSinhVienById
} from "@/api/api-sinhvien";
import { getAllKhoas } from "@/api/api-khoa";
import { getAllNganhs } from "@/api/api-nganh";
import { getAllLopHocPhans, getLopHocPhans } from "@/api/api-lophocphan";
import { getGiangVienId, getRole } from "@/utils/storage";

const role = getRole();
const giangVienId = getGiangVienId();

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
  filterBox: {
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
    backgroundColor:"#D3F3FF",
    cursor: 'pointer',
  },
}));

export default function SinhVienPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lopHocPhanIdParam = searchParams.get("lopHocPhanId");
  const khoaIdParam = searchParams.get("khoaId");
  const nganhIdParam = searchParams.get("nganhId");
  const [data, setData] = useState([]);
  const [khoaItems, setKhoaItems] = useState([]);
  const [lopHocPhanItems, setLopHocPhanItems] = useState([]);
  const [nganhItems, setNganhItems] = useState([]);
  const [khoaId, setKhoaId] = useState(khoaIdParam);
  const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam);
  const [nganhId, setNganhId] = useState(nganhIdParam);
  const [comboBoxKhoaId, setComboBoxKhoaId] = useState(khoaIdParam);
  const [comboBoxLopHocPhanId, setComboBoxLopHocPhanId] = useState(lopHocPhanIdParam);
  const [comboBoxNganhId, setComboBoxNganhId] = useState(nganhIdParam);
  const baseUrl = "/sinhvien";

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [tenSinhVien, setTenSinhVien] = useState("");
  const [selectedKhoa, setSelectedKhoa] = useState(null);
  const [selectedNganh, setSelectedNganh] = useState(null);
  const [namNhapHoc, setNamNhapHoc] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchData = useCallback(async () => {
    const dataKhoa = await getAllKhoas();
    const mappedKhoaItems = dataKhoa.map(khoa => ({ label: khoa.ten, value: khoa.id }));
    setKhoaItems(mappedKhoaItems);

    const dataNganh = await getAllNganhs();
    const mappedNganhItems = dataNganh.map(nganh => ({ label: nganh.ten, value: nganh.id }));
    setNganhItems(mappedNganhItems);

    if (role === "GiangVien" && giangVienId != 0) {
      const data = await getLopHocPhans(null, null, giangVienId, null);
      const mappedComboBoxItems = data.map(lopHocPhan => ({ label: lopHocPhan.ten, value: lopHocPhan.id }));
      setLopHocPhanItems(mappedComboBoxItems);

      const dataSinhVien = await getSinhViens(khoaId, nganhId, lopHocPhanId);
      setData(dataSinhVien);
      return;
    }
    const data = await getAllLopHocPhans();
    const mappedComboBoxItems = data.map(lopHocPhan => ({ label: lopHocPhan.ten, value: lopHocPhan.id }));
    setLopHocPhanItems(mappedComboBoxItems);

    const dataSinhVien = await getSinhViens(khoaId, nganhId, lopHocPhanId);
    setData(dataSinhVien);
  }, [khoaId, nganhId, lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setKhoaId(comboBoxKhoaId);
    setNganhId(comboBoxNganhId);
    setLopHocPhanId(comboBoxLopHocPhanId);
    const url = createSearchURL(baseUrl, { 
      khoaId: comboBoxKhoaId, 
      nganhId: comboBoxNganhId,
      lopHocPhanId: comboBoxLopHocPhanId 
    });
    navigate(url);
  };

  const handleAddSinhVien = async (newSinhVien) => {
    try {
      await addSinhVien(newSinhVien);
      fetchData();
    } catch (error) {
      
    }
  };

  const handleUpdateSinhVien = async (updatedSinhVien) => {
    try {
      await updateSinhVien(updatedSinhVien);
      fetchData();
    } catch (error) {
      // toast.error("Cập nhật sinh viên thất bại!");
    }
  };

  const handleDeleteSinhVien = async () => {
    try {
      await deleteSinhVien(selectedStudentId);
      setSnackbarMessage("Xóa sinh viên thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      fetchData(); // Cập nhật lại danh sách sinh viên
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setTenSinhVien("");
    setSelectedKhoa(null);
    setSelectedNganh(null);
    setNamNhapHoc("");
  };

  const handleSubmitAdd = async () => {
    if (!tenSinhVien || !selectedKhoa || !selectedNganh || !namNhapHoc) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng điền đầy đủ thông tin");
      setOpenSnackbar(true);
      return;
    }

    const newSinhVien = {
      ten: tenSinhVien,
      khoaId: selectedKhoa.value,
      nganhId: selectedNganh.value,
      namNhapHoc: parseInt(namNhapHoc)
    };

    try {
      const response = await addSinhVien(newSinhVien);
      if (response) {
        setSnackbarMessage("Thêm sinh viên thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseAddDialog();
        fetchData();
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSubmitEdit = async () => {
    if (!tenSinhVien || !selectedKhoa || !selectedNganh || !namNhapHoc) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng điền đầy đủ thông tin");
      setOpenSnackbar(true);
      return;
    }

    const updatedSinhVien = {
      ten: tenSinhVien,
      khoaId: selectedKhoa.value,
      nganhId: selectedNganh.value,
      namNhapHoc: parseInt(namNhapHoc)
    };

    try {
      const response = await updateSinhVien(selectedStudentId, updatedSinhVien);
      if (response) {
        setSnackbarMessage("Cập nhật sinh viên thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseEditDialog();
        fetchData(); // Cập nhật lại danh sách sinh viên
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenEditDialog = async (sinhVienId) => {
    const sinhVien = await getSinhVienById(sinhVienId);
    setTenSinhVien(sinhVien.ten);
    setSelectedKhoa({ value: sinhVien.khoaId, label: sinhVien.tenKhoa });
    setSelectedNganh({ value: sinhVien.nganhId, label: sinhVien.tenNganh });
    setNamNhapHoc(sinhVien.namNhapHoc);
    setSelectedStudentId(sinhVienId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setTenSinhVien("");
    setSelectedKhoa(null);
    setSelectedNganh(null);
    setNamNhapHoc("");
  };

  const handleOpenDeleteDialog = (sinhVienId) => {
    setSelectedStudentId(sinhVienId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedStudentId(null);
  };

  return (
    <Layout>
      <div style={styles.main}>
        <div style={styles.title}>
          <span>Danh sách sinh viên</span>
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
                placeholder="Tìm kiếm theo tên sinh viên..."
                variant="standard"
                autoComplete='off'
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <IconButton>
                      <SearchIcon sx={{ color: "#888" }} />
                    </IconButton>
                  ),
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
          </div>

          <div style={styles.filterBox}>
            <Autocomplete
              options={khoaItems}
              getOptionLabel={(option) => option.label || ""}
              value={khoaItems.find(item => item.value === comboBoxKhoaId) || null}
              onChange={(_, newValue) => setComboBoxKhoaId(newValue?.value)}
              renderInput={(params) => (
                <TextField {...params} label="Chọn khoa" size="small" />
              )}
            />
          </div>

          <div style={styles.filterBox}>
            <Autocomplete
              options={nganhItems}
              getOptionLabel={(option) => option.label || ""}
              value={nganhItems.find(item => item.value === comboBoxNganhId) || null}
              onChange={(_, newValue) => setComboBoxNganhId(newValue?.value)}
              renderInput={(params) => (
                <TextField {...params} label="Chọn ngành" size="small" />
              )}
            />
          </div>

          {(role === "Admin" || role === "PhongDaoTao") && (
            <div style={styles.btnCreate}>
              <Button 
                variant="contained" 
                onClick={handleOpenAddDialog}
                sx={{width:"100%"}}
              >
                Tạo sinh viên
              </Button>
            </div>
          )}
        </div>

        <div style={styles.table}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead sx={{position: 'sticky', top: 0, zIndex: 1, backgroundColor: "#0071A6"}}>
                <TableRow>
                  <StyledTableCell align="center">STT</StyledTableCell>
                  <StyledTableCell align="center">Mã sinh viên</StyledTableCell>
                  <StyledTableCell align="center">Tên sinh viên</StyledTableCell>
                  <StyledTableCell align="center">Khoa</StyledTableCell>
                  <StyledTableCell align="center">Ngành</StyledTableCell>
                  <StyledTableCell align="center">Năm nhập học</StyledTableCell>
                  {(role === "Admin" || role === "PhongDaoTao") && (
                    <StyledTableCell align="center">Thao tác</StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{row.maSinhVien}</StyledTableCell>
                    <StyledTableCell align="center">{row.ten}</StyledTableCell>
                    <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
                    <StyledTableCell align="center">{row.tenNganh}</StyledTableCell>
                    <StyledTableCell align="center">{row.namNhapHoc}</StyledTableCell>
                    {(role === "Admin" || role === "PhongDaoTao") && (
                      <StyledTableCell align="center">
                        <Tooltip title="Sửa sinh viên">
                          <IconButton onClick={() => handleOpenEditDialog(row.id)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa sinh viên">
                          <IconButton onClick={() => handleOpenDeleteDialog(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Tạo Sinh Viên</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tạo Sinh Viên mới
            </DialogContentText>
            
            <TextField
              autoFocus
              margin="dense"
              label="Tên"
              fullWidth
              variant="outlined"
              value={tenSinhVien}
              onChange={(e) => setTenSinhVien(e.target.value)}
              helperText="Tên hiển thị của sinh viên"
              sx={{ mb: 2 }}
            />
            
            <Autocomplete
              options={khoaItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedKhoa}
              onChange={(_, newValue) => setSelectedKhoa(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Chọn Khoa" 
                  variant="outlined" 
                  helperText="Khoa của sinh viên"
                />
              )}
              sx={{ mb: 2 }}
            />
            
            <Autocomplete
              options={nganhItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedNganh}
              onChange={(_, newValue) => setSelectedNganh(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Chọn Ngành" 
                  variant="outlined" 
                  helperText="Ngành sinh viên nhập học"
                />
              )}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="Năm Nhập Học"
              type="number"
              fullWidth
              variant="outlined"
              value={namNhapHoc}
              onChange={(e) => setNamNhapHoc(e.target.value)}
              helperText="Năm sinh viên nhập học"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Hủy</Button>
            <Button onClick={handleSubmitAdd}>Submit</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Sửa Sinh Viên</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Cập nhật thông tin sinh viên
            </DialogContentText>
            
            <TextField
              autoFocus
              margin="dense"
              label="Tên"
              fullWidth
              variant="outlined"
              value={tenSinhVien}
              onChange={(e) => setTenSinhVien(e.target.value)}
              helperText="Tên hiển thị của sinh viên"
              sx={{ mb: 2 }}
            />
            
            <Autocomplete
              options={khoaItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedKhoa}
              onChange={(_, newValue) => setSelectedKhoa(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Chọn Khoa" 
                  variant="outlined" 
                  helperText="Khoa của sinh viên"
                />
              )}
              sx={{ mb: 2 }}
            />
            
            <Autocomplete
              options={nganhItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedNganh}
              onChange={(_, newValue) => setSelectedNganh(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Chọn Ngành" 
                  variant="outlined" 
                  helperText="Ngành sinh viên nhập học"
                />
              )}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="Năm Nhập Học"
              type="number"
              fullWidth
              variant="outlined"
              value={namNhapHoc}
              onChange={(e) => setNamNhapHoc(e.target.value)}
              helperText="Năm sinh viên nhập học"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Hủy</Button>
            <Button onClick={handleSubmitEdit}>Cập nhật</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Xóa Sinh Viên</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa sinh viên này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
            <Button onClick={handleDeleteSinhVien}>Xóa</Button>
          </DialogActions>
        </Dialog>

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
