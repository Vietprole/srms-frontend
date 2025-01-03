// import * as React from "react"
// import {
//   // ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { updateKetQua } from "@/api/api-ketqua"
// // import { cn } from "@/lib/utils"
// // import { StudentGrades, GradeComponent, Question, Grade } from "@/types/grades"

// // interface GradeTableProps {
// //   data: StudentGrades[]
// //   components: GradeComponent[]
// //   questions: Record<string, Question[]>
// // }

// export function GradeTable({
//   data,
//   components,
//   questions,
// }) {
//   const [tableData, setTableData] = React.useState(data)
//   const [isEditing, setIsEditing] = React.useState(false)
//   const [modifiedRecords, setModifiedRecords] = React.useState([])
//   const columns = React.useMemo(() => {
//     const cols = [
//       {
//         accessorKey: "id",
//         header: "Id",
//         size: 60,
//       },
//       // {
//       //   accessorKey: "mssv",
//       //   header: "MSSV",
//       //   size: 120,
//       // },
//       {
//         accessorKey: "ten",
//         header: "Họ và tên",
//         size: 200,
//       },
//     ]

//     // Add columns for each component and its questions
//     components.forEach((component) => {
//       const componentQuestions = questions[component.id.toString()] || []
//       cols.push({
//         id: component.loai,
//         header: `${component.loai} (${component.trongSo * 100}%)`,
//         columns: [
//           ...componentQuestions.map((question) => ({
//             accessorFn: (row) =>
//               row.grades[component.loai]?.[question.id.toString()] ?? 0,
//             id: `${component.loai}_${question.id}`,
//             header: () => (
//               <div>
//                 <div>{question.ten}</div>
//                 <div>{question.trongSo * 100}%</div>
//               </div>
//             ),
//             size: 80,
//             cell: ({ row, column }) => (
//               <EditableCell
//                 value={row.getValue(column.id)}
//                 onChange={(value) => {
//                   const newData = [...tableData]
//                   const rowIndex = row.index
//                   const [componentId, questionId] = column.id.split("_")
                  
//                   if (!newData[rowIndex].grades[componentId]) {
//                     newData[rowIndex].grades[componentId] = {}
//                   }
                  
//                   newData[rowIndex].grades[componentId][questionId] = value
//                   const modifiedRecord = {
//                     sinhVienId: newData[rowIndex].id,
//                     cauHoiId: parseInt(questionId),
//                     diem: value,
//                   }
//                   updateKetQua(modifiedRecord);
//                   setModifiedRecords([...modifiedRecords, modifiedRecord]);

//                   setTableData(newData)
//                 }}
//                 isEditing={isEditing}
//               />
//             ),
//           })),
//           {
//             id: `${component.loai}_total`,
//             header: "Tổng",
//             size: 80,
//             accessorFn: (row) => {
//               const grades = row.grades[component.loai] || {}
//               return Object.values(grades).reduce((sum, score) => sum + score, 0)
//             },
//           },
//         ],
//       })
//     })

//     return cols
//   }, [components, questions, tableData, isEditing])

//   const table = useReactTable({
//     data: tableData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   })

//   const handleSaveChanges = async () => {
//     for (const [key, record] of Object.entries(modifiedRecords)) {
//       const { id, ...rest } = record;
//       try {
//         // await updateKetQua(sinhVienId, rest);
//       } catch (error) {
//         console.error(`Error updating record for sinhVienId ${sinhVienId}:`, error);
//       }
//     }
//     setIsEditing(false)
//     // Here you would typically send the updatedGrades to your API
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-end">
//         <Button
//           onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
//         >
//           {isEditing ? "Save Changes" : "Enable Editing"}
//         </Button>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead rowSpan={2} className="text-center px-1 border">Id</TableHead>
//               {/* <TableHead rowSpan={2} className="text-center">MSSV</TableHead> */}
//               <TableHead rowSpan={2} className="text-center px-1 border">Họ và tên</TableHead>
//               {components.map((component) => (
//                 <TableHead
//                   key={component.id}
//                   colSpan={questions[component.id.toString()]?.length + 1}
//                   className="text-center"
//                 >
//                   {component.loai} ({component.trongSo * 100}%)
//                 </TableHead>
//               ))}
//             </TableRow>
//             <TableRow>
//               {components.flatMap((component) => [
//                 ...(questions[component.id.toString()] || []).map((question) => (
//                   <TableHead key={`${component.loai}_${question.id}`} className="text-center px-1 border">
//                     <div>{question.ten}</div>
//                     <div>{question.trongSo * 10}</div>
//                   </TableHead>
//                 )),
//                 <TableHead key={`${component.loai}_total`} className="text-center px-1 border">Tổng</TableHead>
//               ])}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id} className="text-center px-1 border">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }

// // interface EditableCellProps {
// //   value: number
// //   onChange: (value: number) => void
// //   isEditing: boolean
// // }

// function EditableCell({ value, onChange, isEditing }) {
//   const [editValue, setEditValue] = React.useState(value.toString())

//   React.useEffect(() => {
//     setEditValue(value.toString())
//   }, [value])

//   if (!isEditing) {
//     return <span>{value}</span>
//   }

//   return (
//     <Input
//       type="number"
//       value={editValue}
//       onChange={(e) => {
//         const newValue = e.target.value
//         setEditValue(newValue)
//         const numValue = parseFloat(newValue) || 0
//         onChange(numValue)
//       }}
//       className="h-6 w-12 text-center"
//       min={0}
//       max={10}
//       step={0.1}
//     />
//   )
// }

