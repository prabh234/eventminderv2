"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle2, Search, Settings2 } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from "axios"
import clsx from "clsx"
import { ScrollArea } from "../ui/scroll-area"

// Updated data type for attendance
export type Attendance = {
  id: string
  status: boolean
  attendee:{
    fname:string,
    lname:string,
    email:string,
  }
}
// const att: Attendance[] = [
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"aman", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},},
//   { id:"234", status:false, attendee:{ fname:"prabh", lname:"singh", email:"singh@gmail.com"},}
// ]
export const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "status",
    header: "Present",
    cell: ({ row }) => {
      const isPresent = row.getValue("status")
      
      return (
        <div className="flex items-center">
          <Checkbox
            checked={isPresent as boolean}
            aria-label="Mark attendance"
            className="h-5 w-5 rounded-full" 
            disabled={isPresent as boolean}
          />
          {isPresent === true && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    accessorFn: (row) => `${row.attendee.fname} ${row.attendee.lname}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <span className="font-medium"> {row.original.attendee.fname} {row.original.attendee.lname}</span>,
  },
  {
    accessorKey: "attendee.email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.original.attendee.email}</div>,
  },
]

export function AttendanceTable({ eventid,refreshKey  }: { eventid: string,refreshKey :number }) {
  // ... existing state and effects
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [attendence,setAttendence] = React.useState<Attendance[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/moderator/attendence?id=${eventid}`);
        setAttendence(data.res);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    
    fetchData();
    
    // Add polling for additional real-time updates
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [eventid, refreshKey]); // Add refreshKey to dependency array

  const table = useReactTable<Attendance>({
    data: attendence,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })



  return (
    <div className="w-full flex-1 space-y-6">
      <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="relative max-w-sm w-full">
            <Input
              placeholder="Search attendees..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                const value = event.target.value
                table.getColumn("name")?.setFilterValue(value)
                table.getColumn("attendee.email")?.setFilterValue(value)
              }}
              className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full gap-2">
                <Settings2 className="h-4 w-4" />
                <span>Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id.replace('attendee.', '')}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-lg shadow-sm overflow-hidden mt-6">
              <div className="flex items-center gap-2 p-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-muted-foreground">
                Live updates enabled
              </span>
            </div>
            <ScrollArea className="h-[calc(87vh-300px)] rounded-md border">
          <Table className="border-collapse">
            <TableHeader className="[&_tr]:border-b-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow 
                  key={headerGroup.id} 
                  className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-b"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                    >
                      {flexRender(
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
                    className={clsx(
                      "transition-all duration-300",
                      row.original.status 
                        ? "bg-green-50/50 dark:bg-green-900/20 hover:bg-green-100/50 dark:hover:bg-green-900/30"
                        : "hover:bg-muted/50",
                      row.original.status && "animate-pulse-once" // Add this line
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
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
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No attendees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </ScrollArea>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{table.getFilteredRowModel().rows.length} total Participants</span>
          </div>
        </div>
      </div>
    </div>
  )
}