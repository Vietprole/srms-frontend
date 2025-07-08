import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import Typography  from "@mui/material/Typography";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Checkbox from "@mui/material/Checkbox";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Autocomplete from '@mui/material/Autocomplete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogCLO from "./DialogCLO";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import DialogMapPLOCLO from "./DialogMapPLOCLO";
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';
import { getProgrammeById,getCoursesInProgramme } from "../api/api-programmes";
// eslint-disable-next-line react/prop-types
function DialogHocPhanCLO({ nganhId, open, onClose }) {
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
      width: "100%",
      height: "60px",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap", // nếu màn hình hẹp sẽ xuống dòng hợp lý
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
      flexGrow: 1,
      minWidth: "300px",
      gap: "10px",
    },
    
    btnDelete: {
      width: "18%",
      height: "100%",
      marginLeft: "auto", // Đẩy qua phải
      padding: "0 10px",
    },
    btnSave: {
      width: "10%",
      height: "100%",
      marginRight: "10px",
    },
    btnAdd: {
      width: "18%",
      height: "100%",
    },
    
    divPagination: {
      width: '100%',
      height: '100%',
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
  
    squareStyle: {
      width: 40,
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
  const [nganh, setNganh] = useState(null);
  const [hocPhanDaChon, setHocPhanDaChon] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(hocPhanDaChon); // Lưu dữ liệu đã lọc
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // tùy chọn mặc định
  const pageSizeOptions = [20,50,100]; // tuỳ bạn thêm số lựa chọn
  const [onlyShowCotLoi, setOnlyShowCotLoi] = useState(false);
  const [openDialog,setOpenDialog] = useState(false); // Trạng thái mở DialogCLO
  const [hocPhanId, setHocPhanId] = useState(null); // Lưu ID học phần để truyền vào DialogCLO
  const [openDialogPLOCLO, setOpenDialogPLOCLO] = useState(false); // Trạng thái mở DialogMapPLOCLO
  const handleOpenDialogPLOCLO = (row) => {
    setHocPhanId(row.id); // Lưu ID học phần để truyền vào DialogMapPLOCLO
    setOpenDialogPLOCLO(true);
  };

  const handleOpenDialog = (id) => {
    setHocPhanId(id); // Lưu ID học phần để truyền vào DialogCLO
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const totalItems = filteredData.length;
  const startRow = (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalItems);
  const totalPages = Math.ceil(totalItems / pageSize);
  let pagesToShow = [];
  
  if (totalPages <= 4) {
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (page <= 3) {
      pagesToShow = [1, 2, 3, 'more', totalPages];
    } else if (page >= totalPages - 2) {
      pagesToShow = [1, 'more', totalPages - 2, totalPages - 1, totalPages];
    } else {
      pagesToShow = [1, 'more', page - 1, page, page + 1, 'more', totalPages];
    }
  }

  // Lấy dữ liệu cho trang hiện tại
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  
  useEffect(() => {
    if (open && nganhId) {
      fetchData();
    }

  }, [nganhId, open]);

  const fetchData = async () => {
    try {
      const nganhs = await getProgrammeById(nganhId);
      const hocphans = await getCoursesInProgramme(nganhId);
      console.log("Dữ liệu học phần:", hocphans);
      setHocPhanDaChon(hocphans);
      setFilteredData(hocphans);
      setNganh(nganhs);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ctđt:", error);
    }
  };

  const handleClose = () => {
    setSearchQuery(""); // Reset search query when closing dialog
    setOnlyShowCotLoi(false); // Reset checkbox state
    onClose();
  };

    
  const handleSearchChange = (event) => {
    setPage(1);
    const value = event.target.value;
    setSearchQuery(value);
    filterData(value, onlyShowCotLoi);
  };
  

  const filterData = (query, cotLoiOnly = onlyShowCotLoi) => {
    let data = hocPhanDaChon;
  
    // Nếu có tìm kiếm
    if (query.trim()) {
      data = data.filter((row) =>
        row.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    // Nếu có tick checkbox cốt lõi
    if (cotLoiOnly) {
      data = data.filter((row) => row.isCore);
    }
  
    setFilteredData(data);
  };
  

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0071A6",
      color: theme.palette.common.white,
      borderRight: '1px solid #ddd', // Đường phân cách dọc
      padding: '4px 8px', // Reduced padding here
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '4px 8px', // Reduced padding for body cells
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
    height: '25px', // Reduce row height here
  }));


  return (
    <Dialog
      maxWidth="xl"
      fullWidth
      open={open}
      onClose={handleClose}
      TransitionProps={{
        onExited: () => setNganh(null), // Đặt lại giá trị khi Dialog đóng hoàn toàn
      }}
    >
      <DialogTitle fontSize={"18px"} fontWeight={"bold"}>
        Danh sách học phần thuộc ctđt:  
        <Typography component="span" color="info.main" fontWeight="bold">
          {nganh ? ` ${nganh.name}` : " Đang tải..."}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {nganh ? (
          <div style={styles.main}>
 <Box sx={styles.mainAction}>
  {/* Ô tìm kiếm + checkbox */}
  <Box sx={styles.tfSearch}>
  <Box
  sx={{
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc", // giảm border dày
    borderRadius: "16px",
    padding: "2px 6px", // giảm padding
    width: "30%",
    height: "34px", // giảm chiều cao
    "&:focus-within": {
      border: "1px solid #337AB7",
    },
  }}
>

      <TextField
        fullWidth
        placeholder="Tìm kiếm theo tên học phần..."
        variant="standard"
        autoComplete="off"
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <IconButton aria-label="search">
              <SearchIcon sx={{ color: "#888" }} />
            </IconButton>
          ),
        }}
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </Box>
    <FormControlLabel
      control={
        <Checkbox
          checked={onlyShowCotLoi}
          onChange={(e) => {
            setOnlyShowCotLoi(e.target.checked);
            filterData(searchQuery, e.target.checked);
          }}
        />
      }
      label="Chỉ hiện học phần cốt lõi"
      sx={{ whiteSpace: "nowrap" }}
    />
  </Box>
</Box>


            
            <Box sx={{ height: 500, display: "flex", flexDirection: "column" }}>
  <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "100px" }}>


        <TableContainer
        component={Paper}
        sx={{
          maxHeight: "100%", // hoặc chiều cao cố định của phần scroll
          overflowY: "auto",
        }}
      >

      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            backgroundColor: "#0071A6",
          }}
        >
          <TableRow>
           
            <StyledTableCell align="center">STT</StyledTableCell>
            <StyledTableCell align="center">Mã học phần</StyledTableCell>
            <StyledTableCell align="center">Tên học phần</StyledTableCell>
            <StyledTableCell align="center">Số tín chỉ</StyledTableCell>
            <StyledTableCell align="center">Là cốt lõi</StyledTableCell>
            <StyledTableCell align="center">Thao tác</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <StyledTableCell colSpan={7} align="center">
                Chưa có học phần được thêm vào ctđt
              </StyledTableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, index) => (
              <StyledTableRow key={row.id || index}>

                <StyledTableCell align="center" width={50}>{index + 1}</StyledTableCell>
                <StyledTableCell align="center" width={150}>{row.code}</StyledTableCell>
                <StyledTableCell align="left">{row.name}</StyledTableCell>
                <StyledTableCell align="center" width={150}>{row.credits}</StyledTableCell>
                <StyledTableCell align="center" width={150}>
                <Checkbox
                  checked={row.isCore}
                  readOnly
                  disableRipple
                  sx={{
                    color: row.isCore ? "green" : "grey.400",
                    '&.Mui-checked': {
                      color: "green",
                    },
                  }}
                />

                </StyledTableCell>
                <StyledTableCell align="center" width={150}>
                <Tooltip
                  title="Xem danh sách CLO của học phần"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#fff", // 👉 nền trắng
                        color: "#333",           // 👉 chữ đen
                        fontSize: 13,
                        boxShadow: 2,
                        borderRadius: 1,
                        px: 1.5,
                        py: 1,
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#fff", // 👉 màu của mũi tên tooltip
                      },
                    },
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(row.id)}
            
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip
                    title="Nối PLO - CLO của học phần"
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: "#fff", // 👉 nền trắng
                          color: "#333",           // 👉 chữ đen
                          fontSize: 13,
                          boxShadow: 2,
                          borderRadius: 1,
                          px: 1.5,
                          py: 1,
                        },
                      },
                      arrow: {
                        sx: {
                          color: "#fff", // 👉 màu của mũi tên tooltip
                        },
                      },
                    }}
                  >
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialogPLOCLO(row)}
            
                  >
                    <DatasetLinkedIcon fontSize="small"/>
                  </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>

     
  <Box
    sx={{
      position: "sticky",
      bottom: 0,
      backgroundColor: "#f5f5f5",
      zIndex: 2,
      p: 1,
      borderTop: "1px solid #ccc",
    }}
  >
    {/* Nội dung phân trang bạn đã viết */}
    <div style={styles.divPagination}>
      {/* Trái: nút phân trang */}
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
            <Box key={`more-${idx}`} sx={{ ...styles.squareStyle, pointerEvents: "none" }}>
              <MoreHorizIcon fontSize="small" />
            </Box>
          ) : (
            <Box
              key={item}
              sx={{
                ...styles.squareStyle,
                ...(page === item
                  ? { backgroundColor: "#0071A6", color: "#fff", fontWeight: "bold" }
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
        <DialogCLO
          nganhId={hocPhanId}
          open={openDialog}
          onClose={() => {handleCloseDialog();}}
        />
        <span style={{ fontSize: 14, color: "#333" }}>
          Dòng {startRow} đến {endRow} / {totalItems}
        </span>
      </Box>
    </div>
  </Box>
          </Box>
          <DialogMapPLOCLO
        nganhId={nganhId}
        hocPhanId={hocPhanId}
        open={openDialogPLOCLO}
        onClose={() => setOpenDialogPLOCLO(false)}
      />
            {/*  */}
          </div>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Đóng</Button>
      </DialogActions>

    </Dialog>
  );
}

export default DialogHocPhanCLO;
