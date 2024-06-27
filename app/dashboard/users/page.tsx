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

export default async function page({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/login");
  if (session.user.role !== "ADMIN") notFound();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      OR: [
        { id: { contains: searchParams.search ?? "" } },
        { name: { contains: searchParams.search ?? "" } },
        { email: { contains: searchParams.search ?? "" } },
      ],
    },
  });

  return (
    <div>
      <div className="mb-4">
        <TableToolbar />
      </div>

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
    </div>
  );
}
