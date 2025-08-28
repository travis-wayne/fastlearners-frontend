"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChevronDown,
  MoreHorizontal,
  Eye,
  Trash2,
  Download,
  Filter,
  RefreshCw,
  Search,
  BookOpen,
  Calendar,
  GraduationCap,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Lesson, 
  Class, 
  Subject, 
  getLessons, 
  getClassesAndSubjects, 
  deleteLesson,
  LessonsResponse 
} from "@/lib/api/lessons";

interface LessonsDataTableProps {
  className?: string;
}

const TERMS = ["First", "Second", "Third"];
const WEEKS = Array.from({ length: 15 }, (_, i) => i + 1);

export function LessonsDataTable({ className }: LessonsDataTableProps) {
  const router = useRouter();
  const [data, setData] = useState<Lesson[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  });

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Lesson>[] = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      size: 60,
    },
    {
      accessorKey: "topic",
      header: "Topic",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.getValue("topic")}</div>
          <div className="text-xs text-muted-foreground truncate">
            {row.original.overview.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      accessorKey: "class",
      header: "Class",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("class")}
        </Badge>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div className="max-w-[150px] truncate font-medium">
          {row.getValue("subject")}
        </div>
      ),
    },
    {
      accessorKey: "term",
      header: "Term",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue("term")}
        </Badge>
      ),
    },
    {
      accessorKey: "week",
      header: "Week",
      cell: ({ row }) => (
        <Badge variant="outline">
          Week {row.getValue("week")}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {new Date(row.getValue("created_at")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const lesson = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleViewLesson(lesson.id)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExportLesson(lesson)}
                className="cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteLesson(lesson.id)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Get filtered subjects based on selected class
  const filteredSubjects = useMemo(() => {
    if (!selectedClass) return subjects;
    const classId = classes.find(c => c.name === selectedClass)?.id;
    return subjects.filter(s => s.class_id === classId);
  }, [selectedClass, subjects, classes]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [classesAndSubjects, lessonsData] = await Promise.all([
          getClassesAndSubjects(),
          getLessons({ page: 1, per_page: 10 })
        ]);
        
        setClasses(classesAndSubjects.classes);
        setSubjects(classesAndSubjects.subjects);
        setData(lessonsData.lessons);
        setPagination(lessonsData.pagination);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load lessons data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch lessons when filters change
  const fetchLessons = async (page: number = 1) => {
    try {
      setLoading(true);
      const classId = selectedClass ? classes.find(c => c.name === selectedClass)?.id : undefined;
      const subjectId = selectedSubject ? filteredSubjects.find(s => s.name === selectedSubject)?.id : undefined;
      const week = selectedWeek ? parseInt(selectedWeek) : undefined;

      const lessonsData = await getLessons({
        class_id: classId,
        subject_id: subjectId,
        term: selectedTerm || undefined,
        week,
        search: searchQuery || undefined,
        page,
        per_page: pagination.per_page
      });

      setData(lessonsData.lessons);
      setPagination(lessonsData.pagination);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLessons(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedClass, selectedSubject, selectedTerm, selectedWeek, searchQuery]);

  const handleViewLesson = (lessonId: number) => {
    router.push(`/superadmin/lessons/view/${lessonId}`);
  };

  const handleExportLesson = (lesson: Lesson) => {
    // Create downloadable JSON file
    const dataStr = JSON.stringify(lesson, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lesson-${lesson.id}-${lesson.topic.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Lesson exported successfully');
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm('Are you sure you want to delete this lesson? It will be moved to trash.')) {
      return;
    }

    try {
      await deleteLesson(lessonId);
      toast.success('Lesson moved to trash successfully');
      fetchLessons(pagination.current_page);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete lesson');
    }
  };

  const handleRefresh = () => {
    fetchLessons(pagination.current_page);
  };

  const handleClearFilters = () => {
    setSelectedClass("");
    setSelectedSubject("");
    setSelectedTerm("");
    setSelectedWeek("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedClass || selectedSubject || selectedTerm || selectedWeek || searchQuery;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Browse Lessons
            </CardTitle>
            <CardDescription>
              View and manage all lesson content ({pagination.total} total lessons)
            </CardDescription>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedClass || "all"} onValueChange={(value) => setSelectedClass(value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject || "all"} onValueChange={(value) => setSelectedSubject(value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {filteredSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTerm || "all"} onValueChange={(value) => setSelectedTerm(value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              {TERMS.map((term) => (
                <SelectItem key={term} value={term}>
                  {term} Term
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedWeek || "all"} onValueChange={(value) => setSelectedWeek(value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Weeks</SelectItem>
              {WEEKS.map((week) => (
                <SelectItem key={week} value={week.toString()}>
                  Week {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilters}
                className="h-8"
              >
                <Filter className="h-3 w-3 mr-1" />
                Clear Filters
              </Button>
            )}
            <div className="text-sm text-muted-foreground">
              Showing {pagination.from}-{pagination.to} of {pagination.total} lessons
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading lessons...
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewLesson(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        onClick={cell.column.id === 'actions' ? (e) => e.stopPropagation() : undefined}
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-8 w-8" />
                      <div>No lessons found</div>
                      <div className="text-sm">
                        {hasActiveFilters ? 'Try adjusting your filters' : 'No lessons have been uploaded yet'}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Page {pagination.current_page} of {pagination.last_page}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLessons(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLessons(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
