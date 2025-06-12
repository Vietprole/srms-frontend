import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Autocomplete, Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import Layout from "@/pages/Layout";
import { useState, useEffect, useRef } from "react";
import {
  deleteCLO,
  getCLOsByHocPhanId,
  addCLO,
  updateCLO,
} from "@/api/api-clo";
import { getAllHocPhans } from "@/api/api-hocphan";
import { styled } from "@mui/material/styles";

// Thêm StyledTableCell cho header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#0071A6",
  color: "#fff",
  fontWeight: "normal",
  fontSize: 16,
  borderRight: "1px solid #fff",
  textAlign: "center",
  // Nếu muốn bo góc trái/phải cho header:
  "&:first-of-type": {
    borderTopLeftRadius: "6px",
  },
  "&:last-of-type": {
    borderTopRightRadius: "6px",
    borderRight: 0,
  },
}));

const StyledBodyTableCell = styled(TableCell)(({ theme }) => ({
  borderRight: "1px solid #ddd",
  textAlign: "center",
  fontSize: 15,
  backgroundColor: "#fff",
  color: "#222",
  "&:last-of-type": {
    borderRight: 0,
  },
}));

export default function QuanLyCLO() {
  const [hocPhans, setHocPhans] = useState([]);
  const [selectedHocPhan, setSelectedHocPhan] = useState(null);
  const [clos, setClos] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCLO, setSelectedCLO] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Form state
  const [tenCLO, setTenCLO] = useState("");
  const [moTaCLO, setMoTaCLO] = useState("");
  const [errorTenCLO, setErrorTenCLO] = useState(false);
  const [errorMoTaCLO, setErrorMoTaCLO] = useState(false);

  // Fetch học phần
  useEffect(() => {
    getAllHocPhans().then(data => setHocPhans(data));
  }, []);

  // Fetch CLO khi chọn học phần
  useEffect(() => {
    if (selectedHocPhan) {
      getCLOsByHocPhanId(selectedHocPhan.id).then(setClos);
    } else {
      setClos([]);
    }
  }, [selectedHocPhan]);

  // Xử lý mở dialog thêm
  const handleOpenAdd = () => {
    setTenCLO("");
    setMoTaCLO("");
    setErrorTenCLO(false);
    setErrorMoTaCLO(false);
    setOpenAddDialog(true);
  };

  // Xử lý thêm CLO
  const handleAddCLO = async () => {
    if (!tenCLO.trim()) { setErrorTenCLO(true); return; }
    if (!moTaCLO.trim()) { setErrorMoTaCLO(true); return; }
    try {
      await addCLO({ ten: tenCLO, moTa: moTaCLO, hocPhanId: selectedHocPhan.id });
      setSnackbar({ open: true, message: "Thêm CLO thành công", severity: "success" });
      setOpenAddDialog(false);
      getCLOsByHocPhanId(selectedHocPhan.id).then(setClos);
    } catch {
      setSnackbar({ open: true, message: "Thêm CLO thất bại", severity: "error" });
    }
  };

  // Xử lý mở dialog sửa
  const handleOpenEdit = (clo) => {
    setSelectedCLO(clo);
    setTenCLO(clo.ten);
    setMoTaCLO(clo.moTa);
    setErrorTenCLO(false);
    setErrorMoTaCLO(false);
    setOpenEditDialog(true);
  };

  // Xử lý sửa CLO
  const handleEditCLO = async () => {
    if (!tenCLO.trim()) { setErrorTenCLO(true); return; }
    if (!moTaCLO.trim()) { setErrorMoTaCLO(true); return; }
    try {
      await updateCLO(selectedCLO.id, { ten: tenCLO, moTa: moTaCLO, hocPhanId: selectedHocPhan.id });
      setSnackbar({ open: true, message: "Cập nhật CLO thành công", severity: "success" });
      setOpenEditDialog(false);
      getCLOsByHocPhanId(selectedHocPhan.id).then(setClos);
    } catch {
      setSnackbar({ open: true, message: "Cập nhật CLO thất bại", severity: "error" });
    }
  };

  // Xử lý xóa CLO
  const handleDeleteCLO = async () => {
    try {
      await deleteCLO(selectedCLO.id);
      setSnackbar({ open: true, message: "Xóa CLO thành công", severity: "success" });
      setOpenDeleteDialog(false);
      getCLOsByHocPhanId(selectedHocPhan.id).then(setClos);
    } catch {
      setSnackbar({ open: true, message: "Xóa CLO thất bại", severity: "error" });
    }
  };

  return (
    <Layout>
      <Box sx={{ width: "100%", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Danh sách CLO</Typography>
        </Box>
        <Box sx={{ width: 300, mb: 2 }}>
          <Autocomplete
            options={hocPhans}
            getOptionLabel={option => option.ten || ""}
            value={selectedHocPhan}
            onChange={(e, v) => setSelectedHocPhan(v)}
            renderInput={params => <TextField {...params} label="Chọn học phần" variant="outlined" />}
            noOptionsText="Không có học phần"
          />
        </Box>
        {selectedHocPhan && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                Tạo CLO
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>STT</StyledTableCell>
                    <StyledTableCell>Tên CLO</StyledTableCell>
                    <StyledTableCell align="left" sx={{ textAlign: "left" }}>Mô tả</StyledTableCell>
                    <StyledTableCell>Thao tác</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clos.map((clo, idx) => (
                    <TableRow key={clo.id}>
                      <StyledBodyTableCell>{idx + 1}</StyledBodyTableCell>
                      <StyledBodyTableCell>{clo.ten}</StyledBodyTableCell>
                      <StyledBodyTableCell align="left" sx={{ textAlign: "left" }}>{clo.moTa}</StyledBodyTableCell>
                      <StyledBodyTableCell>
                        <Tooltip title="Sửa CLO">
                          <IconButton onClick={() => handleOpenEdit(clo)}><EditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa CLO">
                          <IconButton onClick={() => { setSelectedCLO(clo); setOpenDeleteDialog(true); }}><DeleteIcon /></IconButton>
                        </Tooltip>
                      </StyledBodyTableCell>
                    </TableRow>
                  ))}
                  {clos.length === 0 && (
                    <TableRow>
                      <StyledBodyTableCell colSpan={4} align="center">Không có CLO nào</StyledBodyTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Dialog Thêm */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth>
          <DialogTitle>Thêm CLO mới</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Tên CLO"
              fullWidth
              value={tenCLO}
              onChange={e => { setTenCLO(e.target.value); setErrorTenCLO(false); }}
              error={errorTenCLO}
              helperText={errorTenCLO ? "Vui lòng nhập tên CLO" : ""}
            />
            <TextField
              margin="dense"
              label="Mô tả CLO"
              fullWidth
              value={moTaCLO}
              onChange={e => { setMoTaCLO(e.target.value); setErrorMoTaCLO(false); }}
              error={errorMoTaCLO}
              helperText={errorMoTaCLO ? "Vui lòng nhập mô tả CLO" : ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
            <Button onClick={handleAddCLO}>Lưu</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Sửa */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth>
          <DialogTitle>Sửa CLO</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Tên CLO"
              fullWidth
              value={tenCLO}
              onChange={e => { setTenCLO(e.target.value); setErrorTenCLO(false); }}
              error={errorTenCLO}
              helperText={errorTenCLO ? "Vui lòng nhập tên CLO" : ""}
            />
            <TextField
              margin="dense"
              label="Mô tả CLO"
              fullWidth
              value={moTaCLO}
              onChange={e => { setMoTaCLO(e.target.value); setErrorMoTaCLO(false); }}
              error={errorMoTaCLO}
              helperText={errorMoTaCLO ? "Vui lòng nhập mô tả CLO" : ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
            <Button onClick={handleEditCLO}>Lưu</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Xóa */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Xóa CLO</DialogTitle>
          <DialogContent>Bạn có chắc chắn muốn xóa CLO này không?</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
            <Button color="error" onClick={handleDeleteCLO}>Xóa</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <MuiAlert
            variant="filled"
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Layout>
  );
} 
