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

export default async function AdminReferralTable({
  page,
  perPage,
  searchString,
}: {
  page: number;
  perPage: number;
  searchString: string;
}) {
  const referralCount = await prisma.referral.count({
    where: {
      OR: [
        { referredBy: { id: { contains: searchString } } },
        { referredBy: { name: { contains: searchString } } },
        { referredBy: { email: { contains: searchString } } },
        { referredTo: { id: { contains: searchString } } },
        { referredTo: { name: { contains: searchString } } },
        { referredTo: { email: { contains: searchString } } },
      ],
    },
  });

  const referrals = await prisma.referral.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    orderBy: { createdAt: "desc" },
    include: { referredBy: true, referredTo: true },
    where: {
      OR: [
        { referredBy: { id: { contains: searchString } } },
        { referredBy: { name: { contains: searchString } } },
        { referredBy: { email: { contains: searchString } } },
        { referredTo: { id: { contains: searchString } } },
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
              <TableHead colSpan={3}>Referred By</TableHead>
              <TableHead colSpan={3}>Referred To</TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>
                  <p>{referral.referredBy.name}</p>
                  <small>{referral.referredBy.id}</small>
                </TableCell>
                <TableCell>{referral.referredBy.email}</TableCell>
                <TableCell>
                  <Badge
                    className="uppercase"
                    variant={referral.referredBy.active ? "default" : "outline"}
                  >
                    {referral.referredBy.active.toString()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p>{referral.referredTo.name}</p>
                  <small>{referral.referredTo.id}</small>
                </TableCell>
                <TableCell>{referral.referredTo.email}</TableCell>
                <TableCell>
                  <Badge
                    className="uppercase"
                    variant={referral.referredTo.active ? "default" : "outline"}
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
