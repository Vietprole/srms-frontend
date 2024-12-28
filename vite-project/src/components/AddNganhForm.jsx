import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { getAllHocPhanNotNganhId } from "@/api/api-hocphan";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getHocPhans } from "@/api/api-hocphan";
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
import { addHocPhansToNganh } from "@/api/api-nganh";
import { getNganhById,updateNganh} from "@/api/api-nganh";
import { removeHocPhanFromNganh } from "@/api/api-nganh";

function EditNganhModal({ setOpenModal,nganhId}) {
  const [hovered, setHovered] = useState(false);
  const [hoveredSave, setHoveredSave] = useState(false);
  const [nganhData, setNganhData] = useState([]);
  const [nganh, setNganh] = useState({});
  const [hocPhanDaChon, setHocPhanDaChon] = useState([]);
  
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
        const [nganhs, nganhInfo,hocPhan] = await Promise.all([
          getAllHocPhanNotNganhId(nganhId),
          getNganhById(nganhId),
          getHocPhans(null,nganhId, null),
        ]);
        setNganh(nganhInfo || {});
        setNganhData(Array.isArray(nganhs) ? nganhs : []);
        setHocPhanDaChon(Array.isArray(hocPhan) ? hocPhan : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [nganhId]);

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
      accessorKey: "id",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Id
        </Button>
      ),
      cell: ({ row }) => <div className="px-1 py-1">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "maHocPhan",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Mã Học Phần
        </Button>
      ),
      cell: ({ row }) => (
        <div className="px-1 py-1">{row.getValue("maHocPhan")}</div>
      ),
    },
    {
      accessorKey: "ten",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Tên Học Phần
        </Button>
      ),
      cell: ({ row }) => <div className="px-1 py-1">{row.getValue("ten")}</div>,
    },
    {
      accessorKey: "soTinChi",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Số Tín Chỉ
        </Button>
      ),
      cell: ({ row }) => <div className="px-1 py-1">{row.getValue("soTinChi")}</div>,
    },
  ];

  const table = useReactTable({
    data: nganhData,
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
    data: hocPhanDaChon,
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

  const handleAddSelectedHocPhan = async () => {
    try {
      const selectedRows = Object.keys(rowSelection)
        .filter((id) => rowSelection[id])
        .map((id) => table.getRow(id).original);
      const hocPhanIds = selectedRows.map((row) => row.id);
  
      if (hocPhanIds.length > 0) {
        await addHocPhansToNganh(nganhId, hocPhanIds);
        const [nganhs, hocPhan] = await Promise.all([
          getAllHocPhanNotNganhId(nganhId),
          getHocPhans(null, nganhId, null),
        ]);
        setNganhData(Array.isArray(nganhs) ? nganhs : []);
        setHocPhanDaChon(Array.isArray(hocPhan) ? hocPhan : []);
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
        await removeHocPhanFromNganh(nganhId, row.id);
      }
      const [nganhs, hocPhan] = await Promise.all([
        getAllHocPhanNotNganhId(nganhId),
        getHocPhans(null, nganhId, null),
      ]);
  
      setNganhData(Array.isArray(nganhs) ? nganhs : []);
      setHocPhanDaChon(Array.isArray(hocPhan) ? hocPhan : []);
      setRowSelectionDaChon({});
    } catch (error) {
      console.error("Error removing selected hoc phan:", error);
    }
  };
  
  const handleSave = async () => {
    // try {
    //   const updatedData = { ...nganh };
    //   const updatedNganh = await updateNganh(nganhId, updatedData);
    //   if (updatedNganh) {
    //     console.log('Update successful:', updatedNganh);
    //     setOpenModal(false); // Close the modal after saving
    //   }
    // } catch (error) {
    //   console.error('Error updating nganh:', error);
    // }
    setOpenModal(false);
  };
  
  return (
    <div style={styles.modalBackground} onClick={handleBackgroundClick}>
      <div style={styles.modalContainer}>
        {/* Header */}
        <div style={styles.divtitle}>
          <span style={styles.title}>Sửa ngành:</span>
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
              <Label>Tên ngành:</Label>
            </div>
            <div style={styles.textinput}>
            <Input
              placeholder="Nhập tên ngành"
              value={nganh?.ten || ""}
              onChange={(e) => setNganh({ ...nganh, ten: e.target.value })}
              readOnly
            />
            </div>
          </div>
          <div style={styles.divinput}>
            <div style={styles.divlabel}>
              <Label>Khoa:</Label>
            </div>
            <div style={styles.comboboxinput}>
                  <Input
                    placeholder="Nhập tên khoa"
                    value={nganh?.tenKhoa || ""}
                    onChange={(e) => setNganh({ ...nganh, tenKhoa: e.target.value })}
                    readOnly
                  />
            </div>
          </div>

          {/* Tables */}
          <div style={styles.divtable}>
            <div style={styles.divDSHocPhan}>
              <div style={styles.divTbHPDaChon}>
                            <Label>Danh sách học phần đã chọn:</Label>  
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
                                <Button variant="outline" className="ml-2" onClick={handleRemoveSelectedHocPhan}>
                                    Xoá học phần đã chọn 
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
                                        Không tìm thấy học phần!
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
                        <Label>Danh sách học phần:</Label>  
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
                            <Button variant="outline" className="ml-2"  onClick={handleAddSelectedHocPhan}>
                                Thêm học phần đã chọn 
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
                                        Không tìm thấy học phần!
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
    width: '80%', // Consider making this responsive
    maxHeight: '90vh', // Limit the height to prevent overflow
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
export default EditNganhModal;
