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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Layout from './Layout';
import { getAllLopHocPhans } from '@/api/api-lophocphan';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DeleteIcon from '@mui/icons-material/Delete';
import { TableVirtuoso } from 'react-virtuoso';
import {
  getPLOs,
  deletePLO,
  addPLO,
  updatePLO,
  getAllPLOs
} from "@/api/api-plo";
import {
  getAllNganhs,
} from "@/api/api-nganh";
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
    table:
    {
      width: '100%',
      height: '98%',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '10px',
      overflowY: 'auto',
    },
    cbKhoa:
    {
      width: '22%',
      height: '80%',
      marginBottom: '10px',
    },
  };
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    fetchData();
  }, []); 
  
  
  const fetchData = async () => {
    const plos = await getAllPLOs();
    setData(plos);
    setFilteredData(plos);
  };
  
  

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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
    cursor: 'pointer',
  },
  }));

  const columns = [
    { width: 50, label: "STT", dataKey: "index", align: "center" },
    { width: 200, label: "Tên PLO", dataKey: "ten", align: "center" },
    { label: "Mô tả", dataKey: "moTa", align: "center" },
    { width: 350, label: "Thuộc ngành", dataKey: "tenNganh", align: "center" },
    { width: 200, label: "", dataKey: "tenNganh", align: "center" },
  ];
  
  const VirtuosoTableComponents = {
    // eslint-disable-next-line react/display-name
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} sx={{ height: "calc(100vh - 200px)", overflowY: "auto" }} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed", backgroundColor: "white" }} />
    ),
    // eslint-disable-next-line react/display-name
    TableHead: React.forwardRef((props, ref) => (
      <TableHead {...props} ref={ref} sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#0071A6" }} />
    )),
    TableRow: StyledTableRow,
    // eslint-disable-next-line react/display-name
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    TableCell: StyledTableCell,
  };
  
  function fixedHeaderContent() {
    return (
      <StyledTableRow>
        {columns.map((column) => (
          <StyledTableCell
            key={column.dataKey}
            variant="head"
            align="center"
            style={{ width: column.width, textAlign: "center" }}
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
        <StyledTableCell align="center">{index + 1}</StyledTableCell>
        <StyledTableCell align="center">{row.ten}</StyledTableCell>
        <StyledTableCell align="center">{row.moTa}</StyledTableCell>
        <StyledTableCell align="center">{row.tenNganh}</StyledTableCell>
        <StyledTableCell align="center" width={150}>
          <Tooltip title="Sửa học phần">
          <IconButton
   
                    >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa học phần">
              <IconButton

              >
              <DeleteIcon />
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
        <span>Danh sách PLO</span>
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
              placeholder="Tìm kiếm theo tên PLO..."
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
            
            />
          </Box>
        </div>
        <div style={styles.cbKhoa}>
        
        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained">Tạo PLO</Button>
          <Dialog id='themPLO' fullWidth >
                      <DialogTitle>Tạo PLO mới:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Thêm PLO vào hệ thống
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenPLO'
                          margin="dense"
                          label="Tên PLO"
                          fullWidth
                          variant="standard"
                          // onBlur={(e) => setTenHocPhan(e.target.value.trim())}
                          // error={errorTenHocPhan}
                          // onInput={(e) => setErrorTenHocPhan(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập tên PLO"
                          autoComplete='off'
                        />

                        <TextField
                          autoFocus
                          required
                          id='tenPLO'
                          margin="dense"
                          label="Mô tả PLO"
                          fullWidth
                          variant="standard"
                          // onBlur={(e) => setTenHocPhan(e.target.value.trim())}
                          // error={errorTenHocPhan}
                          // onInput={(e) => setErrorTenHocPhan(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập mô tả cho PLO"
                          autoComplete='off'
                        />
                       <Autocomplete
                          // options={khoas}
                          getOptionLabel={(option) => option.ten || ''}
                          noOptionsText="Không tìm thấy khoa"
                          required
                          id="disable-clearable"
                          disableClearable
                          // onChange={(event, newValue) => setSelectedKhoa(newValue)} // Cập nhật state khi chọn khoa
                          renderInput={(params) => (
                            <TextField {...params} label="Chọn khoa" variant="standard" />
                          )}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button>Hủy</Button>
                        <Button

                        >
                          Lưu
                        </Button>
                      </DialogActions>
                    </Dialog>

        </div>
      </div>
      <div style={styles.table}>
            
      <TableVirtuoso
      data={filteredData}
      components={VirtuosoTableComponents}
      fixedHeaderContent={fixedHeaderContent}
      itemContent={rowContent}
    />

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
