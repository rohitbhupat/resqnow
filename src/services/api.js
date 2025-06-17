export const saveUserData = async (data, token) => {
  try {
    const res = await fetch("https://rhpz0ubnt0.execute-api.ap-south-1.amazonaws.com/storeUserData", {
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