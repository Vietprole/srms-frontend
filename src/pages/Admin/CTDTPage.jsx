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
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Fade } from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Layout from "../Layout";
import TestDialog from "@/components/DialogHocPhan";
import { getProgrammeManagerId, getRole } from "@/utils/storage";
import { useCallback } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import DialogPLO from "../../components/DialogPLO";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DialogPLOHocPhan from "../../components/DialogMappingPLO_Cource";
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import {getMajors} from "@/api/api-majors";
import {getProgrammes,createProgramme,getProgrammeById,updateProgramme,copyProgrammeStructure} from "@/api/api-programmes";
import {getAccountsByRole} from "@/api/api-accounts"
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
function CTDTPage() {
  const styles = {
    main: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: "10px",
      boxSizing: "border-box",
      overflow: "hidden",
    },

    title: {
      width: "100%",
      fontSize: "1.2em",
      fontFamily: "Roboto",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    btnMore: {
      display: "flex",
      justifyContent: "flex-end",
      marginLeft: "auto",
    },

    tbActions: {
      width: "100%",
      marginTop: 10,
      display: "flex",
      alignItems: "center", // căn giữa dọc cho cả dòng
      gap: "10px", // khoảng cách giữa các phần tử
      paddingBottom: "10px",
    },

    ipSearch: {
      width: "30%",
      height: 40,
      justifyContent: "flex-start",
      borderRadius: "5px",
    },

    cbKhoa: {
      width: "22%",
      display: "flex",
      alignItems: "center",
      height: 40, // 👈 Thêm chiều cao cụ thể
      marginLeft: "10px",
    },

    btnCreate: {
      width: "10%",
      height: 40,
      display: "flex",
      marginLeft: "auto",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "5px",
      color: "white",
      cursor: "pointer",
    },
    btnInte: {
      width: '15%',
      height: 40,
      display: 'flex',
      marginLeft: '0',
      alignItems: 'center',
      borderRadius: '5px',
      color: 'white',
      cursor: 'pointer',
    },
  
    table: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      width: "100%", // 👈 thêm dòng này
    },

    divPagination: {
      flexShrink: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid #eee",
      backgroundColor: "#f5f5f5",
      padding: "5px 10px",
    },

    squareStyle: {
      width: 40,
      height: 35,
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      borderLeft: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      cursor: "pointer",
      boxSizing: "border-box",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: "#0071A6",
        color: "#fff",
      },
    },
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [openAddNganh, setOpenAddNganh] = React.useState(false);
  const [openEditNganh, setOpenEditNganh] = React.useState(false);

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [errorTenNganh, setErrorTenNganh] = useState(false);
  const [errorMaNganh, setErrorMaNganh] = useState(false);
  const [tenNganh, setTenNganh] = useState("");
  const [maNganh, setMaNganh] = useState("");
  const [nganhId, setNganhId] = useState("");
  const inputRef = useRef("");
  // const [selectedKhoaFilter, setSelectedKhoaFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [openPLO, setOpenPLO] = useState(false); // Dialog PLO nếu cần sử dụng
  const [openDialogPLOHocPhan, setOpenDialogPLOHocPhan] = useState(false);// Lấy id người quản lý CTĐT từ role, mặc định là 0 nếu không có
  const [nganhs,setNganhs] = useState([]);
  const [selectedNganh,setSelectedNganh] =useState(null);
  const [selectedTaiKhoan,setSelectedTaiKhoan] =useState(null);
  const [taikhoans,setTaiKhoans]=useState([]);
  const [selectedYearInName, setSelectedYearInName] = useState(null);

  const [openDialogKeThua, setOpenDialogKeThua] = useState(false); // Dialog kế thừa CTĐT nếu cần sử dụng
  const [sourceCtdt, setSourceCtdt] = useState(null); // Lưu CTĐT nguồn để kế thừa
  const [copyCtdt, setCopyCtdt] = useState(null); // Lưu CTĐT đã sao chép để kế thừa
  const [selectedSourceCtdt, setSelectedSourceCtdt] = useState(null); // Lưu CTĐT nguồn đã chọn để kế thừa
  const [selectedCopyCtdt, setSelectedCopyCtdt] = useState(null); // Lưu CTĐT đã sao chép đã chọn để kế thừa

  const handleOpenDialogKeThua =async () => {
    const copy= await getProgrammes({}); // Lấy danh sách CTĐT để kế thừa
    setCopyCtdt(copy);
    setOpenDialogKeThua(true);
  };
  const handleCloseDialogKeThua = () => {
    setOpenDialogKeThua(false);
    setSourceCtdt(null);
    setCopyCtdt(null);
    setSelectedSourceCtdt(null);
    setSelectedCopyCtdt(null);
  };

  const handleChangeCopyCtdt = async (event, newValue) => {
    setSelectedCopyCtdt(newValue); // ngành muốn kế thừa
    if (newValue) {
      const source = await getProgrammes({ majorId: newValue.majorId });
      setSourceCtdt(source); // Cập nhật danh sách CTĐT nguồn
    } else {
      setSourceCtdt([]);
    }
  };

  const handleChangeSourceCtdt = (event, newValue) => {
    setSelectedSourceCtdt(newValue); // CTĐT gốc đã chọn để sao chép
  };

  const handleSubmitKeThua = async () => {
    if (!selectedCopyCtdt || !selectedSourceCtdt) {
      setSnackbarMessage("Vui lòng chọn CTĐT cần kế thừa và CTĐT nguồn");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    console.log("Selected Copy CTDT:", selectedCopyCtdt.id);
    console.log("Selected Source CTDT:", selectedSourceCtdt.id);
    try {
      const response = await copyProgrammeStructure(selectedCopyCtdt.id, selectedSourceCtdt.id);
      console.log(response);
      if (response.status === 200) {
        setSnackbarMessage("Kế thừa chương trình đào tạo thành công");
        setSnackbarSeverity("success");
        setOpenDialogKeThua(false); // Đóng dialog sau khi kế thừa thành công
        setOpenSnackbar(true);
        fetchData(); // Làm mới danh sách CTĐT
      } else {
        setSnackbarMessage("Lỗi không xác định khi kế thừa chương trình đào tạo");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      const errorMsg = error.message || "Lỗi: Không thể kế thừa chương trình đào tạo";
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };



  const handleOpenPLO = (id) => {
    setNganhId(id); // Lưu id nganh để sử dụng trong Dialog PLO
    setOpenPLO(true);
  };
  const handleClosePLO = () => {
    setOpenPLO(false);
  };

  const handleOpenDialogPLOHocPhan = (id) => {
    setNganhId(id);
    setOpenDialogPLOHocPhan(true);
  };
  const handleCloseDialogPLOHocPhan = () => {
    setOpenDialogPLOHocPhan(false);
  };

  const [pageSize, setPageSize] = useState(20); // tùy chọn mặc định
  const pageSizeOptions = [20, 50, 100]; // tuỳ bạn thêm số lựa chọn

  const totalItems = filteredData.length;
  const startRow = (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalItems);
  const totalPages = Math.ceil(totalItems / pageSize);
  let pagesToShow = [];

  if (totalPages <= 4) {
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (page <= 3) {
      pagesToShow = [1, 2, 3, "more", totalPages];
    } else if (page >= totalPages - 2) {
      pagesToShow = [1, "more", totalPages - 2, totalPages - 1, totalPages];
    } else {
      pagesToShow = [1, "more", page - 1, page, page + 1, "more", totalPages];
    }
  }

  // Lấy dữ liệu cho trang hiện tại
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => (2020 + i).toString());
  



  const role = getRole();
  const programmeManagerId = getProgrammeManagerId();

  const handleOpenDialog = (id) => {
    setNganhId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenEdit = async (id) => {
    const taikhoans = await getAccountsByRole(3); // Gọi API lấy danh sách tài khoản
    setTaiKhoans(taikhoans);

    const nganh = await getProgrammeById(id);
    setTenNganh(nganh.name);
    setMaNganh(nganh.code);
    setSelectedNganh(nganh.majorName);
    inputRef.current = nganh.name;

    // Gán sẵn người quản lý tương ứng
    const selectedAccount = taikhoans.find(
      (acc) => acc.id === nganh.managerAccountId
    );
    setSelectedTaiKhoan(selectedAccount || null); // Gán giá trị nếu có

    setOpenEditNganh(true);
    setNganhId(id);
  };

  const handleAddNganhs = async () => {
    const nganhData = await getMajors();
    setNganhs(nganhData);
    const taikhoans = await getAccountsByRole(3); // Đợi API trả về dữ liệu
    setTaiKhoans(taikhoans);
    setOpenAddNganh(true);
  };

  const handleCloseEditNganh = () => {
    setOpenEditNganh(false);
    setErrorTenNganh(false);
    setSelectedTaiKhoan(null);
    setTenNganh("");
    setMaNganh("");
    setNganhId("");
    setTaiKhoans([]);
  };

  const handleCloseNganhs = () => {
    setOpenAddNganh(false);
    setErrorTenNganh(false);
    setErrorMaNganh(false);
    setNganhs([]);
    setMaNganh("");
    setTaiKhoans([]);
  };
  const handleSubmit = async () => {
    if (tenNganh.trim() === "") {
      setSnackbarMessage("Tên chương trình đào tạo không được để trống");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setErrorTenNganh(true);
      return;
    }

    if (maNganh.trim() === "") {
      setSnackbarMessage("Mã chương trình đào tạo không được để trống");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (selectedNganh === null) {
      setSnackbarMessage("Vui lòng chọn ngành");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (selectedTaiKhoan === null) {
      setSnackbarMessage("Vui lòng chọn ngành");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const majorData = {
      name: tenNganh.trim(),
      code: maNganh.trim(),
      majorId: selectedNganh.id,
      managerAccountId: selectedTaiKhoan,
    };
    try {
      const response = await createProgramme(majorData);
      if (response.status === 201) {
        setSnackbarMessage("Thêm chương trình đào tạo thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        fetchData(); // làm mới danh sách ngành
        handleCloseNganhs(); // đóng dialog/modal
      } else {
        setSnackbarMessage("Lỗi không xác định khi thêm chương trình đào tạo");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      const errorMsg =
        error.message || "Lỗi: Không thể thêm chương trình đào tạo";
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  
  const fetchData = useCallback(async () => {
    try {
      if (role === "ProgrammeManager" && programmeManagerId !== 0) {
        const programmes = await getProgrammes({
          managerAccountId: programmeManagerId,
        });
        setData(programmes);
      } else {
        const programmes = await getProgrammes({});
        setData(programmes);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      console.log(error);
    }
  }, [role, programmeManagerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Only set filteredData once data has been loaded
    setFilteredData(data);
  }, [data]);

  const filterData = (query, yearInName = selectedYearInName) => {
    let filtered = data;
  
    // Tìm theo chuỗi search tự do
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowerQuery)
        )
      );
    }
  
    // Tìm theo năm nằm trong tên ngành
    if (yearInName) {
      filtered = filtered.filter((row) =>
        row.name.toLowerCase().includes(yearInName.toLowerCase())
      );
    }
  
    setFilteredData(filtered);
  };
  

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleEditSubmit = async (nganhId) => {
    const tenMoi = inputRef.current.trim();

    if (tenMoi === "") {
      setSnackbarMessage("Tên chương trình đào tạo không được để trống");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setErrorTenNganh(true);
      return;
    }

    if (selectedTaiKhoan === null) {
      setSnackbarMessage("Vui lòng chọn người quản lý");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const nganhData = {
      name: tenMoi,
      managerAccountId: selectedTaiKhoan.id, // 👈 Thêm dòng này để API nhận người quản lý
    };

    try {
      const response = await updateProgramme(nganhId, nganhData);

      if (response.status === 200) {
        setSnackbarMessage("Sửa chương trình đào tạo thành công");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        fetchData(); // Tải lại danh sách
        handleCloseEditNganh();
      } else if (response.status === 404) {
        setSnackbarMessage("Chương trình đào tạo không tồn tại");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage("Lỗi: Không thể sửa chương trình đào tạo");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setSnackbarMessage("Lỗi: Không thể sửa chương trình đào tạo");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(1); // 👉 Reset về trang đầu tiên khi tìm kiếm
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
  const [anchorPosition, setAnchorPosition] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleOpenPopover = (event, rowId) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setAnchorPosition({ top: rect.bottom, left: rect.left });
    setSelectedRowId(rowId);
  };

  const handleClosePopover = () => {
    setAnchorPosition(null);
    setSelectedRowId(null);
  };

  return (
    <Layout>
      <div style={styles.main}>
        <div style={styles.title}>
          <span>Danh sách chương trình đào tạo</span>
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
                placeholder="Tìm kiếm theo tên chương trình đào tạo..."
                variant="standard"
                autoComplete="off"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <React.Fragment>
                      <IconButton aria-label="more actions" size="small">
                        <SearchIcon sx={{ color: "#888" }} fontSize="small" />
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
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Autocomplete
                options={years}
                value={selectedYearInName}
                onChange={(event, newValue) => {
                  setSelectedYearInName(newValue);
                  setPage(1);
                  filterData(searchQuery, newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Chọn năm học" size="small" />
                )}
                sx={{ width: 250 }}
              />
            </Box>
          </div>
          <div style={styles.btnInte}>
               <Button
                sx={{ width: "100%" }}
                variant="contained"
                startIcon={<MoveToInboxIcon />}
                onClick={handleOpenDialogKeThua} // Mở dialog kế thừa CTĐT
              >
                Kế thừa ctđt 
              </Button>
              <Dialog
                id="keThuaNganh"
                fullWidth
                open={openDialogKeThua}
                onClose={handleCloseDialogKeThua}
              >
                <DialogTitle>Kế thừa chương trình đào tạo</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Autocomplete
                    options={copyCtdt || []}
                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                    noOptionsText="Không tìm thấy CTĐT"
                    disableClearable
                    value={selectedCopyCtdt}
                    onChange={handleChangeCopyCtdt}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn CTĐT cần kế thừa"
                        variant="standard"
                      />
                    )}
                  />

                  <Autocomplete
                    options={
                      (sourceCtdt || []).filter(
                        (item) => item.id !== selectedCopyCtdt?.id // 👈 lọc bỏ chính CTĐT đã chọn ở trên
                      )
                    }
                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                    noOptionsText={
                      selectedCopyCtdt
                        ? "Không tìm thấy CTĐT nguồn"
                        : "Vui lòng chọn CTĐT cần kế thừa trước"
                    }
                    disableClearable
                    disabled={!selectedCopyCtdt}
                    value={selectedSourceCtdt}
                    onChange={handleChangeSourceCtdt}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn CTĐT nguồn (ngành gốc)"
                        variant="standard"
                      />
                    )}
                  />

                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseDialogKeThua}>Hủy</Button>
                <Button onClick={handleSubmitKeThua}>Lưu</Button>
              </DialogActions>
              </Dialog>

            </div>
          <div style={styles.btnCreate}>
            
            {role === "Admin" && (
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                onClick={handleAddNganhs}
              >
                Tạo CTĐT
              </Button>
            )}
            <Dialog
              id="addNganh"
              fullWidth
              open={openAddNganh}
              onClose={handleCloseNganhs}
            >
              <DialogTitle>Tạo ctđt mới:</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Thêm ctđt mới vào hệ thống
                </DialogContentText>
                <Autocomplete
                  options={nganhs}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  noOptionsText="Không tìm thấy ngành"
                  required
                  id="disable-clearable"
                  disableClearable
                  onChange={(event, newValue) => setSelectedNganh(newValue)} // Cập nhật state khi chọn khoa
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn ngành"
                      variant="standard"
                    />
                  )}
                />

                <TextField
                  autoFocus
                  required
                  id="tenNganh"
                  margin="dense"
                  label="Tên chương trình đào tạo"
                  fullWidth
                  variant="standard"
                  onBlur={(e) => setTenNganh(e.target.value.trim())}
                  error={errorTenNganh}
                  onInput={(e) =>
                    setErrorTenNganh(e.target.value.trim() === "")
                  }
                  helperText="Vui lòng nhập tên ctđt"
                  autoComplete="off"
                />
                <TextField
                  autoFocus
                  required
                  id="maNganh"
                  margin="dense"
                  label="Mã chương trình đào tạo"
                  fullWidth
                  variant="standard"
                  onBlur={(e) => setMaNganh(e.target.value.trim())}
                  error={errorMaNganh}
                  onInput={(e) => setErrorMaNganh(e.target.value.trim() === "")}
                  helperText="Vui lòng nhập mã chương trình đào tạo"
                  autoComplete="off"
                />
                <Autocomplete
                  options={taikhoans}
                  getOptionLabel={(option) =>
                    option ? `${option.id} - ${option.name}` : ""
                  }
                  noOptionsText="Không tìm thấy tài khoản"
                  required
                  disableClearable
                  onChange={(event, newValue) =>
                    setSelectedTaiKhoan(newValue?.id || null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn người quản lý"
                      variant="standard"
                    />
                  )}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseNganhs}>Hủy</Button>
                <Button onClick={handleSubmit}>Lưu</Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
        <div style={styles.table}>
          <DialogPLO
            open={openPLO}
            onClose={handleClosePLO}
            nganhId={nganhId}
          />
          <DialogPLOHocPhan
            open={openDialogPLOHocPhan}
            onClose={handleCloseDialogPLOHocPhan}
            nganhId={nganhId}
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#0071A6",
                }}
              >
                <TableRow>
                  <StyledTableCell align="center">STT</StyledTableCell>
                  <StyledTableCell align="center">Mã CTĐT</StyledTableCell>
                  <StyledTableCell align="center">Tên CTĐT</StyledTableCell>
                  <StyledTableCell align="center">
                    Người quản lý
                  </StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflowY: "auto" }}>
                {paginatedData.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">
                      {(page - 1) * pageSize + index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.code}</StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.managerName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenPopover(e, row.id)}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>

                      {/* Popover chỉ hiện với row đang chọn */}
                      {selectedRowId === row.id && (
                        <Popover
                          open={Boolean(anchorPosition)}
                          anchorReference="anchorPosition"
                          anchorPosition={anchorPosition}
                          onClose={handleClosePopover}
                          anchorOrigin={{ vertical: "top", horizontal: "left" }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          PaperProps={{
                            sx: { p: 1.5, minWidth: 160 },
                          }}
                        >
                          {(role === "Admin" || role === "AcademicAffairs") && (
                            <MenuItem
                              onClick={() => {
                                handleClickOpenEdit(row.id);
                                handleClosePopover();
                              }}
                            >
                              <EditIcon fontSize="small" sx={{ mr: 1 }} />
                              Sửa CTĐT
                            </MenuItem>
                          )}

                          <MenuItem
                            onClick={() => {
                              handleOpenDialog(row.id);
                              handleClosePopover();
                            }}
                          >
                            <FormatListBulletedIcon
                              fontSize="small"
                              sx={{ mr: 1 }}
                            />
                            Xem danh sách học phần
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              handleOpenPLO(row.id);
                              handleClosePopover();
                            }}
                          >
                            <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
                            Quản lý PLO
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleOpenDialogPLOHocPhan(row.id);
                              handleClosePopover();
                            }}
                          >
                            <ChecklistRtlIcon fontSize="small" sx={{ mr: 1 }} />
                            Nối PLO-Học phần
                          </MenuItem>
                        </Popover>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}

                <TestDialog
                  nganhId={nganhId}
                  open={openDialog}
                  onClose={handleCloseDialog}
                />
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog
            id="editNganh"
            fullWidth
            open={openEditNganh}
            onClose={handleCloseEditNganh}
            TransitionComponent={Fade}
          >
            <DialogTitle>Sửa chương trình đào tạo:</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Sửa thông tin chương trình đào tạo
              </DialogContentText>
              {/* Mã ctđt: Chỉ đọc */}
              <TextField
                required
                margin="dense"
                label="Mã chương trình đào tạo"
                fullWidth
                variant="standard"
                InputProps={{ readOnly: true }}
                focused={false}
                value={maNganh}
                autoComplete="off"
                helperText="Mã chương trình đào tạo không thể thay đổi"
              />
              <TextField
                required
                margin="dense"
                label="Tên chương trình đào tạo"
                fullWidth
                variant="standard"
                defaultValue={tenNganh}
                error={errorTenNganh}
                onChange={(e) => (inputRef.current = e.target.value)} // Lưu vào ref, không setState
                onBlur={(e) => setErrorTenNganh(e.target.value.trim() === "")}
                helperText={
                  errorTenNganh
                    ? "Tên chương trình đào tạo không được để trống"
                    : ""
                }
                autoComplete="off"
              />
              <TextField
                required
                margin="dense"
                label="Thuộc ngành"
                fullWidth
                variant="standard"
                defaultValue={selectedNganh}
                helperText="Không thể thay đổi ngành"
                InputProps={{ readOnly: true }}
                focused={false}
                autoComplete="off"
              />
              <Autocomplete
                options={taikhoans}
                value={selectedTaiKhoan}
                getOptionLabel={(option) =>
                  option ? `${option.id} - ${option.name}` : ""
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                noOptionsText="Không tìm thấy tài khoản"
                required
                disableClearable
                onChange={(event, newValue) => setSelectedTaiKhoan(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn người quản lý"
                    variant="standard"
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditNganh}>Hủy</Button>
              <Button onClick={() => handleEditSubmit(nganhId)}>Lưu</Button>
            </DialogActions>
          </Dialog>

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

        <div style={styles.divPagination}>
          {/* Trái: các nút số trang */}
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                ...styles.squareStyle,
                borderLeft: "1px solid #ccc",
                borderTopLeftRadius: "6px",
                borderBottomLeftRadius: "6px",
                opacity: page === 1 ? 0.5 : 1,
                pointerEvents: page === 1 ? "none" : "auto",
              }}
              onClick={() => setPage(page - 1)}
            >
              <ArrowLeftIcon fontSize="small" />
            </Box>

            {pagesToShow.map((item, idx) =>
              item === "more" ? (
                <Box
                  key={`more-${idx}`}
                  sx={{ ...styles.squareStyle, pointerEvents: "none" }}
                >
                  <MoreHorizIcon fontSize="small" />
                </Box>
              ) : (
                <Box
                  key={item}
                  sx={{
                    ...styles.squareStyle,
                    ...(page === item
                      ? {
                          backgroundColor: "#0071A6",
                          color: "#fff",
                          fontWeight: "bold",
                        }
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
                borderTopRightRadius: "6px",
                borderBottomRightRadius: "6px",
                opacity: page >= totalPages ? 0.5 : 1,
                pointerEvents: page >= totalPages ? "none" : "auto",
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
            <span style={{ fontSize: 14, color: "#333" }}>
              Dòng {startRow} đến {endRow} / {totalItems}
            </span>
          </Box>
        </div>
      </div>
    </Layout>
  );
}

export default CTDTPage;
