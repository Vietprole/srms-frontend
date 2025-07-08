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
} from "@tanstack/react-table";

export default function ResultTable({ table, columns, extraHeaders }) {
  // Check if extraHeaders exists and has properties
  const hasExtraHeaders = extraHeaders && Object.keys(extraHeaders).length > 0;

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {/* Conditionally render PLO header row */}
            {hasExtraHeaders && (
              <TableRow className="border-b">
                {/* Empty cells for the first 3 columns (TT, MSSV, Name) */}
                <TableHead colSpan={3}></TableHead>
                
                {/* PLO group headers */}
                {Object.values(extraHeaders).map((header, index) => (
                  <TableHead 
                    key={`plo-${index}`} 
                    colSpan={header.colSpan}
                    className="text-center border"
                  >
                    {header.header}
                  </TableHead>
                ))}
              </TableRow>
            )}
            
            {/* Regular column headers */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                    <TableCell key={cell.id} className="border">
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không tìm thấy kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
