export const getRedirectPathByRole = (role) => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "MERCHANT":
      return "/merchant";
    default:
      return "/dashboard";
  }
};
