import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import Typography  from "@mui/material/Typography";
import { Box } from "@mui/material";
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
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useCallback } from "react";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DialogContentText from "@mui/material/DialogContentText";
import {getCourseById} from "@/api/api-courses";
import { getAllCLOs } from "../api/api-clos";
import {getPLOs,getCLOsByPLOId,updateCLOsOfPLO} from "@/api/api-plos";
// eslint-disable-next-line react/prop-types
function DialogPLOHocPhan({ nganhId, open, onClose ,hocPhanId}) {
  const styles = {
    main: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
 // Tùy chỉnh phù hợp DialogTitle/DialogActions
      overflowY: "hidden", // Cho phép cuộn nếu nội dung vượt quá chiều cao
    },
    
    mainAction: {
      display: "flex",
      width: "100%",
      alignItems: "center", // 👈 giúp các thành phần canh theo trục dọc
      justifyContent: "space-between", // 👈 chia đều trái phải
      gap: "12px",
      paddingBottom: "10px",
      paddingTop: "10px",
    }
    
    ,
    mainContent: {
      display: "flex",
      flexDirection: "column",
      width: '100%',
      height:'100%',
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
      height: '50px', // cố định chiều cao
      flexShrink: 0, // không co lại
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: '0 16px',
      borderTop: '1px solid #ccc',
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
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0071A6",
      color: theme.palette.common.white,
      borderRight: '1px solid #ddd',
      padding: '4px 8px',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '4px 8px',
      borderRight: '1px solid #ddd',
    },
  }));
  
  const StyledTableRow = styled(TableRow)(() => ({
    '&:hover': {
      backgroundColor: '#D3F3FF',
      cursor: 'pointer',
    },
    height: '40px',
  }));
  const [hocPhanData, setHocPhanData] = useState(null); // Dữ liệu học phần, nếu cần hiển thị thêm thông tin
  
  const [hocPhanTheoPLO, setHocPhanTheoPLO] = useState({});
  const [originalHocPhanTheoPLO, setOriginalHocPhanTheoPLO] = useState({});
  const [lsPLO, setLsPLO] = useState([]);
  const [hocPhanDaChon, setHocPhanDaChon] = useState([]);
  const [selectedPLOs, setSelectedPLOs] = useState([]);
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const pageSizeOptions = [20, 50, 100];
  

  
  const totalItems = hocPhanDaChon.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startRow = (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalItems);
  const paginatedData = hocPhanDaChon.slice(startRow - 1, endRow);
  

  
  // Tạo số trang hiển thị
  let pagesToShow = [];
  if (totalPages <= 4) {
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (page <= 3) {
    pagesToShow = [1, 2, 3, 'more', totalPages];
  } else if (page >= totalPages - 2) {
    pagesToShow = [1, 'more', totalPages - 2, totalPages - 1, totalPages];
  } else {
    pagesToShow = [1, 'more', page - 1, page, page + 1, 'more', totalPages];
  }


  const fetchData = useCallback(async () => {
    if (!nganhId || !hocPhanId) return;
  
    try {
      // Lấy thông tin học phần
      const hocPhanResponse = await getCourseById(hocPhanId);
      setHocPhanData(hocPhanResponse);
  
      // Lấy CLO theo courseId
      const cloList = await getAllCLOs({ courseId: hocPhanId });
  
      // Lấy danh sách PLO theo ngành
      const ploList = await getPLOs({ programmeId: nganhId });
  
      // Lấy mapping CLO theo từng PLO
      const ploCloMap = {};
      for (const plo of ploList) {
        try {
          const clos = await getCLOsByPLOId(plo.id);
          ploCloMap[plo.id] = clos.map((clo) => clo.id);
        } catch (error) {
          console.error(`Lỗi khi lấy CLO của PLO ${plo.id}`, error);
          ploCloMap[plo.id] = [];
        }
      }
  
      // Gộp dữ liệu CLO với flag PLO
      const mergedList = cloList.map((clo) => {
        const ploFlags = {};
        for (const plo of ploList) {
          ploFlags[`plo${plo.id}`] = ploCloMap[plo.id]?.includes(clo.id) || false;
        }
  
        return {
          id: clo.id,
          ten: clo.name,
          ...ploFlags,
        };
      });
  
      // Chỉ sort theo tên CLO (bỏ học kỳ)
      const sortedMergedList = mergedList.sort((a, b) => a.ten.localeCompare(b.ten));
  
      // Cập nhật state
      setHocPhanDaChon(sortedMergedList);
      setLsPLO(ploList);
      setHocPhanTheoPLO(ploCloMap);
      setOriginalHocPhanTheoPLO(ploCloMap);
  
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
    }
  }, [nganhId, hocPhanId]);
  
  
  useEffect(() => {
    if (open && nganhId && hocPhanId) {
      fetchData();
    }
  }, [fetchData, open, nganhId, hocPhanId]);

  const handleTogglePLOCheckbox = (cloId, ploId) => {
    setHocPhanTheoPLO((prev) => {
      const current = prev[ploId] || [];
      const updated = current.includes(cloId)
        ? current.filter((id) => id !== cloId)
        : [...current, cloId];
      return { ...prev, [ploId]: updated };
    });
  };
  const isDifferent = (a = {}, b = {}) => {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (let key of allKeys) {
      const listA = a[key] || [];
      const listB = b[key] || [];
      if (listA.length !== listB.length || !listA.every(id => listB.includes(id))) {
        return true;
      }
    }
    return false;
  };
  
  const hasChanges = isDifferent(hocPhanTheoPLO, originalHocPhanTheoPLO);
  
  
  const staticColumns = [
    { width: 50, label: "STT", dataKey: "index", align: "center", isSticky: true },
    { width: 200, label: "Tên CLO", dataKey: "ten", align: "center", isSticky: true },
  ];
  
  const dynamicColumns = lsPLO
    .filter((plo) => selectedPLOs.length === 0 || selectedPLOs.includes(plo.id))
    .map((plo) => ({
      width: 80,
      maxWidth: 120,
      label: plo.name,
      dataKey: `plo${plo.id}`,
      align: "center",
      isSticky: false,
    }));
  
  const columns = [...staticColumns, ...dynamicColumns];
  
  const handleClose = () => {
    setPage(1); // Reset trang
    setHocPhanTheoPLO({}); // Xóa trạng thái checkbox
    setOriginalHocPhanTheoPLO({}); // Xóa bản gốc
    setSelectedPLOs([]); // Bỏ chọn lọc PLO
    setSnackbarMessage("");
    setOpenSnackbar(false);
    setSnackbarSeverity("success");
    setLsPLO([]);
    setHocPhanDaChon([]);
    onClose(); // Gọi hàm đóng Dialog bên ngoài
  };
  
  

  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleSavePLOs = async () => {
    try {
      const updatePromises = Object.entries(hocPhanTheoPLO).map(async ([ploId, cloIds]) => {
        const response = await updateCLOsOfPLO(ploId, cloIds);
        if (response.status !== 200) {
          throw new Error(`Lưu thất bại cho PLO ID: ${ploId}`);
        }
      });
  
      await Promise.all(updatePromises);
  
      setOriginalHocPhanTheoPLO(hocPhanTheoPLO); // Cập nhật bản gốc sau khi lưu thành công
      setSnackbarMessage("Lưu CLO-PLO thành công!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Lỗi khi lưu CLO-PLO:", error);
      setSnackbarMessage(error.message || "Đã xảy ra lỗi khi lưu dữ liệu.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  
  
  
  return (
    <Dialog
      maxWidth="xl"
      fullWidth
      open={open}
      onClose={handleClose}
      sx={{ "& .MuiDialog-paper": { width: "90%", maxHeight: "100%" } }}
     
    >
      <DialogTitle fontSize={"18px"} fontWeight={"bold"}>
        Nối PLO_CLO thuộc học phần  
        <Typography component="span" color="info.main" fontWeight="bold">
          {hocPhanData ? ` ${hocPhanData.data.name}` : " Đang tải..."}
        </Typography>

        <Box sx={{ display: "flex", gap: 10, alignItems: "center", mt: 0.5 }}>
          <DialogContentText component="span">
            Mã học phần:
            <Typography component="span" color="info.main" fontWeight="500"> {hocPhanData ? hocPhanData.data.code : "Đang tải..."} </Typography>
          </DialogContentText>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '400px' }}>


        {hocPhanId ? (
          <div >
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={styles.mainAction}>
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
    {/* Box bên trái chứa Autocomplete và Checkbox */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Autocomplete
        multiple
        size="small"
        options={lsPLO}
        getOptionLabel={(option) => option.name}
        value={lsPLO.filter((plo) => selectedPLOs.includes(plo.id))}
        onChange={(event, newValue) => {
          setSelectedPLOs(newValue.map((plo) => plo.id));
        }}
        renderInput={(params) => (
          <TextField {...params} label="Chọn PLO để hiển thị" placeholder="Lọc cột PLO" />
        )}
        sx={{
          width: 300,
          "& .MuiInputBase-root": {
            height: "50%",
          },
        }}
      />

     
    </Box>
  </Box>

  {/* Box bên phải chứa nút Lưu */}
  <Box sx={{ height: 40 }}>
  <Button
      sx={{ height: "100%", minWidth: 100 }}
      variant="contained"
      startIcon={<SaveIcon />}
      disabled={!hasChanges}
      onClick={handleSavePLOs} // ✅ Gắn hàm mới
    >
      Lưu
    </Button>

  </Box>
</div>


            </Box>



          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1,  position: 'relative' }}>

<Box sx={{ display: 'flex' }}>
<TableContainer
  component={Paper}
  sx={{
    maxHeight: 400,
    overflow: 'auto',
    position: 'relative',
  }}
>
  <Table
    stickyHeader
    sx={{
      tableLayout: 'fixed',
      minWidth: columns.reduce((sum, col) => sum + col.width, 0),
    }}
  >
    <TableHead>
      <StyledTableRow>
        {columns.map((column, colIndex) => (
          <StyledTableCell
            key={column.dataKey}
            align={column.align}
            sx={{
              width: column.width,
              minWidth: column.width,
              maxWidth: column.width,
              position: 'sticky',
              top: 0,
              left: column.isSticky
                ? columns
                    .slice(0, colIndex)
                    .reduce((acc, c) => acc + (c.isSticky ? c.width : 0), 0)
                : undefined,
              zIndex: column.isSticky ? 3 : 2,
              backgroundColor: column.isSticky ? '#f5f5f5' : '#0071A6',
              color: column.isSticky ? '#000' : '#fff',
              borderRight: '1px solid #ccc',
            }}
          >
            {column.label}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>

    <TableBody>
      {paginatedData.map((row, rowIndex) => {
        const rowBgColor = rowIndex % 2 === 0 ? '#fff' : '#f5f5f5';

        return (
          <StyledTableRow key={row.id} sx={{ backgroundColor: rowBgColor }}>
            {columns.map((column, colIndex) => {
              let cellValue;

              if (column.dataKey.startsWith('plo')) {
                const ploId = parseInt(column.dataKey.replace('plo', ''));
                cellValue = (
                  <Checkbox
                    checked={hocPhanTheoPLO?.[ploId]?.includes(row.id) || false}
                    onChange={() => handleTogglePLOCheckbox(row.id, ploId)}
                  />
                );
              } else if (column.dataKey === 'index') {
                cellValue = startRow + rowIndex;
              } else {
                cellValue = row[column.dataKey] ?? '';
              }

              return (
                <StyledTableCell
                  key={column.dataKey}
                  align={column.align}
                  sx={{
                    width: column.width,
                    minWidth: column.width,
                    maxWidth: column.width,
                    position: column.isSticky ? 'sticky' : 'static',
                    left: column.isSticky
                      ? columns
                          .slice(0, colIndex)
                          .reduce((acc, c) => acc + (c.isSticky ? c.width : 0), 0)
                      : undefined,
                    backgroundColor: 'inherit', // ✅ Kế thừa để hover hoạt động toàn hàng
                    zIndex: column.isSticky ? 2 : 1,
                    borderRight: column.isSticky ? '1px solid #ccc' : undefined,
                  }}
                >
                  {cellValue}
                </StyledTableCell>

              );
            })}
          </StyledTableRow>
        );
      })}
        {paginatedData.length === 0 && (
    <TableRow>
      <TableCell colSpan={columns.length} align="center">
        Chưa có CLO trong học phần
      </TableCell>
    </TableRow>
  )}
    </TableBody>
  </Table>
</TableContainer>

</Box>



          </Box>
          <div style={{ ...styles.divPagination, height: 50 }}>
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
              <span style={{ fontSize: 14, color: "#333" }}>
                Dòng {startRow} đến {endRow} / {totalItems}
              </span>
            </Box>
          </div>
        </div>

        <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert
    onClose={handleSnackbarClose}
    severity={snackbarSeverity}
    variant="filled"
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>

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

export default DialogPLOHocPhan;
