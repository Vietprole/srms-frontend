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
import {Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { useState, useEffect,useRef } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  getAllKhoas
} from "@/api/api-khoa";
import { getAllHocPhans,addHocPhan,getHocPhanById,updateHocPhan,deleteHocPhan } from '@/api/api-hocphan';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../Layout';
import { getHocPhansByNganhId, getAllNganhs } from "@/api/api-nganh";
import { getLopHocPhans } from "@/api/api-lophocphan";
import { TableVirtuoso } from "react-virtuoso";
function HocPhanPage() 
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
      marginLeft: '10px',
      marginBottom: '10px',
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
  const soTinChiRef = useRef("");
  const tenHocPhanRef = useRef("");
  const [maHocPhan, setMaHocPhan] = useState("");
  const [tenKhoa, setTenKhoa] = useState("");
  const [hocPhanId, setHocPhanId] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedHocPhanId, setSelectedHocPhanId] = useState(null);

  const handleOpenEditDialog = async(hocPhanId) => {
    const hocphan = await getHocPhanById(hocPhanId);
    if(hocphan.status===200)
    {
     
      setTenHocPhan(hocphan.data.ten);
      setSoTinChi(hocphan.data.soTinChi);
      setSelectedKhoa(hocphan.data.khoa);
      tenHocPhanRef.current = hocphan.data.ten;
      soTinChiRef.current = hocphan.data.soTinChi;
      setMaHocPhan(hocphan.data.maHocPhan);
      setTenKhoa(hocphan.data.tenKhoa);
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
  };

  const handleKhoaChange = (event, newValue) => {
    setSelectedKhoaFilter(newValue);
    if (!newValue) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) => row.tenKhoa === newValue.ten);
      setFilteredData(filtered);
    }
  };


  useEffect(() => {
    fetchData();
  }, []); 
  
  
  const fetchData = async () => {
    try {
      const hocphans = await getAllHocPhans();
      // Đảm bảo response từ API trả về thêm thông tin tenNganh
      setData(hocphans);
      setFilteredData(hocphans);
      const khoa = await getAllKhoas();
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
        row.ten.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  
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

  const handleAddSubmit = async () => {
    if (tenHocPhan.trim() === "") {
      
      setErrorTenHocPhan(true);
      setSnackbarMessage("Vui lòng nhập tên học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if(soTinChi.trim() === "")
    {
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
    const hocphanData = {
      ten: tenHocPhan,
      soTinChi: soTinChi,
      khoaId: selectedKhoa.id,
    };
    try {
      const rp =await addHocPhan(hocphanData);
      if(rp.status===201)
      {
        setSnackbarMessage("Thêm học phần thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogAddHocPhans();
        fetchData();
      }
      else
      {
        setSnackbarMessage("Thêm học phần thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  const handleSubmitEdit = async () => {
    // Kiểm tra giá trị của soTinChiRef.current
    const soTinChiValue = String(soTinChiRef.current || "").trim();
  
    if (tenHocPhanRef.current.trim() === "") {
      setErrorTenHocPhan(true);
      setSnackbarMessage("Vui lòng nhập tên học phần");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    if (soTinChiValue === "") {
      setErrorSoTinChi(true);
      setSnackbarMessage("Vui lòng nhập số tín chỉ");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    const hocphanData = {
      ten: tenHocPhanRef.current,
      soTinChi: parseFloat(soTinChiValue) // Chuyển đổi thành số
    };
  
    try {
      const response = await updateHocPhan(hocPhanId, hocphanData);
      if (response.status === 200) {
        setSnackbarMessage("Cập nhật học phần thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogEditHocPhans();
        fetchData(); // Refresh data
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
  

  const handleOpenDeleteDialog = (hocPhanId) => {
    setSelectedHocPhanId(hocPhanId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedHocPhanId(null);
  };

  const getHocPhanNganh = async (hocPhanId) => {
    try {
      // Lấy danh sách tất cả ngành
      const nganhs = await getAllNganhs();
      const tenNganhs = []; // Mảng chứa tên các ngành mà học phần thuộc về
      
      // Kiểm tra từng ngành xem có chứa học phần cần xóa không
      for (const nganh of nganhs) {
        const hocPhansInNganh = await getHocPhansByNganhId(nganh.id);
        const found = hocPhansInNganh.find(hp => hp.id === hocPhanId);
        if (found) {
          tenNganhs.push(nganh.ten); // Thêm tên ngành vào mảng
        }
      }
      
      return tenNganhs; // Trả về mảng tên các ngành, rỗng nếu không thuộc ngành nào
    } catch (error) {
      console.error("Lỗi khi kiểm tra ngành của học phần:", error);
      return [];
    }
  };

  const getHocPhanLopHocPhan = async (hocPhanId) => {
    try {
      const lopHocPhans = await getLopHocPhans(hocPhanId, null, null, null);
      return lopHocPhans.map(lhp => lhp.ten);
    } catch (error) {
      console.error("Lỗi khi kiểm tra lớp học phần:", error);
      return [];
    }
  };

  const handleDeleteHocPhan = async () => {
    try {
      // Kiểm tra học phần thuộc những ngành nào
      const tenNganhs = await getHocPhanNganh(selectedHocPhanId);
      // Kiểm tra học phần thuộc những lớp học phần nào
      const tenLopHocPhans = await getHocPhanLopHocPhan(selectedHocPhanId);
      
      let errorMessage = "";
      
      // Xử lý thông báo cho ngành
      if (tenNganhs.length > 0) {
        if (tenNganhs.length > 1) {
          errorMessage += `Học phần đã được thêm vào các ngành: ${tenNganhs.join(", ")}`;
        } else {
          errorMessage += `Học phần đã được thêm vào ngành ${tenNganhs[0]}`;
        }
      }

      // Xử lý thông báo cho lớp học phần
      if (tenLopHocPhans.length > 0) {
        if (errorMessage) {
          errorMessage += " và ";
        }
        if (tenLopHocPhans.length > 1) {
          errorMessage += `Học phần thuộc các lớp học phần: ${tenLopHocPhans.join(", ")}`;
        } else {
          errorMessage += `Học phần thuộc lớp học phần ${tenLopHocPhans[0]}`;
        }
      }

      // Nếu có bất kỳ ràng buộc nào
      if (errorMessage) {
        errorMessage += ". Vui lòng xóa học phần khỏi các ràng buộc trước khi thao tác";
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        handleCloseDeleteDialog();
        return;
      }

      // Nếu không có ràng buộc nào thì tiến hành xóa
      await deleteHocPhan(selectedHocPhanId);
      setSnackbarMessage("Xóa học phần thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      fetchData(); // Refresh data
    } catch (error) {
      if (error.message.includes("404")) {
        setSnackbarMessage("Học phần đã được xóa trước đó");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        handleCloseDeleteDialog();
        fetchData();
      } else {
        setSnackbarMessage("Xóa học phần thất bại: " + error.message);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };
  const columns = [
    { width: 50, label: "STT", dataKey: "index", align: "center" },
    { width: 150, label: "Mã Học Phần", dataKey: "maHocPhan", align: "center" },
    { label: "Tên Học Phần", dataKey: "tenHocPhan", align: "left" },
    { width: 100, label: "Số Tín Chỉ", dataKey: "soTinChi", align: "center" },
    { width: 200, label: "Tên Khoa", dataKey: "tenKhoa", align: "center" },
    { width: 150, label: "", dataKey: "actions", align: "center" },
  ];
  
  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} sx={{ height: "calc(100vh - 200px)", overflowY: "auto" }} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed", backgroundColor: "white" }} />
    ),
    TableHead: React.forwardRef((props, ref) => (
      <TableHead {...props} ref={ref} sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#0071A6" }} />
    )),
    TableRow: StyledTableRow,
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
        <StyledTableCell align="center">{row.maHocPhan}</StyledTableCell>
        <StyledTableCell align="left">{row.ten}</StyledTableCell>
        <StyledTableCell align="center">{row.soTinChi}</StyledTableCell>
        <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
        <StyledTableCell align="center" width={150}>
          <Tooltip title="Sửa học phần">
          <IconButton
                      onClick={() => handleOpenEditDialog(row.id)}
                    >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa học phần">
              <IconButton
                  onClick={() => handleOpenDeleteDialog(row.id)}
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
        <span>Danh sách học phần</span>
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
          getOptionLabel={(option) => option.ten || ""}
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
                          inputProps={{ maxLength: 5 }}
                          error={errorSoTinChi}
                          helperText={errorSoTinChi ? "Vui lòng nhập số hợp lệ" : "Vui lòng nhập số tín chỉ"}  
                          autoComplete="off"
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
      
       {/* <TableContainer component={Paper}>
       <Table sx={{ minWidth: 700 }} aria-label="customized table">
         <TableHead sx={{position: 'sticky',top: 0,  zIndex: 1,backgroundColor: "#0071A6",}}>
          <TableRow>
            <StyledTableCell align="center">STT</StyledTableCell>
            <StyledTableCell align="center">Mã học phần</StyledTableCell>
            <StyledTableCell align="center">Tên học phần</StyledTableCell>
            <StyledTableCell align="center">Số tín chỉ</StyledTableCell>
            <StyledTableCell align="center">Tên Khoa</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
          </TableRow>

         </TableHead>
         <TableBody sx={{ overflowY: "auto" }}>
            {filteredData.map((row, index) => (
              <StyledTableRow key={row.maHocPhan || index}>

                
                <StyledTableCell align="center" width={40}>{index + 1}</StyledTableCell>
                <StyledTableCell align="center" width={150}>{row.maHocPhan}</StyledTableCell>
                <StyledTableCell align="left">{row.ten}</StyledTableCell>
                <StyledTableCell align="center" width={150}>{row.soTinChi}</StyledTableCell>
                <StyledTableCell align="center" width={300}>{row.tenKhoa}</StyledTableCell>
                <StyledTableCell align="center" width={150}>
                  <Tooltip title="Sửa thông tin học phần">
                    <IconButton
                      onClick={() => handleOpenEditDialog(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa học phần">
                    <IconButton
                      onClick={() => handleOpenDeleteDialog(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
              
            ))}

           
        </TableBody>
       </Table>
     </TableContainer> */}
     <TableVirtuoso
      data={data}
      components={VirtuosoTableComponents}
      fixedHeaderContent={fixedHeaderContent}
      itemContent={rowContent}
    />
     <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
              <DialogTitle>Xóa Học Phần</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bạn có chắc chắn muốn xóa học phần này không?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                <Button onClick={handleDeleteHocPhan} color="error">
                  Xóa
                </Button>
              </DialogActions>
            </Dialog>
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
    </div>
    </Layout>
  );
};

export default HocPhanPage;