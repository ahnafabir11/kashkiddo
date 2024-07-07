import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import StatusDropdown from "./active-status-dropdown";
import TableToolbar from "@/components/table-toolbar";
import TablePagination from "@/components/table-pagination";
import { PaginationShchema } from "@/lib/validations/pagination";

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Submission Table Pagination
  const result = await PaginationShchema.safeParseAsync(searchParams);

  if (!result.success) {
    redirect(`/dashboard/users?page=${1}&per_page=${10}`);
  }

  const { page, per_page, search } = result.data;

  // Athentication
  const session = await auth();
  if (!session || !session.user) redirect("/login");
  if (session.user.role !== "ADMIN") notFound();

  // Data Queries
  const userCount = await prisma.user.count({
    where: {
      OR: [
        { id: { contains: search || "", mode: "insensitive" } },
        { name: { contains: search || "", mode: "insensitive" } },
        { email: { contains: search || "", mode: "insensitive" } },
      ],
    },
  });

  const users = await prisma.user.findMany({
    take: per_page,
    skip: (page - 1) * per_page,
    orderBy: { createdAt: "desc" },
    where: {
      OR: [
        { id: { contains: search || "", mode: "insensitive" } },
        { name: { contains: search || "", mode: "insensitive" } },
        { email: { contains: search || "", mode: "insensitive" } },
      ],
    },
  });

  return (
    <div className="space-y-8">
      <TableToolbar />

      <div className="rounded-md border">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p>{user.name}</p>
                  <small>{user.id}</small>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <StatusDropdown userId={user.id} status={user.active} />
                </TableCell>
                <TableCell>
                  <StatusDropdown userId={user.id} status={user.verified} />
                </TableCell>
                <TableCell>{user.balance}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination total={userCount} page={page} perPage={per_page} />
    </div>
  );
}
