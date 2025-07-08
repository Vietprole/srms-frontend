import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import {  Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";

import Layout from "../Layout";
import { getRole, getNguoiQuanLyCTDTId } from "@/utils/storage";
import { useCallback } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import lessonIcon from "@/assets/icons/lesson-icon.png"; //
import DialogHocPhanCLO from "../../components/DialogHocPhanCLO";
import { getProgrammes } from "@/api/api-programmes";
function TestPage() {
  const styles = {
    main: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
  
    title: {
      width: '100%',
      fontSize: '1.2em',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  
    btnMore: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginLeft: 'auto',
    },
  
    tbActions: {
      width: '100%',
      marginTop: 10,
      display: 'flex',
      alignItems: 'center', // căn giữa dọc cho cả dòng
      gap: '10px',          // khoảng cách giữa các phần tử
      paddingBottom: '10px',
    },
    
  
    ipSearch: {
      width: '30%',
      height: 40,
      justifyContent: 'flex-start',
      borderRadius: '5px',
    },
  
    cbKhoa: {
      width: "22%",
      display: "flex",
      alignItems: "center",
      height: 40, // 👈 Thêm chiều cao cụ thể
      marginLeft: "10px",
    },
    
    
  
    btnCreate: {
      width: '10%',
      height: 40,
      display: 'flex',
      marginLeft: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      color: 'white',
      cursor: 'pointer',
    },
  
    table: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      width: '100%', // 👈 thêm dòng này
    },
    
  
    divPagination: {
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #eee',
      backgroundColor: '#f5f5f5',
      padding: '5px 10px',
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

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [page, setPage] = useState(1);
  const [nganhId, setNganhId] = useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = (id) => {
    setNganhId(id);
    setOpenDialog(true);
  };
 

  const [pageSize, setPageSize] = useState(20); // tùy chọn mặc định
  const pageSizeOptions = [20,50,100]; // tuỳ bạn thêm số lựa chọn

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


  const role = getRole();
  const nguoiQuanLyCTDTId = getNguoiQuanLyCTDTId();

  




  // console.log("role, nguoiQuanLyCTDTId: ", role, nguoiQuanLyCTDTId);
  const fetchData = useCallback(async () => {
    try {
      let programmes = [];
  
      if (role === "ProgrammeManager" && nguoiQuanLyCTDTId !== 0) {
        // Gọi API với managerAccountId
        programmes = await getProgrammes({ managerAccountId: nguoiQuanLyCTDTId });
      } else {
        // Gọi API lấy tất cả chương trình
        programmes = await getProgrammes({});
      }
  
      setData(programmes);
    } catch (error) {
      console.error("Lỗi khi fetch danh sách chương trình:", error);

    }
  }, [role, nguoiQuanLyCTDTId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Only set filteredData once data has been loaded
    setFilteredData(data);
  }, [data]);

  const filterData = (query) => {
    if (!query.trim()) {
      setFilteredData(data); // If search query is empty, show all data
    } else {
      const filtered = data.filter((row) =>
        row.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  // const handleSnackbarClose = () => {
  //   setOpenSnackbar(false);
  // };



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
          
        </div>
        <div style={styles.table}>
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
                  {/* <StyledTableCell align="center">
                    Người quản lí
                  </StyledTableCell> */}
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflowY: "auto" }}>
  {paginatedData.map((row, index) => (
    <StyledTableRow key={row.id}>
      <StyledTableCell align="center">{(page - 1) * pageSize + index + 1}</StyledTableCell>
      <StyledTableCell align="center">{row.code}</StyledTableCell>
      <StyledTableCell align="center">{row.name}</StyledTableCell>
      {/* <StyledTableCell align="center">{row.tenNguoiQuanLy}</StyledTableCell> */}
      <StyledTableCell align="center">
        <Tooltip
          title="Xem danh sách học phần của CTĐT"
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
         <img
          src={lessonIcon}
          alt="Lesson Icon"
          style={{ width: 18, height: 18 }}
        />
        </IconButton>
        </Tooltip>
        
       
        
      </StyledTableCell>
    </StyledTableRow>
  ))}
  <DialogHocPhanCLO
    nganhId={nganhId}
    open={openDialog}
    onClose={handleCloseDialog}
  />

</TableBody>

            </Table>
          </TableContainer>
        </div>

        <div style={styles.divPagination}>
  {/* Trái: các nút số trang */}
  <Box display="flex" alignItems="center">
  <Box
    sx={{
      ...styles.squareStyle,
      borderLeft: '1px solid #ccc',
      borderTopLeftRadius: '6px',
      borderBottomLeftRadius: '6px',
      opacity: page === 1 ? 0.5 : 1,
      pointerEvents: page === 1 ? 'none' : 'auto',
    }}
    onClick={() => setPage(page - 1)}
  >
    <ArrowLeftIcon fontSize="small" />
  </Box>

  {pagesToShow.map((item, idx) =>
  item === 'more' ? (
    <Box key={`more-${idx}`} sx={{ ...styles.squareStyle, pointerEvents: 'none' }}>
      <MoreHorizIcon fontSize="small" />
    </Box>
  ) : (
    <Box
      key={item}
      sx={{
        ...styles.squareStyle,
        ...(page === item
          ? { backgroundColor: '#0071A6', color: '#fff', fontWeight: 'bold' }
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
      borderTopRightRadius: '6px',
      borderBottomRightRadius: '6px',
      opacity: page >= totalPages ? 0.5 : 1,
      pointerEvents: page >= totalPages ? 'none' : 'auto',
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
    <span style={{ fontSize: 14, color: '#333' }}>
      Dòng {startRow} đến {endRow} / {totalItems}
    </span>
  </Box>
</div>
      </div>
    </Layout>
  );
}

export default TestPage;
