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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from './Layout';
import { getAllNganhs } from "@/api/api-nganh";
import { TableVirtuoso } from "react-virtuoso";
import {getAllPLOs,addPLO,updatePLO,getPLOById,deletePLO} from "@/api/api-plo";

function PLOPage() 
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
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tenPLO, setTenPLO] = useState("");
  const [errorTenPLO, setErrorTenPLO] = useState(false);
  const [moTaPLO, setMoTaPLO] = useState("");
  const [errorMoTaPLO, setErrorMoTaPLO] = useState(false);
  const [selectedNganh, setSelectedNganh] = useState(null);
  const [nganhs, setNganhs] = useState([]);
  const [ploID, setPloID] = useState("");
  const tenPLORef = useRef("");
  const moTaPLORef = useRef("");

  const handleOpenEditDialog = async (ploID) => {
    const plo = await getPLOById(ploID);
    const nganh = await getAllNganhs();
    setNganhs(nganh);
  
    if (plo.status === 200) {
      setTenPLO(plo.data.ten);
      setMoTaPLO(plo.data.moTa);
  
      // Tìm ngành phù hợp trong danh sách
      const matchedNganh = nganh.find((item) => item.ten === plo.data.tenNganh);
      setSelectedNganh(matchedNganh || null);
  
      tenPLORef.current = plo.data.ten;
      moTaPLORef.current = plo.data.moTa;
      setPloID(ploID);
      setOpenEditDialog(true);
    } else if (plo.status === 404) {
      setSnackbarMessage("Không tìm thấy PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Lỗi không xác định");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  

  const handleCloseDialogEdit = () => {
    setOpenEditDialog(false);
    setTenPLO("");
    setMoTaPLO("");
    setSelectedNganh(null);
    setErrorTenPLO(false);
    setErrorMoTaPLO(false);
    tenPLORef.current = "";
    moTaPLORef.current = "";
    setPloID("");
    setNganhs([]);
  };

  const handleOpenAddDialog = async() => {
    const nganh = await getAllNganhs();
    setNganhs(nganh);
    setOpenAddDialog(true);
  };
  const handleCloseDialogAdd = () => {
    setTenPLO("");
    setMoTaPLO("");
    setSelectedNganh(null);
    setErrorMoTaPLO(false);
    setErrorTenPLO(false);
    setNganhs([]);
    setOpenAddDialog(false);
  };


  useEffect(() => {
    fetchData();
  }, []); 
  
  
  const fetchData = async () => {
    try {
      const plos = await getAllPLOs();
      // Đảm bảo response từ API trả về thêm thông tin tenNganh
      setData(plos);
      setFilteredData(plos);
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
    if (tenPLO.trim() === "") {
      
      setErrorTenPLO(true);
      setSnackbarMessage("Vui lòng nhập tên PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if(moTaPLO.trim() === "")
    {
      setErrorMoTaPLO(true);
      setSnackbarMessage("Vui lòng nhập mô tả cho PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!selectedNganh) {
      setSnackbarMessage("Vui lòng chọn ngành tương ứng");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const ploData = {
      ten: tenPLO,
      moTa: moTaPLO,
      nganhId: selectedNganh.id,
    };
    try {
      const rp =await addPLO(ploData);
      if(rp.status===201)
      {
        setSnackbarMessage("Thêm PLO thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogAdd();
        fetchData();
      }
      else
      {
        setSnackbarMessage("Thêm PLO thất bại");
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
  
    if (tenPLORef.current.trim() === "") {
      setErrorTenPLO(true);
      setSnackbarMessage("Vui lòng nhập tên PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (moTaPLORef.current.trim() === "") {
      setErrorMoTaPLO(true);
      setSnackbarMessage("Vui lòng nhập mô tả cho PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!selectedNganh) {
      setSnackbarMessage("Vui lòng chọn ngành tương ứng");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    // Kiểm tra xem nganhId có tồn tại trong danh sách ngành không

    const ploData = {
      ten: tenPLORef.current,
      moTa: moTaPLORef.current,
      nganhId: selectedNganh.id
    };
  
    try {
      const response = await updatePLO(ploID, ploData);
      if (response.status === 200) {
        setSnackbarMessage("Cập nhật PLO thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogEdit();
        fetchData();
      } else {
        setSnackbarMessage("Cập nhật PLO thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  

  const handleOpenDeleteDialog = (idPLO) => {
    setPloID(idPLO);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPloID(null);
  };





  const handleDeleteHocPhan = async () => {
    try {
      const rp =await deletePLO(ploID);
      if(rp.status !== 204) {
        throw new Error("Xóa PLO thất bại");
      }
      setSnackbarMessage("Xóa PLO thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      fetchData(); // Refresh data
    } catch (error) {

        setSnackbarMessage("Xóa PLO thất bại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        handleCloseDeleteDialog();
        console.log(error);

    }
  };
  const columns = [
    { width: 50, label: "STT", dataKey: "index", align: "center" },
    { width: 200, label: "Tên PLO", dataKey: "maHocPhan", align: "center" },
    { label: "Mô tả cho PLO", dataKey: "tenHocPhan", align: "left" },
    { width: 300, label: "Thuộc ngành", dataKey: "tenKhoa", align: "center" },
    { width: 150, label: "", dataKey: "actions", align: "center" },
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
        <StyledTableCell align="left">{row.moTa}</StyledTableCell>
        <StyledTableCell align="center">{row.tenNganh}</StyledTableCell>
        <StyledTableCell align="center" width={150}>
          <Tooltip title="Sửa thông tin PLO">
          <IconButton
                      onClick={() => handleOpenEditDialog(row.id)}
                    >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa PLO">
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
              value={searchQuery} // Liên kết giá trị tìm kiếm với state
              onChange={handleSearchChange} // Gọi hàm xử lý khi thay đổi
            />
          </Box>
        </div>
        <div style={styles.btnCreate}>
          <Button sx={{width:"100%"}} variant="contained" onClick={()=>{handleOpenAddDialog()}} >Tạo PLO</Button>
          <Dialog id='themPLO' fullWidth open={openAddDialog} onClose={handleCloseDialogAdd}>
                      <DialogTitle>Tạo PLO mới:</DialogTitle>
                      <DialogContent >  
                        <DialogContentText>
                          Thêm PLO mới vào hệ thống
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='tenPLO'
                          margin="dense"
                          label="Tên PLO"
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setTenPLO(e.target.value.trim())}
                          error={errorTenPLO}
                          onInput={(e) => setErrorTenPLO(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập tên PLO"
                          autoComplete='off'
                        />
                        <TextField
                          autoFocus
                          required
                          id='moTaPLO'
                          margin="dense"
                          label="Mô tả PLO"
                          fullWidth
                          variant="standard"
                          onBlur={(e) => setMoTaPLO(e.target.value.trim())}
                          error={errorMoTaPLO}
                          onInput={(e) => setErrorMoTaPLO(e.target.value.trim() === "")}
                          helperText="Vui lòng nhập mô tả PLO"
                          autoComplete='off'/>
                          <Autocomplete
                            options={nganhs}
                            getOptionLabel={(option) => option.ten || ''}
                            noOptionsText="Không tìm thấy ngành"
                            required
                            id="disable-clearable"
                            disableClearable
                            onChange={(event, newValue) => setSelectedNganh(newValue)} // Cập nhật state khi chọn nganh
                            renderInput={(params) => (
                              <TextField {...params} label="Chọn ngành" variant="standard" />
                            )}
                            renderOption={(props, option) => (
                              <li {...props} key={option.id}>{option.ten}</li>
                            )}
                          />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialogAdd}>Hủy</Button>
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
     <TableVirtuoso
      data={filteredData}
      components={VirtuosoTableComponents}
      fixedHeaderContent={fixedHeaderContent}
      itemContent={rowContent}
    />
     <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
              <DialogTitle>Xóa Học Phần</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bạn có chắc chắn muốn xóa PLO này không?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                <Button onClick={handleDeleteHocPhan} color="error">
                  Xóa
                </Button>
              </DialogActions>
            </Dialog>
     <Dialog id='suaPLO' fullWidth open={openEditDialog} onClose={handleCloseDialogEdit}>
                      <DialogTitle>Sửa thông tin PLO:</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Sửa thông tin PLO
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          id='suatenPLO'
                          margin="dense"
                          label="Tên PLO"
                          fullWidth
                          variant="standard"
                          defaultValue={tenPLO}
                          onChange={(e) => {
                            tenPLORef.current = e.target.value;
                            setErrorTenPLO(e.target.value.trim() === "");
                          }}
                          error={errorTenPLO}
                          helperText={errorTenPLO ? "Vui lòng nhập tên PLO" : ""}
                          autoComplete='off'
                        />
                        <TextField
                          autoFocus
                          required
                          id="suaMoTaPLO"
                          margin="dense"
                          label="Mô tả cho PLO"
                          variant="standard"
                          fullWidth
                          defaultValue={moTaPLO}
                          onChange={(e) => {
                            moTaPLORef.current = e.target.value;
                            setErrorMoTaPLO(e.target.value.trim() === "");
                          }}
                          error={errorMoTaPLO}
                          helperText={errorMoTaPLO ? "Vui lòng nhập mô tả cho PLO" : ""}
                          autoComplete='off'
                        />
                         <Autocomplete
                            options={nganhs}
                            getOptionLabel={(option) => option.ten || ''}
                            noOptionsText="Không tìm thấy ngành"
                            required
                            id="disable-clearable"
                            disableClearable
                            value={selectedNganh}
                            onChange={(event, newValue) => setSelectedNganh(newValue)} // Cập nhật state khi chọn nganh
                            renderInput={(params) => (
                              <TextField {...params} label="Chọn ngành" variant="standard" />
                            )}
                            renderOption={(props, option) => (
                              <li {...props} key={option.id}>{option.ten}</li>
                            )}
                          />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialogEdit}>HỦY</Button>
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

export default PLOPage;