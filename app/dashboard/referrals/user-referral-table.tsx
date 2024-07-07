import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import TablePagination from "@/components/table-pagination";

export default async function UserReferralTable({
  page,
  perPage,
  referredById,
  searchString,
}: {
  page: number;
  perPage: number;
  referredById: string;
  searchString: string;
}) {
  const referralCount = await prisma.referral.count({
    where: {
      referredById,
      OR: [
        { referredTo: { name: { contains: searchString } } },
        { referredTo: { email: { contains: searchString } } },
      ],
    },
  });

  const referrals = await prisma.referral.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    orderBy: { createdAt: "desc" },
    include: { referredTo: true },
    where: {
      referredById,
      OR: [
        { referredTo: { name: { contains: searchString } } },
        { referredTo: { email: { contains: searchString } } },
      ],
    },
  });

  return (
    <>
      <div className="rounded-md border">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>
                  <p>{referral.referredTo.name}</p>
                  <small>{referral.referredTo.id}</small>
                </TableCell>
                <TableCell>{referral.referredTo.email}</TableCell>
                <TableCell>
                  <Badge
                    className="uppercase"
                    variant={
                      referral.referredTo.active ? "default" : "secondary"
                    }
                  >
                    {referral.referredTo.active.toString()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination total={referralCount} page={page} perPage={perPage} />
    </>
  );
}
