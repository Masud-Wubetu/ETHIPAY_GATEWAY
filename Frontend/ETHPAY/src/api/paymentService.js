import api from "./axios";

// Initiate payment (JWT REQUIRED)

export const initiatePayment = async (paymentData, token) => {
  const makeRequest = async (tok) => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/bank/payments/initiate/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tok}`,
        },
        body: JSON.stringify(paymentData),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || "Payment initiation failed");
    }

    return response.json();
  };

  try {
    return await makeRequest(token);
  } catch (err) {
    // If token expired, try refresh
    if (err.message.includes("token not valid")) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Session expired. Please login again.");
      return await makeRequest(newToken);
    } else {
      throw err;
    }
  }
};


// Cancel payment (JWT REQUIRED)
export const cancelPayment = async (paymentId, token) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/bank/payments/${paymentId}/cancel/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include JWT here too
      },
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("Backend response:", err);
    throw new Error(err.detail || "Cancel payment failed");
  }

  return response.json();
};


export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    const data = await res.json();
    if (data.access) {
      localStorage.setItem("access", data.access); // save new access token
      return data.access;
    } else {
      return null; // refresh token invalid
    }
  } catch (err) {
    console.error("Refresh token failed:", err);
    return null;
  }
};
