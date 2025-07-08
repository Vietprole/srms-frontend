import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import Typography  from "@mui/material/Typography";
import DialogContentText from '@mui/material/DialogContentText';
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
import MuiAlert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import { useCallback } from "react";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import {getProgrammeById,getCoursesInProgramme} from "@/api/api-programmes";
import {getPLOs} from "@/api/api-plos";
import {getCoursePLOs,upsertCoursePLO} from "@/api/api-course-plo";
// eslint-disable-next-line react/prop-types
function DialogPLOHocPhan({ nganhId, open, onClose }) {
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
  
  
  
  const [nganh, setNganh] = useState(null);
  const [hocPhanDaChon, setHocPhanDaChon] = useState([]);
  const [lsPLO, setLsPLO] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tongSoTinChi, setTongSoTinChi] = useState(0);
  const [hocPhanTheoPLO, setHocPhanTheoPLO] = useState({}); // Biến tạm lưu trạng thái checkbox
  const [originalHocPhanTheoPLO, setOriginalHocPhanTheoPLO] = useState({});
  const [selectedPLOs, setSelectedPLOs] = useState([]); // Danh sách ID PLO được chọn
  const [onlyCore, setOnlyCore] = useState(true);
  const filteredHocPhan = onlyCore
  ? hocPhanDaChon.filter((hp) => hp.laCotLoi)
  : hocPhanDaChon;

  const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const pageSizeOptions = [20, 50, 100];
    const filteredData = filteredHocPhan; // hoặc thêm điều kiện lọc nếu cần
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startRow = (page - 1) * pageSize + 1;
    const endRow = Math.min(page * pageSize, totalItems);
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

    const paginatedData = filteredHocPhan.slice((page - 1) * pageSize, page * pageSize);





  
    const fetchData = useCallback(async () => {
      try {
        // Lấy chương trình đào tạo
        const programme = await getProgrammeById(nganhId);
    
        // Lấy danh sách học phần trong CTĐT
        const hocphans = await getCoursesInProgramme(nganhId); // [{ id, maHocPhan, ten, laCotLoi, soTinChi }]
        const totalCredits = hocphans.reduce((total, hp) => total + hp.credits, 0);
    
        // Lấy danh sách PLO
        const plos = await getPLOs({ programmeId: nganhId });
    
        // Lấy danh sách liên kết Course - PLO
        const coursePLOs = await getCoursePLOs({ programmeId: nganhId }); // [{ courseId, ploId, weight }]
    
        // Tạo map từ PLOId => danh sách CourseId
        const ploHocPhanMap = {};
        for (const plo of plos) {
          ploHocPhanMap[plo.id] = coursePLOs
            .filter(item => item.ploId === plo.id)
            .map(item => item.courseId);
        }
    
        // Merge học phần với flags theo từng PLO
        const mergedList = hocphans.map((hp) => {
          const ploFlags = {};
          for (const plo of plos) {
            ploFlags[`plo${plo.id}`] = ploHocPhanMap[plo.id]?.includes(hp.id) || false;
          }
    
          return {
            id: hp.id,
            maHocPhan: hp.code,
            ten: hp.name,
            laCotLoi: hp.isCore,
            ...ploFlags,
          };
        });
    
        // Set state
        setNganh(programme);
        setLsPLO(plos);
        setHocPhanDaChon(mergedList);
        setTongSoTinChi(totalCredits);
    
        // Lưu bản gốc để theo dõi thay đổi checkbox
        const originalMap = {};
        for (const plo of plos) {
          originalMap[plo.id] = ploHocPhanMap[plo.id];
        }
    
        setHocPhanTheoPLO(originalMap);
        setOriginalHocPhanTheoPLO(originalMap);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    }, [nganhId]);
    
  useEffect(() => {
    if (open && nganhId) {
      fetchData();
    }
  }, [fetchData, nganhId, open]);

  
  
  
  const handleClose = () => {
    onClose();
  };
  

  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  

  
  

  const handleTogglePLOCheckbox = (hocPhanId, ploId) => {
    setHocPhanTheoPLO((prev) => {
      const currentList = prev[ploId] || [];
      const exists = currentList.includes(hocPhanId);
      const updated = exists
        ? currentList.filter((id) => id !== hocPhanId)
        : [...currentList, hocPhanId];
      return {
        ...prev,
        [ploId]: updated,
      };
    });
  };
  
  
  const handleSavePLOs = async () => {
    let hasChanges = false;
  
    for (const ploId in hocPhanTheoPLO) {
      const current = hocPhanTheoPLO[ploId] || [];
      const original = originalHocPhanTheoPLO?.[ploId] || [];
  
      const currentSorted = [...current].sort();
      const originalSorted = [...original].sort();
  
      if (JSON.stringify(currentSorted) !== JSON.stringify(originalSorted)) {
        hasChanges = true;
        break;
      }
    }
  
    if (!hasChanges) {
      setSnackbarSeverity("info");
      setSnackbarMessage("Không có thay đổi nào để lưu.");
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const allPLOIds = Object.keys(hocPhanTheoPLO).map(Number);
  
      for (const ploId of allPLOIds) {
        const currentList = hocPhanTheoPLO[ploId] || [];
        const originalList = originalHocPhanTheoPLO[ploId] || [];
  
        const allRelatedCourseIds = Array.from(
          new Set([...currentList, ...originalList])
        );
  
        for (const courseId of allRelatedCourseIds) {
          const isChecked = currentList.includes(courseId);
  
          const payload = {
            courseId,
            ploId: Number(ploId),
            weight: isChecked ? 1 : null,
          };
  
          const rp = await upsertCoursePLO(payload); // Gọi API
  
          // ✅ Check status từ response
          if (rp.status !== 200) {
            throw new Error(`Lỗi khi cập nhật học phần ${courseId} cho PLO ${ploId}`);
          }
        }
      }
  
      setSnackbarSeverity("success");
      setSnackbarMessage("Cập nhật PLO - học phần thành công!");
      setOriginalHocPhanTheoPLO({ ...hocPhanTheoPLO }); // cập nhật bản gốc
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      setSnackbarSeverity("error");
      setSnackbarMessage("Cập nhật thất bại!");
    } finally {
      setOpenSnackbar(true);
    }
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
  const staticColumns = [
    { width: 50, label: "STT", dataKey: "index", align: "center", isSticky: true },
    { width: 180, label: "Mã Học Phần", dataKey: "maHocPhan", align: "center", isSticky: true },
    { width: 300, label: "Tên Học Phần", dataKey: "ten", align: "left", isSticky: true },
    { width: 120, label: "Là Cốt Lõi", dataKey: "laCotLoi", align: "center", isSticky: true },
  ];
  
  const dynamicColumns = lsPLO
  .filter((plo) => selectedPLOs.length === 0 || selectedPLOs.includes(plo.id)) // nếu không chọn gì thì hiện tất cả
  .map((plo) => ({
    width: 80,
    label: plo.name,
    dataKey: `plo${plo.id}`,
    align: "center",
    isSticky: false,
  }));

  
  const columns = [...staticColumns, ...dynamicColumns];
  

  
  
  
  const hasChanges = isDifferent(hocPhanTheoPLO, originalHocPhanTheoPLO);
  
  return (
    <Dialog
      maxWidth="xl"
      fullWidth
      open={open}
      onClose={handleClose}
      sx={{ "& .MuiDialog-paper": { width: "90%", maxHeight: "100%" } }}
      TransitionProps={{
        onExited: () => setNganh(null), // Đặt lại giá trị khi Dialog đóng hoàn toàn
      }}
    >
      <DialogTitle fontSize={"18px"} fontWeight={"bold"}>
        Nối PLO - Học phần thuộc ctđt:
        <Typography component="span" color="info.main" fontWeight="bold">
          {nganh ? ` ${nganh.name}` : " Đang tải..."}
        </Typography>
  
        <Box sx={{ display: "flex", gap: 10, alignItems: "center", mt: 0.5 }}>
          <DialogContentText component="span">
            Mã ngành:
            <Typography component="span" color="info.main" fontWeight="500"> {nganh ? nganh.code : "Đang tải..."} </Typography>
          </DialogContentText>
          <DialogContentText component="span">
            Tổng số tín chỉ: 
            <Typography component="span" color="info.main" fontWeight="500"> {tongSoTinChi ? tongSoTinChi : "0"} </Typography>
          </DialogContentText>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '400px' }}>


        {nganh ? (
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

      <FormControlLabel
        control={
          <Checkbox
            checked={onlyCore}
            onChange={(e) => {
              setPage(1);
              setOnlyCore(e.target.checked);
            }}
            color="primary"
            size="small"
          />
        }
        label="Chỉ hiện học phần cốt lõi"
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
      onClick={handleSavePLOs}
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

          // ✅ Luôn sticky để top hoạt động
          position: 'sticky',
          top: 0, // giữ cố định header theo chiều dọc
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
const value =
column.dataKey.startsWith("plo") ? (
  <Checkbox
    checked={
      hocPhanTheoPLO?.[column.dataKey.replace("plo", "")]?.includes(row.id) || false
    }
    disabled={!row.laCotLoi} // ✅ Chỉ cho tick nếu là học phần cốt lõi
    onChange={(e) => {
      e.stopPropagation();
      handleTogglePLOCheckbox(row.id, parseInt(column.dataKey.replace("plo", "")));
    }}
  />
            ) : column.dataKey === "laCotLoi" ? (
              <Checkbox
                checked={row.laCotLoi}
                readOnly
                disableRipple
                sx={{
                  color: row.laCotLoi ? "green" : "grey.400",
                  '&.Mui-checked': { color: "green" },
                }}
              />
            ) : column.dataKey === "index" ? (
              startRow + rowIndex
            ) : (
              row[column.dataKey]
            );

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
                  backgroundColor: column.isSticky ? 'inherit' : 'inherit',

                zIndex: column.isSticky ? 1 : 1,
                borderRight: column.isSticky ? '1px solid #ccc' : undefined,
              }}
            >
              {value}
            </StyledTableCell>
          );
        })}
      </StyledTableRow>
    );
  })}

  {/* ✅ Khi không có dữ liệu */}
  {paginatedData.length === 0 && (
    <TableRow>
<TableCell
  colSpan={columns.length}
  align="center"
  sx={{ fontWeight: 'bold', color: 'gray' }}
>
  Chưa có học phần trong chương trình đào tạo
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
  <MuiAlert
    onClose={handleSnackbarClose}
    severity={snackbarSeverity}
    variant="filled"
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </MuiAlert>
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
