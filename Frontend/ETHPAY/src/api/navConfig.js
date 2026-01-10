export const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    roles: ["CUSTOMER", "ADMIN", "MERCHANT"],
  },
  {
    label: "Payments",
    to: "/payments/new",
    roles: ["CUSTOMER", "MERCHANT"], // who can see/use it
  },
  {
    label: "Transactions",
    to: "/transactions",
    roles: ["CUSTOMER", "MERCHANT", "ADMIN"],
  },
  {
    label: "Admin",
    to: "/admin",
    roles: ["ADMIN"],
  },
];
