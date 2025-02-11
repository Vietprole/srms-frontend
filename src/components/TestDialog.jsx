import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { getNganhById } from "@/api/api-nganh";
import Typography  from "@mui/material/Typography";
import DialogContentText from '@mui/material/DialogContentText';
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Fragment } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add'; 
import DeleteIcon from '@mui/icons-material/Delete';
import { getHocPhans } from "@/api/api-hocphan";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

function TestDialog({ nganhId, open, onClose }) {

  const styles = {
    main: {
      display: "flex",
      width: '100%',
      height: '450px',
      overflowY: 'hidden',
      flexDirection: 'column',
    },
    mainAction: {
      display: "flex",
      width: '100%',
      height: '40px',
    },
    mainContent: {
      display: "flex",
      flexDirection: "column",
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      paddingTop: '10px',
    },
    tfSearch: {
      display: "flex",
      alignItems: "center",
      width: "25%",
      height: "100%",
    },
    btnAdd: {
      width: "18%",
      height: "100%",
      
    },
    btnDelete: {
      width: "18%",
      height: "100%",
      marginLeft: "auto",
      padding: "0 10px",
    },
  };


  const [nganh, setNganh] = useState(null);
  const [hocPhanDaChon, setHocPhanDaChon] = useState([]);

  useEffect(() => {
    if (open && nganhId) {
      fetchData();
    }
  }, [nganhId, open]);

  const fetchData = async () => {
    try {
      const nganhs = await getNganhById(nganhId);
      const hocphans = await getHocPhans(null,nganhId, null);
      setHocPhanDaChon(hocphans);
      setNganh(nganhs);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ngành:", error);
    }
  };

  const handleClose = () => {
    onClose(); // Đóng Dialog trước
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

  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={open}
      onClose={handleClose}
      onExited={() => setNganh(null)} // Reset nganh sau khi Dialog đóng hoàn toàn
    >
      <DialogTitle fontSize={"18px"} fontWeight={"bold"}>
        Danh sách học phần thuộc ngành:  
        <Typography component="span" color="info.main" fontWeight="bold">
          {nganh ? ` ${nganh.ten}` : " Đang tải..."}
        </Typography>

        <Box sx={{ display: "flex", gap: 10, alignItems: "center", mt: 0.5 }}>
          <DialogContentText component="span">
            Mã ngành:
            <Typography component="span" color="info.main" fontWeight="500"> {nganh ? nganh.maNganh : "Đang tải..."} </Typography>
          </DialogContentText>
          <DialogContentText component="span">
            Tổng số tín chỉ: 
            <Typography component="span" color="info.main" fontWeight="500"> {nganh ? nganh.soTinChi : "Đang tải..."} </Typography>
          </DialogContentText>
          <DialogContentText component="span">
            Khoa:<Typography component="span" color="info.main" fontWeight="500"> {nganh ? nganh.tenKhoa : "Đang tải..."}</Typography>
          </DialogContentText>
        </Box>
      </DialogTitle>
      <DialogContent>
        {nganh ? (
          <div style={styles.main}>
            <div style={styles.mainAction}>
              <div style={styles.tfSearch}>
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
                      <Fragment>
                        <IconButton aria-label="more actions">
                          <SearchIcon sx={{ color: "#888" }} />
                        </IconButton>
                      </Fragment>
                    ),
                  }}
                />
              </Box>
              </div>
              <div style={styles.btnDelete}>
                  <Button sx={{width:"100%"}} variant="outlined" color="error" startIcon={<DeleteIcon/>}>Xóa học phần</Button>
              </div>
              <div style={styles.btnAdd}>
                <Button sx={{width:"100%"}} variant="contained" endIcon={<AddIcon/>}>Thêm học phần</Button>
              </div>
              
            </div>
            <div style={styles.mainContent}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead sx={{position: 'sticky',top: 0,  zIndex: 1,backgroundColor: "#0071A6",}}>
                    <TableRow>
                      <StyledTableCell align="center">STT</StyledTableCell>
                      <StyledTableCell align="center">Mã học phần</StyledTableCell>
                      <StyledTableCell align="center">Tên học phần</StyledTableCell>
                      <StyledTableCell align="center">Số tín chỉ</StyledTableCell>
                      <StyledTableCell align="center"></StyledTableCell>
                    </TableRow>

                  </TableHead>
                  <TableBody sx={{ overflowY: "auto" }}>
                      {hocPhanDaChon.map((row, index) => (
                        <StyledTableRow key={row.maNganh + row.ten}>
                          
                          <StyledTableCell align="center" width={50}>{index + 1}</StyledTableCell>
                          <StyledTableCell align="center" width={150}>{row.maNganh}</StyledTableCell>
                          <StyledTableCell align="left">{row.ten}</StyledTableCell>
                          <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
                          <StyledTableCell align="center" width={150}>
                            <Tooltip title="Sửa ngành">
                              <IconButton
                         
                              ><EditIcon /></IconButton>
                            </Tooltip>
                          </StyledTableCell>
                        </StyledTableRow>
                        
                      ))}
                   </TableBody>
                </Table>
              </TableContainer>
            </div>

              
          </div>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </DialogContent>
      <DialogActions>
        <button onClick={handleClose}>Đóng</button>
      </DialogActions>
    </Dialog>
  );
}

export default TestDialog;
