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
import Box from '@mui/material/Box';
import { useState, useEffect,useRef } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  getAllFaculties
} from "@/api/api-faculties";
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../Layout';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { getCourses,createCourse,getCourseById,updateCourse } from "@/api/api-courses";
function HocPhanPage() 
{
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
      width: 35,
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [khoas, setKhoas] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [selectedKhoaFilter, setSelectedKhoaFilter] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [tenHocPhan, setTenHocPhan] = useState("");
  const [soTinChi, setSoTinChi] = useState("");
  const [selectedKhoa, setSelectedKhoa] = useState(null);
  const [errorTenHocPhan, setErrorTenHocPhan] = useState(false);
  const [errorSoTinChi, setErrorSoTinChi] = useState(false);
  const [errorMaHocPhan , setErrorMaHocPhan] = useState(false);
  const soTinChiRef = useRef("");
  const tenHocPhanRef = useRef("");
  const [maHocPhan, setMaHocPhan] = useState("");
  const [tenKhoa, setTenKhoa] = useState("");
  const [hocPhanId, setHocPhanId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // mặc định
  const pageSizeOptions = [20,50,100]; // các lựa chọn

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const startRow = startIndex + 1;
  const endRow = Math.min(endIndex, totalItems);

  const [anchorPosition, setAnchorPosition] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleOpenPopover = (event, rowId) => {
    setAnchorPosition({ top: event.clientY + 5, left: event.clientX + 5 });
    setSelectedRowId(rowId);
  };

  const handleClosePopover = () => {
    setAnchorPosition(null);
    setSelectedRowId(null);
  };


  const pagesToShow = () => {
    const pages = [];
    const total = totalPages;
  
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (page >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', total);
      }
    }
  
    return pages;
  };
  
  
  
  const handleOpenEditDialog = async(hocPhanId) => {
    const hocphan = await getCourseById(hocPhanId);
    console.log(hocphan);
    if(hocphan.status===200)
    {
     
      setTenHocPhan(hocphan.data.name);
      setSoTinChi(hocphan.data.credits);
      setSelectedKhoa(hocphan.data.facultyId);
      tenHocPhanRef.current = hocphan.data.name;
      soTinChiRef.current = hocphan.data.credits;
      setMaHocPhan(hocphan.data.code);
      setTenKhoa(hocphan.data.facultyName);
      setHocPhanId(hocPhanId);
      setOpenEditDialog(true);

    }
    else if(hocphan.status===404)
    {
      setSnackbarMessage("Không tìm thấy học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
    else
    {
      setSnackbarMessage("Lỗi không xác định");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseDialogEditHocPhans = () => {
    setOpenEditDialog(false);
    setTenHocPhan("");
    setSoTinChi("");
    setSelectedKhoa(null);
    setErrorTenHocPhan(false);
    setErrorSoTinChi(false);
    setTenKhoa("");
    tenHocPhanRef.current = "";
    soTinChiRef.current = "";

  };
  const handleOpenAddDialog = async() => {
    setOpenAddDialog(true);
  };
  const handleCloseDialogAddHocPhans = () => {
    setTenHocPhan("");
    setSoTinChi("");
    setSelectedKhoa(null);
    setErrorTenHocPhan(false);
    setErrorSoTinChi(false);
    setOpenAddDialog(false);
    setErrorMaHocPhan(false);
    setMaHocPhan("");
  };

  const handleKhoaChange = (event, newValue) => {
    setPage(1); // Reset page to 1 when filter changes
    setSelectedKhoaFilter(newValue);
    if (!newValue) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) => row.facultyName === newValue.name);
      setFilteredData(filtered);
    }
  };


  useEffect(() => {
    fetchData();
  }, []); 
  
  
  const fetchData = async () => {
    try {
      const hocphans = await getCourses();
      // Đảm bảo response từ API trả về thêm thông tin tenNganh
      setData(hocphans);
      setFilteredData(hocphans);
      const khoa = await getAllFaculties();
      setKhoas(khoa);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setSnackbarMessage("Không thể tải dữ liệu: " + error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
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
    setPage(1); // Reset page to 1 when search query changes
    const value = event.target.value;
    setSearchQuery(value); 
    filterData(value); 
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0071A6",
      color: theme.palette.common.white,
      borderRight: '1px solid #ddd', // Đường phân cách dọc

    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '5px 10px', // Thêm padding cho các hàng
      borderRight: '1px solid #ddd', // Đường phân cách dọc
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
    backgroundColor:"#D3F3FF", // Màu nền khi hover
    cursor: 'pointer', // Tùy chọn: Thêm hiệu ứng con trỏ
  },
  }));
   const columns = [
    { width: 50, label: "STT", dataKey: "index", align: "center" },
    { width: 150, label: "Mã Học Phần", dataKey: "maHocPhan", align: "center" },
    { label: "Tên Học Phần", dataKey: "tenHocPhan", align: "left" },
    { width: 100, label: "Số Tín Chỉ", dataKey: "soTinChi", align: "center" },
    { width: 200, label: "Tên Khoa", dataKey: "tenKhoa", align: "center" },
    { width: 150, label: "", dataKey: "actions", align: "center" },
  ];

  const handleAddSubmit = async () => {
    if (tenHocPhan.trim() === "") {
      setErrorTenHocPhan(true);
      setSnackbarMessage("Vui lòng nhập tên học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    if (maHocPhan.trim() === "") {
      setErrorMaHocPhan(true);
      setSnackbarMessage("Vui lòng nhập mã học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    if (soTinChi.trim() === "") {
      setErrorSoTinChi(true);
      setSnackbarMessage("Vui lòng nhập số tín chỉ");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    if (!selectedKhoa) {
      setSnackbarMessage("Vui lòng chọn khoa");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    const courseData = {
      name: tenHocPhan,
      code: maHocPhan,
      credits: parseFloat(soTinChi),
      facultyId: selectedKhoa.id,
    };
    try {
      const response = await createCourse(courseData);
  
      if (response.status === 201) {
        setSnackbarMessage("Thêm học phần thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogAddHocPhans();
        fetchData();
      } else {
        setSnackbarMessage(" Thêm học phần thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(` ${error.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  
  const handleSubmitEdit = async () => {
    const nameValue = tenHocPhanRef.current?.trim() || "";
    const creditsValue = String(soTinChiRef.current || "").trim();
  
    if (nameValue === "") {
      setErrorTenHocPhan(true);
      setSnackbarMessage("Vui lòng nhập tên học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    if (creditsValue === "") {
      setErrorSoTinChi(true);
      setSnackbarMessage("Vui lòng nhập số tín chỉ");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    const hocphanData = {
      name: nameValue,
      credits: parseFloat(creditsValue),
      // Optional: code, facultyId nếu cần sửa thêm
      // code: maHocPhanRef.current?.trim(), // nếu có ref mã học phần
      // facultyId: selectedKhoa?.id ?? null
    };
  
    try {
      const response = await updateCourse(hocPhanId, hocphanData);
      if (response.status === 200) {
        setSnackbarMessage("Cập nhật học phần thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogEditHocPhans();
        fetchData(); // Refresh lại danh sách
      } else {
        setSnackbarMessage("Cập nhật học phần thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };



 

  return (
    <Layout>
      <div style={styles.main}>
      <div style={styles.title}>
        <span>Danh sách học phần</span>
        <div style={styles.btnMore}>
          <IconButton aria-label="more actions" size='small'><MoreVertIcon fontSize='small'/></IconButton>
        </div>
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
              placeholder="Tìm kiếm theo tên học phần..."
              variant="standard"
              autoComplete='off'
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <React.Fragment>
                    <IconButton aria-label="more actions">
                      <SearchIcon sx={{ color: "#888" }} />
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
          sx={{ width: "100%" }}
          options={khoas}
          getOptionLabel={(option) => option.name || ""}
          required
          // disableClearable
          value={selectedKhoaFilter}
          onChange={handleKhoaChange}
          renderInput={(params) => (
            <TextField {...params} label="Chọn khoa" size="small" />
          )}
        />


        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained" onClick={()=>{handleOpenAddDialog()}} >Tạo học phần</Button>
          <Dialog id='themHocPhan' fullWidth open={openAddDialog} onClose={handleCloseDialogAddHocPhans}>
                      <DialogTitle>Tạo học phần mới:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Thêm học phần mới vào hệ thống
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenHocPhan'
                          margin="dense"
                          label="Tên học phần"
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setTenHocPhan(e.target.value.trim())}
                          error={errorTenHocPhan}
                          onInput={(e) => setErrorTenHocPhan(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập tên học phần"
                          autoComplete='off'
                        />
                        <TextField
                          autoFocus
                          required
                          id='maHocPhan'
                          margin="dense"
                          label="Mã học phần"
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setMaHocPhan(e.target.value.trim())}
                          error={errorMaHocPhan}
                          onInput={(e) => setErrorMaHocPhan(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập mã học phần"
                          autoComplete='off'
                        />
                        <TextField
                          autoFocus
                          required
                          id="soTinChi"
                          margin="dense"
                          label="Số tín chỉ"
                          variant="standard"
                          inputRef={soTinChiRef}
                          onChange={(e) => {
                            const value = e.target.value;
                            
                            // Cho phép số thập phân (chỉ 1 dấu '.')
                            if (/^\d*\.?\d*$/.test(value)) {
                              soTinChiRef.current = value; 
                              setErrorSoTinChi(false);
                            } else {
                              soTinChiRef.current = ""; 
                              e.target.value = ""; 
                              setErrorSoTinChi(true);
                            }
                          }}
                          onBlur={(e) => setSoTinChi(e.target.value.trim())}
                          inputProps={{ maxLength: 3 }}
                          error={errorSoTinChi}
                          helperText={errorSoTinChi ? "Vui lòng nhập số hợp lệ" : "Vui lòng nhập số tín chỉ"}  
                          autoComplete="off"
                        />


                       <Autocomplete
                          options={khoas}
                          getOptionLabel={(option) => option.name || ''}
                          noOptionsText="Không tìm thấy khoa"
                          required
                          id="disable-clearable"
                          disableClearable
                          onChange={(event, newValue) => setSelectedKhoa(newValue)} // Cập nhật state khi chọn khoa
                          renderInput={(params) => (
                            <TextField {...params} label="Chọn khoa" variant="standard" />
                          )}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialogAddHocPhans}>Hủy</Button>
                        <Button
                          onClick={()=>{handleAddSubmit()}}
                        >
                          Lưu
                        </Button>
                      </DialogActions>
                    </Dialog>
        </div>
      </div>
      <div style={styles.table}>
      <TableContainer component={Paper}>
  <Table sx={{ minWidth: 700 }} aria-label="customized table">
    <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#0071A6" }}>
      <TableRow>
        {columns.map((col) => (
          <StyledTableCell key={col.dataKey} align={col.align || "center"}>
            {col.label}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
  {paginatedData.map((row, index) => (
    <StyledTableRow key={row.id}>
      <StyledTableCell align="center">{(page - 1) * pageSize + index + 1}</StyledTableCell>
      <StyledTableCell align="center">{row.code}</StyledTableCell>
      <StyledTableCell align="left">{row.name}</StyledTableCell>
      <StyledTableCell align="center">{row.credits}</StyledTableCell>
      <StyledTableCell align="center">{row.facultyName}</StyledTableCell>
      <StyledTableCell align="center">
        <IconButton
          size="small"
          onClick={(e) => handleOpenPopover(e, row.id)}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>

        {/* Chỉ hiển thị popover nếu đúng hàng */}
        {selectedRowId === row.id && (
          <Popover
            open={Boolean(anchorPosition)}
            anchorReference="anchorPosition"
            anchorPosition={anchorPosition}
            onClose={handleClosePopover}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { p: 1.5, minWidth: 120 } }}
          >
            <MenuItem
              onClick={() => {
                handleOpenEditDialog(row.id);
                handleClosePopover();
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Sửa
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleOpenEditDialog(row.id);
                handleClosePopover();
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Quản lý CLO
            </MenuItem>
          </Popover>
        )}
      </StyledTableCell>
    </StyledTableRow>
  ))}
</TableBody>

  </Table>
</TableContainer>

     {/* <TableVirtuoso
      data={filteredData}
      components={VirtuosoTableComponents}
      fixedHeaderContent={fixedHeaderContent}
      itemContent={rowContent}
    /> */}

     <Dialog id='suaHocPhan' fullWidth open={openEditDialog} onClose={handleCloseDialogEditHocPhans}>
                      <DialogTitle>Sửa học phần:</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Sửa thông tin học phần
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='maHocPhan'
                          margin="dense"
                          label="Mã học phần"
                          fullWidth
                          variant="standard"
                          defaultValue={maHocPhan}
                          helperText="Mã học phần không thể thay đổi"
                          autoComplete='off'
                          focused={false}
                          InputProps={{ readOnly: true }}
                        />
                        <TextField
                          autoFocus
                          required
                          id='tenHocPhan'
                          margin="dense"
                          label="Tên học phần"
                          fullWidth
                          variant="standard"
                          defaultValue={tenHocPhan}
                          onChange={(e) => {
                            tenHocPhanRef.current = e.target.value;
                            setErrorTenHocPhan(e.target.value.trim() === "");
                          }}
                          error={errorTenHocPhan}
                          helperText={errorTenHocPhan ? "Vui lòng nhập tên học phần" : ""}
                          autoComplete='off'
                        />
                        <TextField
                          autoFocus
                          required
                          id="soTinChi"
                          margin="dense"
                          label="Số tín chỉ"
                          variant="standard"
                          defaultValue={soTinChi}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                              soTinChiRef.current = value;
                              setErrorSoTinChi(false);
                            } else {
                              soTinChiRef.current = "";
                              e.target.value = "";
                              setErrorSoTinChi(true);
                            }
                          }}
                          error={errorSoTinChi}
                          helperText={errorSoTinChi ? "Vui lòng nhập số hợp lệ" : ""}
                          autoComplete='off'
                          inputProps={{ maxLength: 5 }}
                        />
                        <TextField
                          autoFocus
                          required
                          id='tenKhoa'
                          margin="dense"
                          label="Thuộc khoa"
                          fullWidth
                          variant="standard"
                          defaultValue={tenKhoa}
                          helperText="Không thể thay đổi khoa"
                          autoComplete='off'
                          focused={false}
                          InputProps={{ readOnly: true }}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialogEditHocPhans}>HỦY</Button>
                        <Button onClick={handleSubmitEdit}>LƯU</Button>
                      </DialogActions>
                    </Dialog>
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
      
      </div>
      <div style={styles.divPagination}>
  <Box display="flex" alignItems="center">
    {/* Previous */}
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

    {/* Page buttons */}
    {pagesToShow().map((item, idx) =>
      item === '...' ? (
        <Box key={`ellipsis-${idx}`} sx={{ ...styles.squareStyle, pointerEvents: 'none' }}>
          <MoreHorizIcon fontSize="small" />
        </Box>
      ) : (
        <Box
          key={`page-${item}`}
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

    {/* Next */}
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

  {/* Selector + label */}
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
    <span style={{ fontSize: 14, color: '#333' }}>
      Dòng {startRow} đến {endRow} / {totalItems}
    </span>
  </Box>
</div>

    </div>
    </Layout>
  );
};

export default HocPhanPage;
