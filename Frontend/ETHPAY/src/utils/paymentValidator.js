export const validatePayment = (data) => {
  if (!data.receiver_email || data.receiver_email.trim() === "") {
    return "Recipient is required";
  }

  if (!data.amount || Number(data.amount) <= 0) {
    return "Amount must be greater than zero";
  }

  if (!data.method) {
    return "Payment method is required";
  }

  return null;
};
