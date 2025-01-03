import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { getLopHocPhanById } from "@/api/api-lophocphan";
import { getSinhViensByLopHocPhanId } from "@/api/api-lophocphan";
import { getSinhViensNotInLopHocPhanId } from "@/api/api-lophocphan";
import { addSinhViensToLopHocPhan } from "@/api/api-lophocphan";
import { removeSinhVienFromLopHocPhan } from "@/api/api-lophocphan";


function EditSinhVienLopHocPhan({ setOpenModal,lophocphanId}) {
  const [hovered, setHovered] = useState(false);
  const [hoveredSave, setHoveredSave] = useState(false);
  const [lopHocPhan, setLopHocPhan] = useState({});
  const [dsSinhVien, setDSSinhVien] = useState([]);
  const [dsSinhVienDaChon, setDSSinhVienDaChon] = useState([]);
  
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [sortingDaChon, setSortingDaChon] = useState([]);
  const [columnFiltersDaChon, setColumnFiltersDaChon] = useState([]);
  const [columnVisibilityDaChon, setColumnVisibilityDaChon] = useState({});
  const [rowSelectionDaChon, setRowSelectionDaChon] = useState({});

  const columnToBeFiltered = "ten";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lopHocPhan, sinhVien,sinhVienDaChon] = await Promise.all([
          getLopHocPhanById(lophocphanId),
          getSinhViensNotInLopHocPhanId(lophocphanId),
          getSinhViensByLopHocPhanId(lophocphanId),

        ]);
        setLopHocPhan(lopHocPhan || {});
        setDSSinhVien(Array.isArray(sinhVien) ? sinhVien : []);
        setDSSinhVienDaChon(Array.isArray(sinhVienDaChon) ? sinhVienDaChon : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [lophocphanId]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpenModal(false);
    }
  };

  const createHocPhanColumns = () => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "maSinhVien",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Mã sinh viên
        </Button>
      ),
      cell: ({ row }) => <div className="1px 1px">{row.getValue("maSinhVien")}</div>,
    },
    {
      accessorKey: "ten",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Tên Sinh Viên
        </Button>
      ),
      cell: ({ row }) => (
        <div className="px-1 py-1">{row.getValue("ten")}</div>
      ),
    },
    {
      accessorKey: "tenKhoa",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Tên Khoa
        </Button>
      ),
      cell: ({ row }) => <div className="px-1 py-1">{row.getValue("tenKhoa")}</div>,
    },
    {
      accessorKey: "namNhapHoc",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Năm Nhập Học
        </Button>
      ),
      cell: ({ row }) => <div className="px-1 py-1">{row.getValue("namNhapHoc")}</div>,
    },
  ];

  const table = useReactTable({
    data: dsSinhVien,
    columns: createHocPhanColumns(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tableDaChon = useReactTable({
    data: dsSinhVienDaChon,
    columns: createHocPhanColumns(),
    state: {
      sorting: sortingDaChon,
      columnFilters: columnFiltersDaChon,
      columnVisibility: columnVisibilityDaChon,
      rowSelection: rowSelectionDaChon,
    },
    onSortingChange: setSortingDaChon,
    onColumnFiltersChange: setColumnFiltersDaChon,
    onColumnVisibilityChange: setColumnVisibilityDaChon,
    onRowSelectionChange: setRowSelectionDaChon,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleAddSelectedSinhVien = async () => {
    try {
      const selectedRows = Object.keys(rowSelection)
        .filter((id) => rowSelection[id])
        .map((id) => table.getRow(id).original);
      const hocPhanIds = selectedRows.map((row) => row.id);
  
      if (hocPhanIds.length > 0) {
        await addSinhViensToLopHocPhan(lophocphanId, hocPhanIds);
        const [dsSinhViens, dsSinhVienDaChon] = await Promise.all([
          getSinhViensNotInLopHocPhanId(lophocphanId),
          getSinhViensByLopHocPhanId(lophocphanId),
        ]);
        setDSSinhVien(Array.isArray(dsSinhViens) ? dsSinhViens : []);
        setDSSinhVienDaChon(Array.isArray(dsSinhVienDaChon) ? dsSinhVienDaChon : []);
      }
      setRowSelection({});
    } catch (error) {
      console.error("Error adding selected hoc phan:", error);
    }
  };
  

  const handleRemoveSelectedHocPhan = async () => {
    try {
      const selectedRows = Object.keys(rowSelectionDaChon)
        .filter((id) => rowSelectionDaChon[id])
        .map((id) => tableDaChon.getRow(id).original);
      for (const row of selectedRows) {
        await removeSinhVienFromLopHocPhan(lophocphanId, row.id);
      }
      const [dsSinhViens, dsSinhVienDaChon] = await Promise.all([
        getSinhViensNotInLopHocPhanId(lophocphanId),
        getSinhViensByLopHocPhanId(lophocphanId),
      ]);
  
      setDSSinhVien(Array.isArray(dsSinhViens) ? dsSinhViens : []);
      setDSSinhVienDaChon(Array.isArray(dsSinhVienDaChon) ? dsSinhVienDaChon : []);
      setRowSelectionDaChon({});
    } catch (error) {
      console.error("Error removing selected hoc phan:", error);
    }
  };
  
  const handleSave = async () => {
    setOpenModal(false);
  };
  
  return (
    <div style={styles.modalBackground} onClick={handleBackgroundClick}>
      <div style={styles.modalContainer}>
        {/* Header */}
        <div style={styles.divtitle}>
          <span style={styles.title}>Lớp học phần:</span>
          <button
            style={{
              ...styles.btnClose,
              backgroundColor: hovered ? "red" : "black",
            }}
            onClick={() => setOpenModal(false)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            X
          </button>
        </div>

        {/* Form content */}
        <div style={styles.content}>
          <div style={styles.divinput}>
            <div style={styles.divlabel}>
              <Label>Mã lớp học phần:</Label>
            </div>
            <div style={styles.textinput}>
            <Input
              placeholder="Nhập mã lớp học phần"
              value={lopHocPhan?.maLopHocPhan || ""}
              onChange={(e) => setLopHocPhan({ ...lopHocPhan, maLopHocPhan: e.target.value })}
              readOnly
            />
            </div>
          </div>
          <div style={styles.divinput}>
            <div style={styles.divlabel}>
              <Label>Tên lớp học phần:</Label>
            </div>
            <div style={styles.comboboxinput}>
                  <Input
                    placeholder="Nhập tên lớp học phần"
                    value={lopHocPhan?.ten || ""}
                    onChange={(e) => setLopHocPhan({ ...lopHocPhan, ten: e.target.value })}
                    readOnly
                  />
            </div>
          </div>
          <div style={styles.divinput}>
            <div style={styles.divlabel}>
              <Label>Tên giảng viên:</Label>
            </div>
            <div style={styles.textinput}>
            <Input
              placeholder="Nhập mã lớp học phần"
              value={lopHocPhan?.tenGiangVien || ""}
              onChange={(e) => setLopHocPhan({ ...lopHocPhan, tenGiangVien: e.target.value })}
              readOnly
            />
            </div>
          </div>

          {/* Tables */}
          <div style={styles.divtable}>
            <div style={styles.divDSHocPhan}>
              <div style={styles.divTbHPDaChon}>
                            <Label>Danh sách sinh viên đã chọn:</Label>  
                            <div className="flex items-center py-4">
                                <Input
                                  placeholder={`Tìm kiếm theo tên...`}
                                  value={
                                    tableDaChon.getColumn(`${columnToBeFiltered}`)?.getFilterValue() ?? ""
                                  }
                                  onChange={(event) =>
                                    tableDaChon
                                      .getColumn(`${columnToBeFiltered}`)
                                      ?.setFilterValue(event.target.value)
                                  }
                                  className="max-w-sm"
                                />
                                <Button variant="outline" className="ml-auto" onClick={handleRemoveSelectedHocPhan}>
                                    Xoá sinh viên đã chọn 
                                </Button>
                            </div>
                <div style={styles.table}>
                <div className="w-full">
                            
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  {tableDaChon.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                      {headerGroup.headers.map((header) => {
                                        return (
                                          <TableHead className="px-2" key={header.id}>
                                            {header.isPlaceholder
                                              ? null
                                              : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                                )}
                                          </TableHead>
                                        );
                                      })}
                                    </TableRow>
                                  ))}
                                </TableHeader>
                                <TableBody>
                                  {tableDaChon.getRowModel().rows?.length ? (
                                    tableDaChon.getRowModel().rows.map((row) => (
                                      <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                      >
                                        {row.getVisibleCells().map((cell) => (
                                          <TableCell key={cell.id}
                                          style={{

                                            fontSize: "11px", // Smaller font size
                                            padding: "3px 1px", // Reduce padding
                                            textAlign: "center", // Center align text
        
                                          }}
                                          
                                          >
                                            {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext()
                                            )}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell
                                        colSpan={5}
                                        style={{

                                          fontSize: "15px", // Smaller font size
                                          padding: "3px 1px", // Reduce padding
                                          textAlign: "center", // Center align text
      
                                        }}
                                      >
                                        Không tìm thấy sinh viên!
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>

                </div>
              </div>
                <div style={styles.divTbDSHP}>
                        <Label>Danh sách sinh viên:</Label>  
                        <div className="flex items-center py-4">
                            <Input
                              placeholder={`Tìm kiếm theo tên...`}
                              value={
                                table.getColumn(`${columnToBeFiltered}`)?.getFilterValue() ?? ""
                              }
                              onChange={(event) =>
                                table
                                  .getColumn(`${columnToBeFiltered}`)
                                  ?.setFilterValue(event.target.value)
                              }
                              className="max-w-sm"
                            />
                            <Button variant="outline" className="ml-auto" onClick={handleAddSelectedSinhVien}>
                                Thêm sinh viên đã chọn 
                            </Button>
                        </div>
                  <div style={styles.table}>
                      {/*  */}
                      <div className="w-full">
                            
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                      {headerGroup.headers.map((header) => {
                                        return (
                                          <TableHead className="px-2" key={header.id}>
                                            {header.isPlaceholder
                                              ? null
                                              : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                                )}
                                          </TableHead>
                                        );
                                      })}
                                    </TableRow>
                                  ))}
                                </TableHeader>
                                <TableBody>
                                  {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                      <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                      >
                                        {row.getVisibleCells().map((cell) => (
                                          <TableCell key={cell.id}
                                          
                                          style={{
                                            fontSize: "11px", // Smaller font size
                                            padding: "3px 1px", // Reduce padding
                                            textAlign: "center", // Center align text
                                          }}
                                          
                                          >
                                            {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext()
                                            )}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell
                                        colSpan={5}
                                        style={{

                                          fontSize: "15px", // Smaller font size
                                          padding: "3px 1px", // Reduce padding
                                          textAlign: "center", // Center align text
      
                                        }}
                                      >
                                        Không tìm thấy sinh viên!
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>

                      {/*  */}
                  </div>
                </div>
            </div>
          </div>

          <button
            style={{
              ...styles.btnSave,
              backgroundColor: hoveredSave ? "#4E8FBE" : "#2196F3",
            }}
            onMouseEnter={() => setHoveredSave(true)}
            onMouseLeave={() => setHoveredSave(false)}
            onClick={() => handleSave()} // Gọi hàm setOpenModal(false) khi nhấn nút
            // onClick={setOpenModal(false)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
const styles = {
  modalBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent dark background for the overlay
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,  // Ensure the modal is above other content
  },
  modalContainer: {
    width: '85%', // Consider making this responsive
    maxHeight: '95vh', // Limit the height to prevent overflow
    overflowY: 'auto', // Allow scrolling within the modal if content is large
    borderRadius: '12px',
    backgroundColor: 'white', // Solid background for the modal contents
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',  // Subtle shadow for depth
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
  },
  divtitle: {
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'black',
    margin: 'auto',
    fontFamily: "Times New Roman, Times, serif",
    marginLeft: '20px',
  },
  btnClose: {
    width: '60px',
    height: '40px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  content: {
    width: '100%',
    display: 'flex',
    padding: '10px',
    flexDirection: 'column',
  },
  divinput: {
    width: '100%',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
  },
  textinput: {
    width: '300px',
    height: '30px',
    marginLeft: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comboboxinput: {
    width: '300px',
    height: '30px',
    marginLeft: '10px',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
  },
  divlabel: {
    width: '150px',
    height: '50px',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
  },
  divtable: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
  },
  divHocPhan: {
    width: '100%',
    height: '25px',
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
  },
  btnSave: {
    width: '100px',
    height: '50px',
    backgroundColor: '#4E8FBE',
    color: 'white',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.4s',
    marginLeft: 'auto',  // Align button to the right inside parent
  },
  divDSHocPhan: {
    width: '100%',
    height: '300px',
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'hidden',
  },
  divTbHPDaChon: {
    padding: '5px',
    width: '50%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  divTbDSHP: {
    padding: '5px',
    width: '50%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    height: '100%',
    padding: '5px',
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'auto',
  }
};
export default EditSinhVienLopHocPhan;
