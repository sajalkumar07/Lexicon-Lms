import config from "../../../../config";

export const loginUser = async ({ email, password }) => {
  try {
    console.log("Login attempt:", { email, password }); // Log the email and password sent

    const response = await fetch(`${config.apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data); // Log the backend's response
    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }
    if (data.token) {
      localStorage.setItem("authToken", data.token); // Store token
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }), // wrap all fields in an object
    });

    if (!response.ok) {
      const errorData = await response.json(); // Capture the backend's response for better error handling
      throw new Error(errorData.message || "Failed to register user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Get the auth token
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(`${config.apiUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Add token in Authorization header
      },
      // credentials: "include", // Remove this if your API doesn't require credentials
    });

    // Even if the server request fails, we should clean up on the client side
    localStorage.removeItem("authToken");

    // Try to parse response, but don't let it block logout functionality
    try {
      const data = await response.json();
      console.log("Logout response:", data);
      return data;
      // eslint-disable-next-line no-unused-vars
    } catch (parseError) {
      console.log("Logout completed, but couldn't parse server response");
      return { success: true, message: "Logged out successfully" };
    }
  } catch (error) {
    console.error("Logout error:", error);
    // Still remove token even if API call fails
    localStorage.removeItem("authToken");
    return { success: true, message: "Logged out locally" };
  }
};
