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
import Layout from '../Layout';
import { getAllSemesters } from '@/api/api-semester';
import { addSemester } from '@/api/api-semester';
function HocKiPage() 
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
  const [schoolYears, setSchoolYears] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [selectedHocKy, setSelectedHocKy] = useState(null); // Lưu học kỳ được chọn để sửa
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
  const [selectedNamHocFilter, setSelectedNamHocFilter] = useState(null); // Lưu khoa được chọn để lọc

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedHocKy(null);
    setSelectedSchoolYear(null);

  };

  const handleNamHocChange = (event, newValue) => {
    setSelectedNamHocFilter(newValue);
  
    if (!newValue) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) => row.year === parseInt(newValue.value.split('-')[0]));
      setFilteredData(filtered);
    }
  };
  
  

  const generateSchoolYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2000; year--) { // Đảo ngược vòng lặp
      years.push({ label: `${year}-${year + 1}`, value: `${year}-${year + 1}` });
    }
    return years;
  };
  

  useEffect(() => {
    fetchData();
    setSchoolYears(generateSchoolYears());
  }, []); 
  
  
  const fetchData = async () => {
    const semesters = await getAllSemesters();
    console.log("semesters: ", semesters);
  
    const sortedData = semesters.sort((a, b) => b.Year - a.Year); // vì Year là int
    setData(sortedData);
    setFilteredData(sortedData);
  };
  
  
  
  
  const hocKi = [
    { hocki: 'Học kỳ 1', ten : 'Học kỳ 1' },
    { hocki: 'Học kỳ 2', ten : 'Học kỳ 2' },
    { hocki: 'Học kỳ hè', ten : 'Học kỳ hè' },
  ];

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


  const handleSubmitAdd = async () => {
    if(selectedHocKy === null)
    {
      setSnackbarMessage("Vui lòng chọn học kì");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if(selectedSchoolYear === null)
    {
      setSnackbarMessage("Vui lòng chọn năm học");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const data = {
      Name: selectedHocKy,
      Year: selectedSchoolYear, // đã là int
    };
    
    
    try
    {
      const res = await addSemester(data);
      if(res.status === 201)
        {
          setSnackbarMessage("Thêm học kì thành công");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          handleCloseAddDialog();
          fetchData();
        }
        else
        {
          setSnackbarMessage("Thêm học kì thất bại");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
    }catch(error)
    {
      console.log(error);
      setSnackbarMessage("Thêm học kì thất bại");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
    
  };

  return (
    <Layout>
      <div style={styles.main}>
      <div style={styles.title}>
        <span>Danh sách học kỳ</span>
        <div style={styles.btnMore}>
          <IconButton aria-label="more actions"><MoreVertIcon/></IconButton>
        </div>
      </div>
      <div style={styles.tbActions}>

        <div style={styles.cbKhoa}>
          <Autocomplete
            sx={{ width: "100%" }}
            options={schoolYears}
            getOptionLabel={(option) => option.label}
            required
            value={selectedNamHocFilter}
            onChange={handleNamHocChange}
            renderInput={(params) => (
              <TextField {...params} label="Chọn năm học" size="small" />
            )}
          />
        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained" onClick={handleOpenAddDialog}>Tạo học kỳ</Button>
          <Dialog id='themHocKy' fullWidth open={openAddDialog} onClose={handleCloseAddDialog}>
                      <DialogTitle>Tạo học kỳ mới:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Thêm học kỳ mới vào hệ thống
                        </DialogContentText>
                        <Autocomplete
                          options={hocKi}
                          getOptionLabel={(option) => option.ten || ''}
                          noOptionsText="Không tìm thấy học kì"
                          required
                          id="disable-clearable"
                          disableClearable
                          // onChange={(event, newValue) => setSelectedKhoa(newValue)} // Cập nhật state khi chọn khoa
                          onChange={(event, newValue) => setSelectedHocKy(newValue.hocki)} // Cập nhật state khi chọn khoa
                          renderInput={(params) => (
                            <TextField {...params} label="Chọn học kì" variant="standard" />
                          )}
                        />
                        <Autocomplete 
                          sx={{marginTop: '10px'}}
                          options={schoolYears}
                          getOptionLabel={(option) => option.label}
                          noOptionsText="Không tìm thấy học kì"
                          required
                          disableClearable
                          onChange={(event, newValue) => {
                            if (newValue) {
                              const yearStart = parseInt(newValue.value.split('-')[0]); // Lấy năm đầu tiên (2025)
                              setSelectedSchoolYear(yearStart); // Lưu 2025
                            }
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Chọn năm học" variant="standard" />
                          )}
                        />
                        
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseAddDialog}>Hủy</Button>
                        <Button
                          onClick={handleSubmitAdd}
                          variant='contained'
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
          <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: "#0071A6" }}>
            <TableRow>
              <StyledTableCell align="center">STT</StyledTableCell>
              <StyledTableCell align="center">Tên học kỳ</StyledTableCell>
              <StyledTableCell align="center">Năm học</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ overflowY: "auto" }}>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((row, index) => (
              <StyledTableRow key={row.Id || index}>
                <StyledTableCell align="center" width={100}>{index + 1}</StyledTableCell>
                <StyledTableCell align="center" width={250}>{row.name}</StyledTableCell>
                <StyledTableCell align="center">{`${row.year}-${row.year + 1}`}</StyledTableCell>

              </StyledTableRow>

              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell align="center" colSpan={4}>
                  Không có dữ liệu
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default HocKiPage;
