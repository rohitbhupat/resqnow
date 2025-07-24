const API = import.meta.env.VITE_USER_API

export const saveUserData = async (data, token) => {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Error saving to DynamoDB:", err);
    throw err;
  }
};
// 🔄 Get user data
export const getUserData = async (username, token) => {
  try {
    const res = await fetch(
      `${API}?username=${username}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.error("Error fetching user data:", err);
    throw err;
  }
};

// 🛠 Update user
export const updateUserData = async (data, token) => {
  try {
    const res = await fetch(API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Error updating user data:", err);
    throw err;
  }
};

// ❌ Delete user
export const deleteUserData = async (username, token) => {
  try {
    const res = await fetch(
      `${API}?username=${username}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.error("Error deleting user data:", err);
    throw err;
  }
};
