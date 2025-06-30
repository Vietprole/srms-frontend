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
import { useSearchParams } from "react-router-dom";
import {
  getSinhViens,
  deleteSinhVien,
  addSinhVien,
  updateSinhVien,
  getSinhVienById
} from "@/api/api-sinhvien";
import { getAllKhoas } from "@/api/api-khoa";
import { getAllNganhs } from "@/api/api-nganh";
import { getGiangVienId, getRole } from "@/utils/storage";
import { getNganhsByKhoaId } from "@/api/api-nganh"; 
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const role = getRole();
const giangVienId = getGiangVienId();

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
    width: '25%',
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
    width: '15%',
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
    backgroundColor:"#D3F3FF",
    cursor: 'pointer',
  },
}));

export default function SinhVienPage() {
  const [searchParams] = useSearchParams();
  const lopHocPhanIdParam = searchParams.get("lopHocPhanId");
  const khoaIdParam = searchParams.get("khoaId");
  const nganhIdParam = searchParams.get("nganhId");
  const [data, setData] = useState([]);
  const [khoaItems, setKhoaItems] = useState([]);
  const [nganhItems, setNganhItems] = useState([]);
  const [khoaId, setKhoaId] = useState(khoaIdParam);
  const [lopHocPhanId, setLopHocPhanId] = useState(lopHocPhanIdParam);
  const [nganhId, setNganhId] = useState(nganhIdParam);
  
  useEffect(() => {
    setKhoaId(khoaIdParam);
  }, [khoaIdParam]);
  
  useEffect(() => {
    setLopHocPhanId(lopHocPhanIdParam);
  }, [lopHocPhanIdParam]);
  
  useEffect(() => {
    setNganhId(nganhIdParam);
  }, [nganhIdParam]);
  

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [tenSinhVien, setTenSinhVien] = useState("");
  const [selectedKhoa, setSelectedKhoa] = useState(null);
  const [selectedNganh, setSelectedNganh] = useState(null);
  const [namNhapHoc, setNamNhapHoc] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // tùy chọn mặc định
  const pageSizeOptions = [10,20,50]; // tuỳ bạn thêm số lựa chọn

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

  const fetchData = useCallback(async () => {
    const dataKhoa = await getAllKhoas();
    const mappedKhoaItems = dataKhoa.map(khoa => ({ label: khoa.ten, value: khoa.id }));
    setKhoaItems(mappedKhoaItems);

    const dataNganh = await getAllNganhs();
    const mappedNganhItems = dataNganh.map(nganh => ({ label: nganh.ten, value: nganh.id }));
    setNganhItems(mappedNganhItems);

    if (role === "GiangVien" && giangVienId != 0) {

      const dataSinhVien = await getSinhViens(khoaId, nganhId, lopHocPhanId);
      setData(dataSinhVien);
      setFilteredData(dataSinhVien);
      return;
    }

    const dataSinhVien = await getSinhViens(khoaId, nganhId, lopHocPhanId);
    console.log("dataSinhVien: ", dataSinhVien);
    setData(dataSinhVien);
    setFilteredData(dataSinhVien);
  }, [khoaId, nganhId, lopHocPhanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleKhoaChange = async (event, newValue) => {
    setPage(1);
    setSelectedKhoa(newValue);
    setSelectedNganh(null);
    
    if (newValue) {
      const dataNganh = await getNganhsByKhoaId(newValue.value);
      const mappedNganhItems = dataNganh.map(nganh => ({
        label: nganh.ten,
        value: nganh.id
      }));
      setNganhItems(mappedNganhItems);
    } else {
      setNganhItems([]);
    }
    
    filterData(newValue, null);
  };

  // const handleNganhChange = (event, newValue) => {
  //   setSelectedNganh(newValue);
  //   filterData(selectedKhoa, newValue);
  // };

  const filterData = (khoa, nganh) => {
    let filteredData = data;

    if (khoa) {
      filteredData = filteredData.filter((sinhVien) => sinhVien.khoaId === khoa.value);
    }

    if (nganh) {
      filteredData = filteredData.filter((sinhVien) => sinhVien.nganhId === nganh.value);
    }

    setFilteredData(filteredData);
  };

  const handleKhoaChangeInForm = async (event, newValue) => {
    setSelectedKhoa(newValue);
    setSelectedNganh(null);

    if (newValue) {
      const dataNganh = await getNganhsByKhoaId(newValue.value);
      const mappedNganhItems = dataNganh.map(nganh => ({
        label: nganh.ten,
        value: nganh.id
      }));
      setNganhItems(mappedNganhItems);
    } else {
      setNganhItems([]);
    }
  };
  return (
    <Layout>
      <div style={styles.main}>
        <div style={styles.title}>
          <span>Danh sách sinh viên</span>
        </div>
        <Box
  sx={{
    width: "100%",
    mt: 1,
    display: "flex",
    alignItems: "center",
    gap: 2,
    pb: 1,
  }}
>
  {/* Ô tìm kiếm */}
  <Box sx={{ width: "25%", height: 40 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "2px solid #ccc",
        borderRadius: "20px",
        px: 1,
        height: "100%",
        "&:focus-within": {
          border: "2px solid #337AB7",
        },
      }}
    >
      <TextField
        fullWidth
        placeholder="Tìm kiếm theo tên sinh viên..."
        variant="standard"
        autoComplete="off"
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
  </Box>

  {/* Dropdown chọn Khoa */}
  <Box sx={{ width: "22%", height: 40 }}>
    <Autocomplete
      options={khoaItems}
      getOptionLabel={(option) => option.label || ""}
      value={selectedKhoa}
      onChange={handleKhoaChange}
      renderInput={(params) => (
        <TextField {...params} label="Chọn Khoa" size="small" />
      )}
    />
  </Box>

  {/* Dropdown chọn Ngành */}
  {selectedKhoa && (
    <Box sx={{ width: "22%", height: 40 }}>
      <Autocomplete
        options={nganhItems}
        getOptionLabel={(option) => option.label || ""}
        value={selectedNganh}
        onChange={(event, newValue) => {
          setPage(1);
          setSelectedNganh(newValue);
          filterData(selectedKhoa, newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Chọn Ngành" size="small" />
        )}
      />
    </Box>
  )}
  {(role === "Admin" || role === "PhongDaoTao") && (
    <Box
      sx={{
        width: "15%",
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ml: "auto",
      }}
    >
      <Button
        variant="contained"
        onClick={handleOpenAddDialog}
        fullWidth
        sx={{ height: "100%" }}
      >
        Tạo sinh viên
      </Button>
    </Box>
  )}
</Box>


        <div style={styles.table}>
        {/* <TableVirtuoso
  data={filteredData}
  components={VirtuosoTableComponents}
  fixedHeaderContent={fixedHeaderContent}
  itemContent={rowContent}
  style={{ width: "100%", height: "calc(100vh - 00px)" }}
/> */}

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
                {paginatedData.map((row, index) => (
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
                          <IconButton onClick={() => handleOpenEditDialog(row.id)} size='small'>
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa sinh viên">
                          <IconButton onClick={() => handleOpenDeleteDialog(row.id)} size='small'>
                            <DeleteIcon fontSize='small' />
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

        <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth>
          <DialogTitle>Tạo sinh viên mới:</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Thêm sinh viên mới vào hệ thống
            </DialogContentText>
            
            <TextField
              required
              margin="dense"
              label="Tên sinh viên"
              fullWidth
              variant="standard"
              value={tenSinhVien}
              onChange={(e) => setTenSinhVien(e.target.value)}
              helperText="Vui lòng nhập tên sinh viên"
              autoComplete='off'
            />
            
            <Autocomplete
              options={khoaItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedKhoa}
              onChange={handleKhoaChangeInForm}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Chọn khoa" 
                  variant="standard"
                  margin="dense"
                  required
                  helperText="Khoa của sinh viên"
                />
              )}
            />

            {selectedKhoa && (
              <Autocomplete
                options={nganhItems}
                getOptionLabel={(option) => option.label || ""}
                value={selectedNganh}
                onChange={(event, newValue) => setSelectedNganh(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Chọn ngành" 
                    variant="standard"
                    margin="dense"
                    required
                    helperText="Ngành sinh viên nhập học"
                  />
                )}
              />
            )}

            <TextField
              required
              margin="dense"
              label="Năm nhập học"
              type="number"
              fullWidth
              variant="standard"
              value={namNhapHoc}
              onChange={(e) => setNamNhapHoc(e.target.value)}
              helperText="Năm sinh viên nhập học"
              autoComplete='off'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>HỦY</Button>
            <Button onClick={handleSubmitAdd}>LƯU</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth>
          <DialogTitle>Sửa sinh viên:</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Cập nhật thông tin sinh viên
            </DialogContentText>
            
            <TextField
              required
              margin="dense"
              label="Tên sinh viên"
              fullWidth
              variant="standard"
              value={tenSinhVien}
              onChange={(e) => setTenSinhVien(e.target.value)}
              helperText="Vui lòng nhập tên sinh viên"
              autoComplete='off'
            />
            
            <Autocomplete
              options={khoaItems}
              getOptionLabel={(option) => option.label || ""}
              value={selectedKhoa}
              onChange={handleKhoaChangeInForm}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Chọn khoa" 
                  variant="standard"
                  margin="dense"
                  required
                  helperText="Khoa của sinh viên"
                />
              )}
            />

            {selectedKhoa && (
              <Autocomplete
                options={nganhItems}
                getOptionLabel={(option) => option.label || ""}
                value={selectedNganh}
                onChange={(event, newValue) => setSelectedNganh(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Chọn ngành" 
                    variant="standard"
                    margin="dense"
                    required
                    helperText="Ngành sinh viên nhập học"
                  />
                )}
              />
            )}

            <TextField
              required
              margin="dense"
              label="Năm nhập học"
              type="number"
              fullWidth
              variant="standard"
              value={namNhapHoc}
              onChange={(e) => setNamNhapHoc(e.target.value)}
              helperText="Năm sinh viên nhập học"
              autoComplete='off'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>HỦY</Button>
            <Button onClick={handleSubmitEdit}>LƯU</Button>
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
