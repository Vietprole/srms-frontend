/* eslint-disable react/display-name */
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
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Fade, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { useState, useEffect,useRef } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  getAllKhoas
} from "@/api/api-khoa";
import {
  getNganhs,
  addNganh,
  getNganhById,
  updateNganh
} from "@/api/api-nganh";
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../Layout';
import TestDialog from '@/components/DialogHocPhan';
import { TableVirtuoso } from "react-virtuoso";
function TestPage() 
{
  const styles = {
    main:
    {
      width: '100%',
      height: '91vh',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'hidden',
      padding: "10px",
    },
    title:
    {
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
    btnMore:
    {
      display: 'flex',
      justifyContent: 'flex-end',
      marginLeft: 'auto',
    },
    tbActions:
    {
      width: '100%',
      height: '6%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
    },
    ipSearch:
    {
      width: '25%',
      height: '100%',
      justifyContent: 'flex-start',
      borderRadius: '5px',
    },
    btnCreate:
    {
      width: '10%',
      height: '100%',
      display: 'flex',
      marginLeft: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      color: 'white',
      cursor: 'pointer',
    },
    table:
    {
      width: '100%',
      height: '100vb',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '10px',
      overflowY: 'auto',
    },
    cbKhoa:
    {
      width: '22%',
      height: '80%',
      marginLeft: '10px',
      marginBottom: '10px',
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

  const handleKhoaChange = (event, newValue) => {
    setSelectedKhoaFilter(newValue);
    if (!newValue) {
      setFilteredData(data); // Nếu không chọn khoa nào, hiển thị toàn bộ dữ liệu
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
  }

  const handleClickOpenEdit = async (id) => {
    const nganh = await getNganhById(id);
    setTenNganh(nganh.ten);
    setMaNganh(nganh.maNganh);
    setSelectedKhoa(nganh.tenKhoa);
    inputRef.current = nganh.ten;
    setOpenEditNganh(true);
    setNganhId(id);
  }

  const handleAddNganhs = async() => {
    const khoas = await getAllKhoas(); // Đợi API trả về dữ liệu
    setKhoas(khoas);
    setOpenAddNganh(true);
  };

  const handleCloseEditNganh = () => {
    setOpenEditNganh(false);
    setErrorTenNganh(false);
    setSelectedKhoa(null);
    setTenNganh("");
    setMaNganh("");
    setNganhId("");
  }



  const handleCloseNganhs = () => {
    setOpenAddNganh(false);
    setErrorTenNganh(false);
    setSelectedKhoa(null);
  };
  const handleSubmit =async  () => {
    if (tenNganh.trim() === "") {
      setSnackbarMessage("Tên ngành không được để trống");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setErrorTenNganh(true);
      return;
    }
    if(selectedKhoa === null)
    {
      setSnackbarMessage("Vui lòng chọn khoa");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const nganhData = {
      ten: tenNganh.trim(),
      khoaId: selectedKhoa.id
    };
    
    try {
      const response =  await addNganh(nganhData);  
      if (response.status === 201) {  
        setSnackbarMessage("Thêm ngành thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        fetchData();
        handleCloseNganhs();

      }
      else if(response.status === 409)
      {
        setSnackbarMessage("Ngành đã tồn tại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
       else {
        setSnackbarMessage("Lỗi: Không thể thêm ngành");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.log("error: ", error);
      setSnackbarMessage("Lỗi: Không thể thêm ngành");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const nganhs = await getNganhs();
    setData(nganhs);
    const khoa = await getAllKhoas();
    setKhoas(khoa);
  };
  
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
      setSnackbarMessage("Tên ngành không được để trống");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setErrorTenNganh(true);
      return;
    }
    const nganhData = {
      ten: inputRef.current.trim(),
    };
    try {
      const response = await updateNganh(nganhId,nganhData);
      if (response.status === 200) {
        setSnackbarMessage("Sửa tên ngành thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        fetchData();
        handleCloseEditNganh();
      }
      else if (response.status === 404) {
        setSnackbarMessage("Ngành không tồn tại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
      else {
        setSnackbarMessage("Lỗi: Sửa tên ngành không thành công");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.log("error: ", error);
      setSnackbarMessage("Lỗi: Không thể sửa ngành");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  }

  
  const handleSearchChange = (event) => {
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
    { width: 150, label: "Mã Ngành", dataKey: "maNganh", align: "center" },
    {  label: "Tên Ngành", dataKey: "ten", align: "center" },
    { width: 300, label: "Tên Khoa", dataKey: "tenKhoa", align: "center" },
    { width: 150, label: "", dataKey: "actions", align: "center" },
  ];

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} sx={{ height: "calc(100vh - 200px)" }} />
    )),
    
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed", backgroundColor: "white" }} />
    ),
    TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
    TableRow: StyledTableRow, // Sử dụng StyledTableRow bạn đã định nghĩa
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    TableCell: StyledTableCell, // Sử dụng StyledTableCell bạn đã định nghĩa
  };
  
  
  
  function fixedHeaderContent() {
    return (
      <StyledTableRow>
        {columns.map((column) => (
          <StyledTableCell
            key={column.dataKey}
            variant="head"
            align="center" // Cố định căn giữa
            style={{ width: column.width, textAlign: "center" }} // Đảm bảo text ở giữa
          >
            {column.label}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    );
  }
  
  
  
  
  function rowContent(index, row) {
    return (
      <>
        <StyledTableCell align="center">{index + 1}</StyledTableCell> {/* STT */}
        <StyledTableCell align="center">{row.maNganh}</StyledTableCell>
        <StyledTableCell align="left">{row.ten}</StyledTableCell>
        <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
        <StyledTableCell align="center" width={150}>
          <Tooltip title="Sửa ngành">
            <IconButton onClick={() => handleClickOpenEdit(row.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xem danh sách học phần">
            <IconButton onClick={() => handleOpenDialog(row.id)}>
              <FormatListBulletedIcon />
            </IconButton>
          </Tooltip>
        </StyledTableCell>
      </>
    );
  }
  
  

  return (
    <Layout>
      <div style={styles.main}>
      <div style={styles.title}>
        <span>Danh sách ngành học</span>
        <div style={styles.btnMore}>
          <IconButton aria-label="more actions"><MoreVertIcon/></IconButton>
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
              placeholder="Tìm kiếm theo tên ngành..."
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
          <Button sx={{width:"100%"}} variant="contained" onClick={handleAddNganhs}>Tạo ngành</Button>
                    <Dialog id='addNganh' fullWidth open={openAddNganh} onClose={handleCloseNganhs}>
                      <DialogTitle>Tạo ngành mới:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Thêm ngành mới vào hệ thống
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenNganh'
                          margin="dense"
                          label="Tên ngành"
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setTenNganh(e.target.value.trim())}
                          error={errorTenNganh}
                          onInput={(e) => setErrorTenNganh(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập tên ngành"
                          autoComplete='off'
                        />
                       <Autocomplete
                          options={khoas}
                          getOptionLabel={(option) => option.ten || ''}
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
                        <Button onClick={handleCloseNganhs}>Hủy</Button>
                        <Button
                          onClick={handleSubmit}
                        >
                          Lưu
                        </Button>
                      </DialogActions>
                    </Dialog>
          
        </div>
      </div>
      <div style={styles.table}>
      <Paper style={{ height: "100vh", width: "100%" }}>

  <TableVirtuoso style={{ width: "100%", height: "100%" }} // Đảm bảo full height
    data={filteredData}
    components={VirtuosoTableComponents}
    fixedHeaderContent={fixedHeaderContent}
    itemContent={rowContent}
  />
</Paper>
<TestDialog nganhId={nganhId} open={openDialog} onClose={handleCloseDialog} />


       {/* <TableContainer component={Paper}>
       <Table sx={{ minWidth: 700 }} aria-label="customized table">
         <TableHead sx={{position: 'sticky',top: 0,  zIndex: 1,backgroundColor: "#0071A6",}}>
          <TableRow>
            <StyledTableCell align="center">STT</StyledTableCell>
            <StyledTableCell align="center">Mã Ngành</StyledTableCell>
            <StyledTableCell align="center">Tên Ngành</StyledTableCell>
            <StyledTableCell align="center">Tên Khoa</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
          </TableRow>

         </TableHead>
         <TableBody sx={{ overflowY: "auto" }}>
            {filteredData.map((row, index) => (
              <StyledTableRow key={row.maNganh + row.ten}>
                
                <StyledTableCell align="center" width={50}>{index + 1}</StyledTableCell>
                <StyledTableCell align="center" width={150}>{row.maNganh}</StyledTableCell>
                <StyledTableCell align="left">{row.ten}</StyledTableCell>
                <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
                <StyledTableCell align="center" width={150}>
                  <Tooltip title="Sửa ngành">
                    <IconButton
                      onClick={() => handleClickOpenEdit(row.id)}
                    ><EditIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Xem danh sách học phần">
                    <IconButton onClick={()=>handleOpenDialog(row.id)}><FormatListBulletedIcon /></IconButton>
                    
                    
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
              
            ))}
            <TestDialog nganhId={nganhId} open={openDialog} onClose={handleCloseDialog}></TestDialog>
        </TableBody>
       </Table>
     </TableContainer> */}


          <Dialog id='editNganh' fullWidth open={openEditNganh} onClose={handleCloseEditNganh} TransitionComponent={Fade} >
            <DialogTitle>Sửa ngành:</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Sửa thông tin ngành
              </DialogContentText>
              {/* Mã ngành: Chỉ đọc */}
              <TextField
                required
                margin="dense"
                label="Mã ngành"
                fullWidth
                variant="standard"
                InputProps={{ readOnly: true }}
                focused={false}
                value={maNganh}
                autoComplete='off'
                helperText="Mã ngành không thể thay đổi"
              />
              <TextField
                required
                margin="dense"
                label="Tên ngành"
                fullWidth
                variant="standard"
                defaultValue={tenNganh}
                error={errorTenNganh}
                onChange={(e) => (inputRef.current = e.target.value)} // Lưu vào ref, không setState
                onBlur={(e) => setErrorTenNganh(e.target.value.trim() === "")}
                helperText={errorTenNganh ? "Tên ngành không được để trống" : ""}
                autoComplete='off'
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
                autoComplete='off'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditNganh}>Hủy</Button>
              <Button 
                onClick={() => handleEditSubmit(nganhId)}
              >Lưu</Button>
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
    </div>
    </Layout>
  );
};

export default TestPage;
