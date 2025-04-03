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
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from './Layout';
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getPLOs,
  deletePLO,
  addPLO,
  updatePLO,
  getCLOsByPLOId,
  getHocPhansByPLOId,
} from "@/api/api-plo";
import { getAllNganhs } from "@/api/api-nganh";
import { PLOForm } from "@/components/PLOForm";

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
  cbNganh: {
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

export default function PLOPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nganhIdParam = searchParams.get("nganhId");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nganhItems, setNganhItems] = useState([]);
  const [nganhId, setNganhId] = useState(nganhIdParam);
  const [comboBoxNganhId, setComboBoxNganhId] = useState(nganhIdParam);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [newPLO, setNewPLO] = useState({
    ten: "",
    moTa: "",
    nganhId: "",
  });
  const [errorTen, setErrorTen] = useState(false);
  const [errorNganh, setErrorNganh] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPLO, setSelectedPLO] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingPLO, setEditingPLO] = useState({
    id: "",
    ten: "",
    moTa: "",
    nganhId: "",
  });
  const [errorEditTen, setErrorEditTen] = useState(false);
  const [errorEditNganh, setErrorEditNganh] = useState(false);

  const fetchData = useCallback(async () => {
    try {
    const dataNganh = await getAllNganhs();
    const mappedComboBoxItems = dataNganh.map(nganh => ({ label: nganh.ten, value: nganh.id }));
    setNganhItems(mappedComboBoxItems);
      
      const plos = await getPLOs();
      // Thêm số thứ tự và sắp xếp PLO theo ngành và số thứ tự
      const plosWithSTT = plos.map(plo => ({
        ...plo,
        stt: Number(plo.ten.split(' ')[1]) // Lấy số từ tên PLO
      })).sort((a, b) => {
        // Đầu tiên sắp xếp theo tên ngành
        if (a.tenNganh < b.tenNganh) return -1;
        if (a.tenNganh > b.tenNganh) return 1;
        // Nếu cùng ngành thì sắp xếp theo số thứ tự PLO
        return a.stt - b.stt;
      });
      
      setData(plosWithSTT);
      setFilteredData(plosWithSTT);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNganhChange = (event, newValue) => {
    setComboBoxNganhId(newValue?.value || null);
    if (!newValue) {
      // Khi hiển thị tất cả, vẫn giữ nguyên thứ tự nhóm theo ngành
      setFilteredData(data);
    } else {
      const filtered = data
        .filter((plo) => plo.nganhId === newValue.value)
        .sort((a, b) => a.stt - b.stt); // Sắp xếp theo số thứ tự trong cùng một ngành
      setFilteredData(filtered);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewPLO({
      ten: "",
      moTa: "",
      nganhId: "",
    });
    setErrorTen(false);
    setErrorNganh(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleAdd = async () => {
    if (!newPLO.ten.trim()) {
      setErrorTen(true);
      return;
    }
    if (!newPLO.nganhId) {
      setErrorNganh(true);
      return;
    }

    try {
      const createdPLO = await addPLO(newPLO);
      const newPLOWithSTT = {
        ...createdPLO,
        stt: Number(createdPLO.ten.split(' ')[1])
      };
      
      // Thêm PLO mới và sắp xếp lại theo ngành và số thứ tự
      const newData = [...data, newPLOWithSTT].sort((a, b) => {
        if (a.tenNganh < b.tenNganh) return -1;
        if (a.tenNganh > b.tenNganh) return 1;
        return a.stt - b.stt;
      });
      
      // Nếu đang lọc theo ngành, chỉ cập nhật filtered data khi PLO mới thuộc ngành đang lọc
      const newFilteredData = comboBoxNganhId
        ? [...filteredData, newPLOWithSTT]
            .filter(plo => plo.nganhId === comboBoxNganhId)
            .sort((a, b) => a.stt - b.stt)
        : newData;
      
      setData(newData);
      setFilteredData(newFilteredData);
      
      setNewPLO({
        ten: "",
        moTa: "",
        nganhId: "",
      });
      setOpenAddDialog(false);
      
      setSnackbarMessage("Tạo PLO thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Có lỗi xảy ra khi tạo PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenEditDialog = (plo) => {
    setEditingPLO({
      id: plo.id,
      ten: plo.ten,
      moTa: plo.moTa || "",
      nganhId: plo.nganhId,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingPLO({
      id: "",
      ten: "",
      moTa: "",
      nganhId: "",
    });
    setErrorEditTen(false);
    setErrorEditNganh(false);
  };

  const handleEdit = async () => {
    if (!editingPLO.ten.trim()) {
      setErrorEditTen(true);
      return;
    }
    if (!editingPLO.nganhId) {
      setErrorEditNganh(true);
      return;
    }

    try {
      const updatedPLO = await updatePLO(editingPLO.id, editingPLO);
      const updatedPLOWithSTT = {
        ...updatedPLO,
        stt: Number(updatedPLO.ten.split(' ')[1])
      };
      
      // Cập nhật và sắp xếp lại theo ngành và số thứ tự
      const newData = data
        .map(item => item.id === updatedPLO.id ? updatedPLOWithSTT : item)
        .sort((a, b) => {
          if (a.tenNganh < b.tenNganh) return -1;
          if (a.tenNganh > b.tenNganh) return 1;
          return a.stt - b.stt;
        });
      
      // Cập nhật filtered data tương tự như khi thêm mới
      const newFilteredData = comboBoxNganhId
        ? newData.filter(plo => plo.nganhId === comboBoxNganhId)
        : newData;
      
      setData(newData);
      setFilteredData(newFilteredData);
      
      handleCloseEditDialog();
      setSnackbarMessage("Cập nhật PLO thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error.message || "Có lỗi xảy ra khi cập nhật PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenDeleteDialog = (plo) => {
    setSelectedPLO(plo);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPLO(null);
  };

  const handleDelete = async () => {
    try {
      // Kiểm tra PLO có CLO nào không
      const clos = await getCLOsByPLOId(selectedPLO.id);
      if (clos && clos.length > 0) {
        setSnackbarMessage("Không thể xóa PLO vì đang có CLO liên kết. Vui lòng xóa các CLO trước.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        handleCloseDeleteDialog();
        return;
      }

      // Kiểm tra PLO có Học phần nào không
      const hocPhans = await getHocPhansByPLOId(selectedPLO.id);
      if (hocPhans && hocPhans.length > 0) {
        setSnackbarMessage("Không thể xóa PLO vì đang có Học phần liên kết. Vui lòng gỡ liên kết với các Học phần trước.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        handleCloseDeleteDialog();
        return;
      }

      // Tiến hành xóa nếu không có ràng buộc
      await deletePLO(selectedPLO.id);
      
      // Cập nhật lại dữ liệu
      await fetchData();
      
      // Thông báo thành công
      setSnackbarMessage("Xóa PLO thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      
    } catch (error) {
      // Xử lý các loại lỗi từ server
      let errorMessage = "Có lỗi xảy ra khi xóa PLO";
      
      if (error.message) {
        if (error.message.includes("CLO")) {
          errorMessage = "Không thể xóa PLO vì đang có CLO liên kết";
        } else if (error.message.includes("Học phần")) {
          errorMessage = "Không thể xóa PLO vì đang có Học phần liên kết";
        } else if (error.message.includes("Lớp học phần")) {
          errorMessage = "Không thể xóa PLO vì đang được sử dụng trong Lớp học phần";
        } else {
          errorMessage = error.message;
        }
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
    }
  };

  return (
    <Layout>
      <div style={styles.main}>
        <div style={styles.title}>
          <span>Danh sách PLO</span>
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
                placeholder="Tìm kiếm theo tên PLO..."
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
              />
            </Box>
        </div>
          <div style={styles.cbNganh}>
            <Autocomplete
              options={nganhItems}
              getOptionLabel={(option) => option.label || ""}
              value={nganhItems.find(item => item.value === comboBoxNganhId) || null}
              onChange={handleNganhChange}
              renderInput={(params) => (
                <TextField {...params} label="Chọn Ngành" size="small" />
              )}
            />
          </div>
          <div style={styles.btnCreate}>
            <Button 
              variant="contained" 
              onClick={handleOpenAddDialog}
              sx={{width: "100%"}}
            >
              Tạo PLO
            </Button>
          </div>
        </div>
        <div style={styles.table}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead sx={{position: 'sticky', top: 0, zIndex: 1, backgroundColor: "#0071A6"}}>
                <TableRow>
                  <StyledTableCell align="center">STT</StyledTableCell>
                  <StyledTableCell align="center">Tên PLO</StyledTableCell>
                  <StyledTableCell align="center">Mô tả</StyledTableCell>
                  <StyledTableCell align="center">Tên Ngành</StyledTableCell>
                  <StyledTableCell align="center">Thao tác</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{row.ten}</StyledTableCell>
                    <StyledTableCell align="center">{row.moTa}</StyledTableCell>
                    <StyledTableCell align="center">{row.tenNganh}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Tooltip title="Sửa PLO">
                        <IconButton onClick={() => handleOpenEditDialog(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa PLO">
                        <IconButton onClick={() => handleOpenDeleteDialog(row)}>
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

        <Dialog 
          open={openAddDialog} 
          onClose={handleCloseAddDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Tạo PLO mới:</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Thêm PLO mới vào hệ thống
            </DialogContentText>
            <TextField
              autoFocus
              required
              id="tenPLO"
              margin="dense"
              label="Tên PLO"
              fullWidth
              variant="standard"
              value={newPLO.ten}
              onChange={(e) => {
                setNewPLO({ ...newPLO, ten: e.target.value });
                setErrorTen(false);
              }}
              error={errorTen}
              helperText={errorTen ? "Vui lòng nhập tên PLO" : ""}
              autoComplete='off'
            />
            <TextField
              margin="dense"
              id="moTa"
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              variant="standard"
              value={newPLO.moTa}
              onChange={(e) => setNewPLO({ ...newPLO, moTa: e.target.value })}
              autoComplete='off'
            />
            <Autocomplete
              options={nganhItems}
              getOptionLabel={(option) => option.label || ""}
              value={nganhItems.find(item => item.value === newPLO.nganhId) || null}
              onChange={(event, newValue) => {
                setNewPLO({ ...newPLO, nganhId: newValue?.value || "" });
                setErrorNganh(false);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn Ngành"
                  variant="standard"
                  required
                  error={errorNganh}
                  helperText={errorNganh ? "Vui lòng chọn ngành" : ""}
                  margin="dense"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Hủy</Button>
            <Button onClick={handleAdd}>Lưu</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Xóa PLO
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn xóa PLO này không?
              <br />
            
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>
              Hủy
            </Button>
            <Button 
              onClick={handleDelete} 
              color="error" 
              variant="contained"
              autoFocus
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={openEditDialog} 
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Chỉnh sửa PLO</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Chỉnh sửa thông tin PLO
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              label="Tên PLO"
              fullWidth
              variant="standard"
              value={editingPLO.ten}
              onChange={(e) => {
                setEditingPLO({ ...editingPLO, ten: e.target.value });
                setErrorEditTen(false);
              }}
              error={errorEditTen}
              helperText={errorEditTen ? "Vui lòng nhập tên PLO" : ""}
              autoComplete='off'
            />
            <TextField
              margin="dense"
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              variant="standard"
              value={editingPLO.moTa}
              onChange={(e) => setEditingPLO({ ...editingPLO, moTa: e.target.value })}
              autoComplete='off'
            />
            <Autocomplete
              options={nganhItems}
              getOptionLabel={(option) => option.label || ""}
              value={nganhItems.find(item => item.value === editingPLO.nganhId) || null}
              onChange={(event, newValue) => {
                setEditingPLO({ ...editingPLO, nganhId: newValue?.value || "" });
                setErrorEditNganh(false);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn Ngành"
                  variant="standard"
                  required
                  error={errorEditNganh}
                  helperText={errorEditNganh ? "Vui lòng chọn ngành" : ""}
                  margin="dense"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Hủy</Button>
            <Button onClick={handleEdit}>Lưu</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
}
