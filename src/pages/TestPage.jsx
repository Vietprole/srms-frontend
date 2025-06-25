import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "./Layout";
import { getAllNganhs } from "@/api/api-nganh";
import { TableVirtuoso } from "react-virtuoso";
import {
  addPLO,
  updatePLO,
  getPLOById,
  deletePLO,
  getPLOsByNganhId,
} from "@/api/api-plo";
import { getRole, getNguoiQuanLyCTDTId } from "@/utils/storage";
import { getNganhsByNguoiQuanLyId } from "@/api/api-nganh";

function TestPage() {
  const styles = {
    main: {
      width: "100%",
      height: "91vh",
      display: "flex",
      flexDirection: "column",
      overflowY: "hidden",
      padding: "10px",
    },
    title: {
      width: "100%",
      height: "6%",
      fontSize: "1.2em",
      fontFamily: "Roboto",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "row",
    },
    btnMore: {
      display: "flex",
      justifyContent: "flex-end",
      marginLeft: "auto",
    },
    tbActions: {
      width: "100%",
      height: "6%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
    },
    ipSearch: {
      width: "25%",
      height: "100%",
      justifyContent: "flex-start",
      borderRadius: "5px",
    },
    btnCreate: {
      width: "15%",
      height: "100%",
      display: "flex",
      marginLeft: "auto",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "5px",
      color: "white",
      cursor: "pointer",
    },
    table: {
      width: "100%",
      height: "98%",
      display: "flex",
      flexDirection: "column",
      paddingTop: "10px",
      overflowY: "auto",
    },
    cbKhoa: {
      width: "22%",
      height: "80%",
      marginLeft: "10px",
      marginBottom: "10px",
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
  const role = getRole();
  const nguoiQuanLyCTDTId = getNguoiQuanLyCTDTId();
  const [dialogNganh, setDialogNganh] = useState(null);

  const handleOpenEditDialog = async (ploID) => {
    const plo = await getPLOById(ploID);
    if (role === "NguoiPhuTrachCTĐT" && nguoiQuanLyCTDTId !== 0) {
      const nganhData = await getNganhsByNguoiQuanLyId(nguoiQuanLyCTDTId);
      setData(nganhData);
    } else {
      const nganhData = await getAllNganhs();
      setData(nganhData);
    }

    if (plo.status === 200) {
      setTenPLO(plo.data.ten);
      setMoTaPLO(plo.data.moTa);
      setDialogNganh(nganhs.find((item) => item.id === plo.data.nganhId) || selectedNganh);
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
    setErrorTenPLO(false);
    setErrorMoTaPLO(false);
    tenPLORef.current = "";
    moTaPLORef.current = "";
    setPloID("");
  };

  const handleOpenAddDialog = () => {
    setTenPLO("");
    setMoTaPLO("");
    setErrorTenPLO(false);
    setErrorMoTaPLO(false);
    setDialogNganh(selectedNganh);
    setOpenAddDialog(true);
  };
  const handleCloseDialogAdd = () => {
    setTenPLO("");
    setMoTaPLO("");
    setErrorMoTaPLO(false);
    setErrorTenPLO(false);
    setOpenAddDialog(false);
  };

  useEffect(() => {
    getAllNganhs().then(setNganhs);
  }, []);

  useEffect(() => {
    if (selectedNganh) {
      fetchPLOsByNganh(selectedNganh.id);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [selectedNganh]);

  const fetchPLOsByNganh = async (nganhId) => {
    try {
      const plos = await getPLOsByNganhId(nganhId);
      const sortedPlos = sortPLOsByTen(plos);
      setData(sortedPlos);
      setFilteredData(sortedPlos);
    } catch (error) {
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
      const sortedFiltered = sortPLOsByTen(filtered);
      setFilteredData(sortedFiltered);
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
      borderRight: "1px solid #ddd", // Đường phân cách dọc
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: "5px 10px", // Thêm padding cho các hàng
      borderRight: "1px solid #ddd", // Đường phân cách dọc
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: "#D3F3FF", // Màu nền khi hover
      cursor: "pointer", // Tùy chọn: Thêm hiệu ứng con trỏ
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
    if (moTaPLO.trim() === "") {
      setErrorMoTaPLO(true);
      setSnackbarMessage("Vui lòng nhập mô tả cho PLO");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!dialogNganh) {
      setSnackbarMessage("Vui lòng chọn ngành tương ứng");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const ploData = {
      ten: tenPLO,
      moTa: moTaPLO,
      nganhId: dialogNganh.id,
    };
    try {
      const rp = await addPLO(ploData);
      if (rp.status === 201) {
        setSnackbarMessage("Thêm PLO thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogAdd();
        fetchPLOsByNganh(dialogNganh.id);
      } else {
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
    if (!dialogNganh) {
      setSnackbarMessage("Vui lòng chọn ngành tương ứng");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const ploData = {
      ten: tenPLORef.current,
      moTa: moTaPLORef.current,
      nganhId: dialogNganh.id,
    };

    try {
      const response = await updatePLO(ploID, ploData);
      if (response.status === 200) {
        setSnackbarMessage("Cập nhật PLO thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseDialogEdit();
        fetchPLOsByNganh(dialogNganh.id);
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
      const rp = await deletePLO(ploID);
      if (rp.status !== 204) {
        throw new Error("Xóa PLO thất bại");
      }
      setSnackbarMessage("Xóa PLO thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDeleteDialog();
      fetchPLOsByNganh(selectedNganh.id);
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
    { width: 300, label: "Thuộc Chương Trình Đào Tạo", dataKey: "tenKhoa", align: "center" },
    { width: 150, label: "", dataKey: "actions", align: "center" },
  ];

  const VirtuosoTableComponents = {
    // eslint-disable-next-line react/display-name
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer
        component={Paper}
        {...props}
        ref={ref}
        sx={{ height: "calc(100vh - 200px)", overflowY: "auto" }}
      />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{
          borderCollapse: "separate",
          tableLayout: "fixed",
          backgroundColor: "white",
        }}
      />
    ),
    // eslint-disable-next-line react/display-name
    TableHead: React.forwardRef((props, ref) => (
      <TableHead
        {...props}
        ref={ref}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "#0071A6",
        }}
      />
    )),
    TableRow: StyledTableRow,
    // eslint-disable-next-line react/display-name
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
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
            <IconButton onClick={() => handleOpenEditDialog(row.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa PLO">
            <IconButton onClick={() => handleOpenDeleteDialog(row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </StyledTableCell>
      </>
    );
  }

  function sortPLOsByTen(plos) {
    return [...plos].sort((a, b) => {
      const numA = parseInt(a.ten.replace(/\D/g, ""), 10);
      const numB = parseInt(b.ten.replace(/\D/g, ""), 10);
      return numA - numB;
    });
  }



  return (
    <Layout>
      <div style={styles.main}>
        <div style={styles.title}>
          <span>Danh sách PLO</span>
          <div style={styles.btnMore}>
            <IconButton aria-label="more actions">
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>
        <div style={{ width: 300, marginBottom: 16 }}>
          <Autocomplete
            options={nganhs}
            getOptionLabel={option => option.ten || ""}
            value={selectedNganh}
            onChange={(e, v) => setSelectedNganh(v)}
            renderInput={params => <TextField {...params} label="Chọn chương trình đào tạo" variant="outlined" />}
            noOptionsText="Không có ngành"
          />
        </div>
        {selectedNganh && (
          <>
            <div style={styles.tbActions}>
              <div style={styles.ipSearch}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "2px solid #ccc",
                    borderRadius: "20px",
                    padding: "4px 8px",
                    width: "100%",
                    maxWidth: "100%",
                    "&:focus-within": {
                      border: "2px solid #337AB7",
                    },
                    height: "100%",
                  }}
                >
                  <TextField
                    fullWidth
                    fontSize="10px"
                    placeholder="Tìm kiếm theo tên PLO..."
                    variant="standard"
                    autoComplete="off"
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
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </Box>
              </div>
              <div style={styles.btnCreate}>
                <Button
                  sx={{ width: "100%" }}
                  variant="contained"
                  onClick={handleOpenAddDialog}
                >
                  Tạo PLO
                </Button>
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
              <Dialog
                id="suaPLO"
                fullWidth
                open={openEditDialog}
                onClose={handleCloseDialogEdit}
              >
                <DialogTitle>Sửa thông tin PLO:</DialogTitle>
                <DialogContent>
                  <DialogContentText>Sửa thông tin PLO</DialogContentText>
                  <TextField
                    autoFocus
                    required
                    id="suatenPLO"
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
                    autoComplete="off"
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
                    autoComplete="off"
                  />
                  <Autocomplete
                    options={nganhs}
                    getOptionLabel={(option) => option.ten || ""}
                    noOptionsText="Không tìm thấy ngành"
                    required
                    id="disable-clearable"
                    disableClearable
                    value={dialogNganh}
                    onChange={(event, newValue) => setDialogNganh(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn ngành"
                        variant="standard"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.ten}
                      </li>
                    )}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialogEdit}>HỦY</Button>
                  <Button onClick={handleSubmitEdit}>LƯU</Button>
                </DialogActions>
              </Dialog>
              <Dialog
                id="themPLO"
                fullWidth
                open={openAddDialog}
                onClose={handleCloseDialogAdd}
              >
                <DialogTitle>Thêm mới PLO</DialogTitle>
                <DialogContent>
                  <DialogContentText>Nhập thông tin PLO mới</DialogContentText>
                  <TextField
                    autoFocus
                    required
                    id="themTenPLO"
                    margin="dense"
                    label="Tên PLO"
                    fullWidth
                    variant="standard"
                    value={tenPLO}
                    onChange={(e) => {
                      setTenPLO(e.target.value);
                      setErrorTenPLO(e.target.value.trim() === "");
                    }}
                    error={errorTenPLO}
                    helperText={errorTenPLO ? "Vui lòng nhập tên PLO" : ""}
                    autoComplete="off"
                  />
                  <TextField
                    required
                    id="themMoTaPLO"
                    margin="dense"
                    label="Mô tả cho PLO"
                    variant="standard"
                    fullWidth
                    value={moTaPLO}
                    onChange={(e) => {
                      setMoTaPLO(e.target.value);
                      setErrorMoTaPLO(e.target.value.trim() === "");
                    }}
                    error={errorMoTaPLO}
                    helperText={errorMoTaPLO ? "Vui lòng nhập mô tả cho PLO" : ""}
                    autoComplete="off"
                  />
                  <TextField
                    label="Chọn Chương trình đào tạo"
                    variant="standard"
                    fullWidth
                    value={dialogNganh?.ten || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ marginTop: 2 }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialogAdd}>HỦY</Button>
                  <Button onClick={handleAddSubmit}>TẠO</Button>
                </DialogActions>
              </Dialog>
            </div>
          </>
        )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <MuiAlert
            variant="filled"
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </Layout>
  );
}

export default TestPage;
