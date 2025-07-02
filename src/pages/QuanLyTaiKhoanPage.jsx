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
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Layout from "./Layout";
import { getAllChucVus } from "@/api/api-chucvu";
import {
  getAccountsByRole,
  // getAllAccounts,
  deleteAccount,
  createAccount,
  updateAccount,
} from "@/api/api-accounts";
import { ComboBox } from "@/components/ComboBox";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getRole } from "@/utils/storage";
import { resetAccountPassword } from "@/api/api-accounts";
import { useToast } from "@/hooks/use-toast";
import HelpIcon from '@mui/icons-material/Help';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

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

export default function QuanLyTaiKhoanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chucVuIdParam = searchParams.get("chucVuId");
  const [data, setData] = React.useState([]);
  const [chucVuItems, setchucVuItems] = React.useState([]);
  const [chucVuId, setchucVuId] = React.useState(chucVuIdParam);
  const [comboBoxChucVuId, setComboBoxChucVuId] = React.useState(chucVuIdParam);
  const role = getRole();
  const { toast } = useToast();
  const [openHelp, setOpenHelp] = React.useState(false);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [tenTaiKhoan, setTenTaiKhoan] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [selectedChucVu, setSelectedChucVu] = React.useState(null);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editingTaiKhoan, setEditingTaiKhoan] = React.useState(null);
  const [usernameError, setUsernameError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deletingTaiKhoan, setDeletingTaiKhoan] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const [filteredData, setFilteredData] = React.useState([]);

  const fetchData = React.useCallback(async () => {
    try {
    const dataChucVu = await getAllChucVus();
    const mappedComboBoxItems = dataChucVu.map((chucVu) => ({
      label: chucVu.tenChucVu,
      value: chucVu.id,
    }));
    setchucVuItems(mappedComboBoxItems);
      
      const taiKhoans = await getAccountsByRole(chucVuId);
      // Sắp xếp tài khoản theo chức vụ và tên
      const sortedTaiKhoans = taiKhoans.sort((a, b) => {
        // Đầu tiên sắp xếp theo tên chức vụ
        if (a.tenChucVu < b.tenChucVu) return -1;
        if (a.tenChucVu > b.tenChucVu) return 1;
        // Nếu cùng chức vụ thì sắp xếp theo tên tài khoản
        return a.ten.localeCompare(b.ten);
      });
      
      setData(sortedTaiKhoans);
      setFilteredData(sortedTaiKhoans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [chucVuId]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoClick = () => {
    setchucVuId(comboBoxChucVuId);
    if (comboBoxChucVuId === null) {
      // Khi hiển thị tất cả, vẫn giữ nguyên thứ tự nhóm theo chức vụ
      setFilteredData(data);
      navigate(`/quanlytaikhoan`);
      return;
    }
    const filtered = data
      .filter((taiKhoan) => taiKhoan.chucVuId === comboBoxChucVuId)
      .sort((a, b) => a.ten.localeCompare(b.ten)); // Sắp xếp theo tên trong cùng một chức vụ
    setFilteredData(filtered);
    navigate(`/quanlytaikhoan?chucVuId=${comboBoxChucVuId}`);
  };

  const handleReset = async (id) => {
    try {
      await resetAccountPassword(id);
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Thành công",
      description: "Đặt lại mật khẩu thành công",
      variant: "success",
    });
  };

  const handleOpenHelp = () => {
    setOpenHelp(true);
  };

  const handleCloseHelp = () => {
    setOpenHelp(false);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setTenTaiKhoan("");
    setUsername("");
    setPassword("");
    setSelectedChucVu(null);
  };

  const handleSubmitAdd = async () => {
    if (!tenTaiKhoan || !username || !password || !selectedChucVu) {
      setSnackbarMessage("Vui lòng điền đầy đủ thông tin");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const newTaiKhoan = {
      ten: tenTaiKhoan.trim(),
      username: username.trim(),
      password: password,
      chucVuId: selectedChucVu.value
    };

    try {
      await createAccount(newTaiKhoan);
      setSnackbarMessage("Thêm tài khoản thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseAddDialog();
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Có lỗi xảy ra";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenEditDialog = (taiKhoan) => {
    setEditingTaiKhoan(taiKhoan);
    setTenTaiKhoan(taiKhoan.ten);
    setSelectedChucVu(chucVuItems.find(item => item.value === taiKhoan.chucVuId));
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingTaiKhoan(null);
    setTenTaiKhoan("");
    setSelectedChucVu(null);
  };

  const validateUsername = (username) => {
    const pattern = /^[a-zA-Z0-9_]{5,100}$/;
    return pattern.test(username);
  };

  const validatePassword = (password) => {
    const pattern = /^(?=.*[A-Z])(?=.*[\W_])[^\s]{6,}$/;
    return pattern.test(password);
  };

  const handleSubmitEdit = async () => {
    setUsernameError("");
    setPasswordError("");
    
    if (username !== editingTaiKhoan.username && !validateUsername(username)) {
      setUsernameError("Username phải có ít nhất 5 ký tự, chỉ chứa chữ, số và dấu '_'");
      return;
    }

    if (password && !validatePassword(password)) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự, 1 ký tự viết hoa, 1 ký tự đặc biệt và không chứa khoảng trắng");
      return;
    }

    const updatedTaiKhoan = {};
    
    if (tenTaiKhoan !== editingTaiKhoan.ten) {
      updatedTaiKhoan.ten = tenTaiKhoan.trim();
    }
    
    if (username !== editingTaiKhoan.username) {
      updatedTaiKhoan.username = username.trim();
    }
    
    if (password) {
      updatedTaiKhoan.password = password;
    }
    
    if (selectedChucVu.value !== editingTaiKhoan.chucVuId) {
      updatedTaiKhoan.chucVuId = selectedChucVu.value;
    }

    try {
      await updateAccount(editingTaiKhoan.id, updatedTaiKhoan);
      setSnackbarMessage("Cập nhật tài khoản thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseEditDialog();
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Có lỗi xảy ra";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenDeleteDialog = (taiKhoan) => {
    setDeletingTaiKhoan(taiKhoan);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletingTaiKhoan(null);
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(deletingTaiKhoan.id);
      setSnackbarMessage("Xóa tài khoản thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Có lỗi xảy ra";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);

  // Thêm hàm mới để tính STT cho mỗi tài khoản trong nhóm chức vụ
  const getSTTInGroup = (row) => {
    // Tìm tất cả các tài khoản cùng chức vụ
    const sameRoleAccounts = filteredData.filter(
      account => account.tenChucVu === row.tenChucVu
    );
    // Tìm vị trí của tài khoản hiện tại trong nhóm chức vụ
    return sameRoleAccounts.findIndex(account => account.id === row.id) + 1;
  };

  return (
    <Layout>
      <div style={styles.main}>
        <div style={styles.title}>
          <span>Quản lý tài khoản</span>
          <div style={styles.btnMore}>
            <IconButton aria-label="more actions"><MoreVertIcon/></IconButton>
          </div>
        </div>

        <div style={styles.tbActions}>
          <div style={styles.ipSearch}>
          <ComboBox
            items={chucVuItems}
            setItemId={setComboBoxChucVuId}
            initialItemId={comboBoxChucVuId}
            placeholder="Chọn chức vụ"
          />
          </div>
          <Button 
            variant="contained" 
            onClick={handleGoClick}
            sx={{ marginLeft: '10px' }}
          >
            Tìm kiếm
          </Button>
          <Tooltip title="Thông tin mật khẩu mặc định">
            <IconButton 
              onClick={handleOpenHelp}
              sx={{ marginLeft: 'auto' }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
          {(role === "Admin" || role === "PhongDaoTao") && (
            <Button 
              variant="contained" 
              onClick={handleOpenAddDialog}
              sx={{ marginLeft: '10px' }}
            >
              Tạo tài khoản
            </Button>
          )}
        </div>

        <Dialog
          open={openHelp}
          onClose={handleCloseHelp}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Thông tin mật khẩu mặc định"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
          <p>Mật khẩu Giảng viên mặc định là: Gv@ + Mã Giảng Viên</p>
          <p>Mật khẩu Sinh viên mặc định là: Sv@ + Mã Sinh Viên</p>
          <p>Mật khẩu Vai trò khác mặc định là: Password@123456</p>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          fullWidth
        >
          <DialogTitle>Tạo tài khoản mới</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Thêm tài khoản mới vào hệ thống
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              label="Tên người dùng"
              fullWidth
              variant="standard"
              value={tenTaiKhoan}
              onChange={(e) => setTenTaiKhoan(e.target.value)}
              helperText="Vui lòng nhập tên người dùng"
              autoComplete='off'
            />
            <TextField
              required
              margin="dense"
              label="Tên đăng nhập"
              fullWidth
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              helperText="Vui lòng nhập tên đăng nhập"
              autoComplete='off'
            />
            <TextField
              required
              margin="dense"
              label="Mật khẩu"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Vui lòng nhập mật khẩu"
              autoComplete='off'
            />
            <Autocomplete
              options={chucVuItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedChucVu}
              onChange={(event, newValue) => setSelectedChucVu(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn chức vụ"
                  variant="standard"
                  margin="dense"
                  required
                  helperText="Chức vụ của tài khoản"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Hủy</Button>
            <Button onClick={handleSubmitAdd}>Lưu</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth
        >
          <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Chỉnh sửa thông tin tài khoản
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              label="Tên người dùng"
              fullWidth
              variant="standard"
              value={tenTaiKhoan}
              onChange={(e) => setTenTaiKhoan(e.target.value)}
              helperText="Vui lòng nhập tên người dùng"
              autoComplete='off'
            />
            <TextField
              required
              margin="dense"
              label="Tên đăng nhập"
              fullWidth
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              helperText={usernameError || "Tên đăng nhập phải có ít nhất 5 ký tự"}
              error={!!usernameError}
              autoComplete='off'
            />
            <TextField
              margin="dense"
              label="Mật khẩu mới"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={passwordError || "Để trống nếu không muốn thay đổi mật khẩu"}
              error={!!passwordError}
              autoComplete='off'
            />
            <Autocomplete
              options={chucVuItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedChucVu}
              onChange={(event, newValue) => setSelectedChucVu(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn chức vụ"
                  variant="standard"
                  margin="dense"
                  required
                  helperText="Chức vụ của tài khoản"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Hủy</Button>
            <Button onClick={handleSubmitEdit}>Lưu</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Xác nhận xóa tài khoản"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn xóa tài khoản "{deletingTaiKhoan?.ten}" không?
              <br />
              Hành động này không thể hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
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

        <div style={styles.table}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead sx={{position: 'sticky', top: 0, zIndex: 1, backgroundColor: "#0071A6"}}>
                <TableRow>
                  <StyledTableCell align="center">STT</StyledTableCell>
                  <StyledTableCell align="center">Tên</StyledTableCell>
                  <StyledTableCell align="center">Username</StyledTableCell>
                  <StyledTableCell align="center">Chức Vụ</StyledTableCell>
                  <StyledTableCell align="center">Thao tác</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  let currentChucVu = null;
                  
                  return paginatedData.map((row, index) => {
                    // Kiểm tra xem có phải đầu nhóm chức vụ mới không
                    const isNewChucVu = currentChucVu !== row.tenChucVu;
                    if (isNewChucVu) {
                      currentChucVu = row.tenChucVu;
                      
                      return (
                        <React.Fragment key={`group-${row.chucVuId}`}>
                          <TableRow>
                            <StyledTableCell
                              colSpan={5}
                              sx={{
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                                color: '#0071A6'
                              }}
                            >
                              {row.tenChucVu}
                            </StyledTableCell>
                          </TableRow>
                          <StyledTableRow key={row.id}>
                            <StyledTableCell align="center">{getSTTInGroup(row)}</StyledTableCell>
                            <StyledTableCell align="center">{row.ten}</StyledTableCell>
                            <StyledTableCell align="center">{row.username}</StyledTableCell>
                            <StyledTableCell align="center">{row.tenChucVu}</StyledTableCell>
                            <StyledTableCell align="center">
                              <Tooltip title="Sửa tài khoản">
                                <IconButton onClick={() => handleOpenEditDialog(row)}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Đặt lại mật khẩu mặc định">
                                <IconButton onClick={() => handleReset(row.id)}>
                                  <RestartAltIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa tài khoản">
                                <IconButton onClick={() => handleOpenDeleteDialog(row)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableRow>
                        </React.Fragment>
                      );
                    }
                    
                    return (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell align="center">{getSTTInGroup(row)}</StyledTableCell>
                        <StyledTableCell align="center">{row.ten}</StyledTableCell>
                        <StyledTableCell align="center">{row.username}</StyledTableCell>
                        <StyledTableCell align="center">{row.tenChucVu}</StyledTableCell>
                        <StyledTableCell align="center">
                          <Tooltip title="Sửa tài khoản">
                            <IconButton onClick={() => handleOpenEditDialog(row)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Đặt lại mật khẩu mặc định">
                            <IconButton onClick={() => handleReset(row.id)}>
                              <RestartAltIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa tài khoản">
                            <IconButton onClick={() => handleOpenDeleteDialog(row)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Stack spacing={2} sx={{ padding: "20px 0", display: "flex", alignItems: "center" }}>
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </div>
      </div>
    </Layout>
  );
}
