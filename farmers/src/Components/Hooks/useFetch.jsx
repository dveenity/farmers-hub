// Retrieve the token from local storage
const token = localStorage.getItem("farm-users-new");

const serVer = `https://farmers-hub-backend.vercel.app`;

// fetch user
export const fetchUser = async () => {
  const url = `${serVer}/home`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// hook to fetch products
export const fetchProducts = async () => {
  const url = `${serVer}/productsFetch`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// hook to fetch admin orders
export const fetchAdminOrders = async (adminId) => {
  const url = `${serVer}/orders/${adminId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// hook to fetch admin delivered orders
export const fetchAdminDeliveredOrders = async (adminId) => {
  const url = `${serVer}/delivered/${adminId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
