// import Layout from "./Layout";
import { useParams } from "react-router-dom";
import {
  getCLOsByHocPhanId,
  addCLO,
} from "@/api/api-clo";

import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { TableCell, tableCellClasses } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { Table } from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";
import * as React from 'react';
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {getAllSemesters} from "@/api/api-semester";
import { getLopHocPhanById } from "../../api/api-lophocphan";

export default function CLOPage() {
  const { lopHocPhanId } = useParams();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [tenCLO, setTenCLO] = useState("");
  const [moTa, setMoTa] = useState("");
  const [selectedHocKi, setSelectedHocKi] = useState(null);
  const [errorTenCLO, setErrorTenCLO] = useState(false);
  const [errorMoTa, setErrorMoTa] = useState(false);
  const [hocKy, setHocKy] = useState([]);
  const [lopHocPhanData, setLopHocPhanData] = useState(null);
  const handleOpenAddDialog = async() => {
    const hocKyData = await getAllSemesters();
    setHocKy(hocKyData);
    setOpenAddDialog(true);
  };
  const handleCloseDialogAddHocPhans = () => {
    setErrorMoTa(false);
    setErrorTenCLO(false);
    setTenCLO("");
    setMoTa("");
    setSelectedHocKi(null);
    setOpenAddDialog(false);
  };

  const columns = [
    { width: 60, label: "STT", dataKey: "index", align: "center" },
    { width: 300,label: "Tên CLO", dataKey: "tenCLO", align: "center" },
    { width: 400, label: "Mô tả", dataKey: "moTa", align: "center" },
    { width: 300, label: "Thuộc kì", dataKey: "hocKi", align: "center" },
    { width: 100, label: "", dataKey: "actions", align: "center" },
  ];
  const styles = {
    main:
    {
      width: '100%',
      height: '75vh',
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
      marginLeft: '10px',
      marginBottom: '10px',
    },
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  const filteredData = data.filter((item) =>
    item.ten?.toLowerCase().includes(searchQuery)
  );
  const handleAddSubmit = async () => {
    if (tenCLO.trim() === "") {
      
      setErrorTenCLO(true);
      setSnackbarMessage("Vui lòng nhập tên CLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if(moTa.trim() === "")
    {
      setErrorMoTa(true);
      setSnackbarMessage("Vui lòng nhập mô tả cho CLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!selectedHocKi) {
      setSnackbarMessage("Vui lòng chọn học kì");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const CLOData = {
      ten: tenCLO,
      moTa: moTa,
      hocPhanId: lopHocPhanData.hocPhanId,
      hocKyId: selectedHocKi.id,
    };
    console.log("CLOData: ", CLOData);
    try {
      const rp =await  addCLO(CLOData);
      if(rp.status===201)
      {
        setSnackbarMessage("Thêm CLO thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogAddHocPhans();
        fetchData();
      }
      else
      {
        setSnackbarMessage("Thêm CLO thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  function rowContent(index, row) {
    return (
      <>
        <StyledTableCell align="center">{index + 1}</StyledTableCell>
        <StyledTableCell align="center">{row.ten}</StyledTableCell>
        <StyledTableCell align="center">{row.moTa}</StyledTableCell>
        <StyledTableCell align="center">{row.tenHocKy}</StyledTableCell>
        <StyledTableCell align="center" width={150}>
          <Tooltip title="Sửa thông tin CLO">
          <IconButton
                    >
              <EditIcon />
            </IconButton>
          </Tooltip>
         
        </StyledTableCell>
      </>
    );
  }
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

  useEffect(() => {
    fetchData();
  }, [lopHocPhanId]);


  const fetchData = async () => {
   
    const lopHocPhanData = await getLopHocPhanById(lopHocPhanId);
    const clos = await getCLOsByHocPhanId(lopHocPhanData.hocPhanId);
    setLopHocPhanData(lopHocPhanData);
    setData(clos);
  };
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

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
      <div className="w-full">
              <div style={styles.main}>
      <div style={styles.title}>
        <span>Danh sách CLO thuộc lớp học phần</span>
        <div style={styles.btnMore}>
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
              placeholder="Tìm kiếm theo tên CLO..."
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
              


        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained"  onClick={handleOpenAddDialog}>Tạo CLO</Button>
          <Dialog id='themCLO' fullWidth open={openAddDialog} onClose={handleCloseDialogAddHocPhans}>
                      <DialogTitle>Tạo CLO mới:</DialogTitle>
                      <DialogContent >
                        <DialogContentText>
                          Thêm CLO mới vào hệ thống
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenCLO'
                          margin="dense"
                          label="Tên CLO"
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setTenCLO(e.target.value.trim())}
                          error={errorTenCLO}
                          onInput={(e) => setErrorTenCLO(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập tên CLO"
                          autoComplete='off'
                        />
                        <TextField
                          autoFocus
                          required
                          id='moTa'
                          margin="dense"
                          label="Mô tả"
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setMoTa(e.target.value.trim())}
                          error={errorMoTa}
                          onInput={(e) => setErrorMoTa(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập mô tả cho CLO"
                          autoComplete='off'
                          multiline
                        />
                       <Autocomplete
                          options={hocKy}
                          getOptionLabel={(option) => option.tenHienThi || ''}
                          noOptionsText="Không tìm thấy học kì"
                          required
                          id="disable-clearable"
                          disableClearable
                          onChange={(event, newValue) => setSelectedHocKi(newValue)} // Cập nhật state khi chọn khoa
                          renderInput={(params) => (
                            <TextField {...params} label="Chọn học kì" variant="standard" />
                          )}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button 
                          onClick={handleCloseDialogAddHocPhans}
                        >Hủy</Button>
                        <Button
                          onClick={handleAddSubmit}
                          variant="contained"
                          color="primary"
                          disabled={!tenCLO || !moTa || !selectedHocKi} // Disable nếu không có giá trị
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

      </div>
  );
}
