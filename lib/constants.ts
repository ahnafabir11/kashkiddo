import {
  Home,
  Handshake,
  ClipboardList,
  HandCoins,
  Users,
  ShieldCheck,
  CircleDollarSign,
  SquareCheckBig,
} from "lucide-react";

export const activationCharge = 50;
export const referralBonus = 20;
export const minWithdrawAmmount = 300;

export const navLinks = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/dashboard",
    allowedUser: ["ADMIN", "USER"],
  },
  {
    icon: Users,
    label: "Users",
    href: "/dashboard/users",
    allowedUser: ["ADMIN"],
  },
  {
    icon: ShieldCheck,
    label: "Activations",
    href: "/dashboard/activations",
    allowedUser: ["ADMIN"],
  },
  {
    icon: HandCoins,
    label: "Payments",
    href: "/dashboard/payments",
    allowedUser: ["ADMIN"],
  },
  {
    icon: ClipboardList,
    label: "Tasks",
    href: "/dashboard/tasks",
    allowedUser: ["ADMIN", "USER"],
  },
  {
    icon: SquareCheckBig,
    label: "Submissions",
    href: "/dashboard/submissions",
    allowedUser: ["ADMIN"],
  },
  {
    icon: CircleDollarSign,
    label: "Wallet",
    href: "/dashboard/wallet",
    allowedUser: ["ADMIN", "USER"],
  },
  {
    icon: Handshake,
    label: "Referrals",
    href: "/dashboard/referrals",
    allowedUser: ["ADMIN", "USER"],
  },
];
