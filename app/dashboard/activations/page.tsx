import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import TableToolbar from "@/components/table-toolbar";
import TablePagination from "@/components/table-pagination";
import { PaginationShchema } from "@/lib/validations/pagination";
import ActiveStatusDropdown from "../users/active-status-dropdown";
import ActiveRequestStatusDropdownProps from "./active-request-status-dropdown";

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Submission Table Pagination
  const result = await PaginationShchema.safeParseAsync(searchParams);

  if (!result.success) {
    redirect(`/dashboard/activations?page=${1}&per_page=${10}`);
  }

  const { page, per_page, search } = result.data;

  // Athentication
  const session = await auth();
  if (!session || !session.user) redirect("/login");
  if (session.user.role !== "ADMIN") notFound();

  // Data Queries
  const activationCount = await prisma.activation.count({
    where: {
      OR: [
        { userId: { contains: search || "", mode: "insensitive" } },
        { phoneNumber: { contains: search || "", mode: "insensitive" } },
        { transactionId: { contains: search || "", mode: "insensitive" } },
        { user: { name: { contains: search || "", mode: "insensitive" } } },
        { user: { email: { contains: search || "", mode: "insensitive" } } },
      ],
    },
  });

  const activations = await prisma.activation.findMany({
    take: per_page,
    skip: (page - 1) * per_page,
    orderBy: { createdAt: "desc" },
    include: {
      user: { include: { referredBy: { include: { referredBy: true } } } },
    },
    where: {
      OR: [
        { userId: { contains: search || "", mode: "insensitive" } },
        { phoneNumber: { contains: search || "", mode: "insensitive" } },
        { transactionId: { contains: search || "", mode: "insensitive" } },
        { user: { name: { contains: search || "", mode: "insensitive" } } },
        { user: { email: { contains: search || "", mode: "insensitive" } } },
      ],
    },
  });

  return (
    <main className="space-y-8">
      <TableToolbar />

      <div className="rounded-md border">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Tansaction ID</TableHead>
              <TableHead>Referred By</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Complete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {activations.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <p>{request.user.name}</p>
                  <small>{request.user.id}</small>
                </TableCell>
                <TableCell>{request.phoneNumber}</TableCell>
                <TableCell>{request.transactionId}</TableCell>
                <TableCell>
                  <p>{request.user.referredBy?.referredBy.name}</p>
                  <small>{request.user.referredBy?.referredBy.id}</small>
                </TableCell>
                <TableCell>
                  <ActiveStatusDropdown
                    userId={request.userId}
                    status={request.user.active}
                  />
                </TableCell>
                <TableCell>
                  <ActiveRequestStatusDropdownProps
                    requestId={request.id}
                    status={request.complete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination page={page} perPage={per_page} total={activationCount} />
    </main>
  );
}
