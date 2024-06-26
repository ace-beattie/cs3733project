import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { DataTableColumnHeader } from "@/components/ui/dt-sortable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RouterOutput, trpc } from "@/utils/trpc.ts";
import { Route, useLocation } from "wouter";
import { DateTime } from "luxon";
import { CheckSquareIcon, CirclePlay, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { ScheduleAppointmentDialogue } from "../ScheduleAppointmentDialogue";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Switch } from "../ui/switch";

export function AppointmentsTable({ className }: { className?: string }) {
  const utils = trpc.useUtils();
  const [data] = trpc.appointment.getAll.useSuspenseQuery({
    onlyUpcoming: true,
  });
  const cancelAppointment = trpc.appointment.deleteOne.useMutation({
    onSuccess: () => {
      utils.appointment.getAll.invalidate();
    },
  });
  const updateAppointment = trpc.appointment.updateOne.useMutation({
    onSuccess: () => {
      utils.appointment.getAll.invalidate();
    },
  });
  const createVisit = trpc.visit.createOne.useMutation();

  const [me] = trpc.user.me.useSuspenseQuery();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [, setLocation] = useLocation();

  const deleteMutation = trpc.record.deleteOne.useMutation();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<RouterOutput["appointment"]["getAll"][0]>[] = [
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      accessorFn: ({ patient }) =>
        `${patient.firstName} ${patient.middleName ? patient.middleName + " " : ""}${patient.lastName}`,
      id: "name",
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Time" />
      ),
      accessorFn: ({ appointmentTime }) =>
        DateTime.fromJSDate(appointmentTime).toLocaleString(
          DateTime.DATETIME_MED,
        ),
      sortingFn: (rowA, rowB) => {
        return (
          rowA.original.appointmentTime.valueOf() -
          rowB.original.appointmentTime.valueOf()
        );
      },
      id: "appointmentTime",
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notes" />
      ),
      accessorKey: "notes",
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Checked In" />
      ),
      accessorKey: "checkedIn",
      cell: ({ row }) => {
        const appointment = row.original;

        if (appointment.checkedIn) {
          return <CheckCircledIcon className="w-4 h-4 stroke-green-700" />;
        } else {
          return <XCircle className="w-4 h-4 stroke-red-700" />;
        }
      },
    },
    {
      id: "doCheckIn",
      enableHiding: false,
      cell: ({ row }) => {
        const appointment = row.original;

        return (
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Button
                disabled={appointment.checkedIn}
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const checkedInAppointment = updateAppointment.mutateAsync({
                    id: appointment.id,
                    data: {
                      checkedIn: true,
                    },
                  });

                  toast.promise(checkedInAppointment, {
                    success: "Checked in appointment.",
                    loading: "Checking in appointment...",
                    error: "Failed to check in appointment",
                  });
                }}
              >
                <CheckSquareIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Check In</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      id: "start",
      enableHiding: false,
      cell: ({ row }) => {
        const appointment = row.original;

        return (
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const visit =
                    appointment.visit?.id ??
                    (
                      await createVisit.mutateAsync({
                        appointment: {
                          connect: {
                            id: appointment.id,
                          },
                        },
                        patient: {
                          connect: {
                            id: appointment.patient.id,
                          },
                        },
                        visitTime: new Date().toISOString(),
                        staff: {
                          connect: {
                            id: me!.staff!.id,
                          },
                        },
                      })
                    ).id;

                  setLocation("/visit/" + visit);
                }}
              >
                <CirclePlay className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {appointment.visit ? "Resume" : "Begin"} Appointment
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      id: "cancel",
      enableHiding: false,
      cell: ({ row }) => {
        const appointment = row.original;

        return (
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Button
                disabled={!!appointment.visit}
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const deletion = cancelAppointment.mutateAsync({
                    id: appointment.id,
                  });

                  toast.promise(deletion, {
                    success: "Cancelled appointment.",
                    loading: "Cancelling appointment...",
                    error: "Failed to cancel appointment",
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cancel Appointment</TooltipContent>
          </Tooltip>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "appointmentTime",
          desc: false,
        },
      ],
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div
      className={cn("shadow-md rounded-md overflow-auto relative", className)}
    >
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(v) => {
          if (!v) setDeletingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              record and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deletingId) return;

                const deletion = deleteMutation.mutateAsync(
                  {
                    id: deletingId,
                  },
                  {
                    onSuccess: () => {
                      utils.record.getAll.invalidate();
                      utils.record.getOne.invalidate();
                    },
                  },
                );

                toast.promise(deletion, {
                  success: "Record successfully deleted",
                  loading: "Attempting to delete user",
                  error: "Failed to delete user",
                });
                await deletion;
                setDeletingId(null);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-2 items-center">
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <Switch
                  checked={
                    table.getColumn("checkedIn")?.getFilterValue() as boolean
                  }
                  onCheckedChange={(c) => {
                    table
                      .getColumn("checkedIn")
                      ?.setFilterValue(c ? true : undefined);
                  }}
                >
                  Test
                </Switch>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Show only checked in appointments.</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type="text"
              placeholder="Filter names..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="flex-1"
            />
            <Button
              className="shrink-0"
              onClick={() => setLocation("/schedule")}
            >
              Schedule
            </Button>
          </div>
          <Table className="overflow-auto bg-white shadow-md">
            <TableHeader className="sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="overflow-auto">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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
                    No upcoming appointments!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Route path="/schedule" nest>
        <ScheduleAppointmentDialogue
          open={true}
          setOpen={() => setLocation("/")}
        />
      </Route>
    </div>
  );
}
