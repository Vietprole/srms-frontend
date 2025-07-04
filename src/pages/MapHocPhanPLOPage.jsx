/* eslint-disable react/display-name */
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked";
import { getAllFaculties } from "@/api/api-faculties";
import { getAllNganhs } from "@/api/api-nganh";
import Layout from "./Layout";
import { TableVirtuoso } from "react-virtuoso";
import DialogPLOHocPhan from "../components/DialogMappingPLO_Cource";
import { getRole, getNguoiQuanLyCTDTId } from "@/utils/storage";
import { getNganhsByNguoiQuanLyId } from "@/api/api-nganh";

function NganhPage() {
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
      width: "10%",
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
      height: "100vb",
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
  const [khoas, setKhoas] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const [filteredData, setFilteredData] = useState(data); // Lưu dữ liệu đã lọc
  const [selectedKhoaFilter, setSelectedKhoaFilter] = useState(null);
  const [nganhId, setNganhId] = useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const role = getRole();
  const nguoiQuanLyCTDTId = getNguoiQuanLyCTDTId();

  const handleKhoaChange = (event, newValue) => {
    setSelectedKhoaFilter(newValue);
    if (!newValue) {
      setFilteredData(data); // Nếu không chọn khoa nào, hiển thị toàn bộ dữ liệu
    } else {
      const filtered = data.filter((row) => row.tenKhoa === newValue.ten);
      setFilteredData(filtered);
    }
  };

  const handleOpenDialog = (id) => {
    setNganhId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (role === "NguoiPhuTrachCTĐT" && nguoiQuanLyCTDTId !== 0) {
        const nganhData = await getNganhsByNguoiQuanLyId(nguoiQuanLyCTDTId);
        setData(nganhData);
      } else {
        const nganhData = await getAllNganhs();
        setData(nganhData);
      }
      const khoa = await getAllFaculties();
      setKhoas(khoa);
    };
    
    fetchData();
  }, [role, nguoiQuanLyCTDTId]);

  useEffect(() => {
    // Only set filteredData once data has been loaded
    setFilteredData(data);
  }, [data]);

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

  const columns = [
    { width: 50, label: "STT", dataKey: "index", align: "center" },
    { width: 150, label: "Mã CTĐT", dataKey: "maNganh", align: "center" },
    { label: "Tên CTĐT", dataKey: "ten", align: "center" },
    { width: 300, label: "Tên Khoa", dataKey: "tenKhoa", align: "center" },
    { width: 150, label: "", dataKey: "actions", align: "center" },
  ];

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer
        component={Paper}
        {...props}
        ref={ref}
        sx={{ height: "calc(100vh - 200px)" }}
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
    TableHead: React.forwardRef((props, ref) => (
      <TableHead {...props} ref={ref} />
    )),
    TableRow: StyledTableRow, // Sử dụng StyledTableRow bạn đã định nghĩa
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
    TableCell: StyledTableCell, // Sử dụng StyledTableCell bạn đã định nghĩa
  };

  function fixedHeaderContent() {
    return (
      <StyledTableRow>
        {columns.map((column) => (
          <StyledTableCell
            key={column.dataKey}
            variant="head"
            align="center" // Cố định căn giữa
            style={{ width: column.width, textAlign: "center" }} // Đảm bảo text ở giữa
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
        <StyledTableCell align="center">{index + 1}</StyledTableCell>{" "}
        {/* STT */}
        <StyledTableCell align="center">{row.maNganh}</StyledTableCell>
        <StyledTableCell align="left">{row.ten}</StyledTableCell>
        <StyledTableCell align="center">{row.tenKhoa}</StyledTableCell>
        <StyledTableCell align="center" width={150}>
          <Tooltip title="Nối PLO-Học phần">
            <IconButton onClick={() => handleOpenDialog(row.id)}>
              <DatasetLinkedIcon />
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
          <span>Danh sách ctđt học</span>
          <div style={styles.btnMore}>
            <IconButton aria-label="more actions">
              <MoreVertIcon />
            </IconButton>
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
                placeholder="Tìm kiếm theo tên ctđt..."
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
              value={selectedKhoaFilter}
              onChange={handleKhoaChange}
              renderInput={(params) => (
                <TextField {...params} label="Chọn khoa" size="small" />
              )}
            />
          </div>
          <div style={styles.btnCreate}></div>
        </div>
        <div style={styles.table}>
          <Paper style={{ height: "100vh", width: "100%" }}>
            <TableVirtuoso
              style={{ width: "100%", height: "100%" }} // Đảm bảo full height
              data={filteredData}
              components={VirtuosoTableComponents}
              fixedHeaderContent={fixedHeaderContent}
              itemContent={rowContent}
            />
            <DialogPLOHocPhan
              nganhId={nganhId}
              open={openDialog}
              onClose={handleCloseDialog}
            />
          </Paper>
        </div>
      </div>
    </Layout>
  );
}

export default NganhPage;
