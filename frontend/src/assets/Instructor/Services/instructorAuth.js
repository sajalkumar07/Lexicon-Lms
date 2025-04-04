import config from "../../../../config";

export const loginUser = async ({ email, password }) => {
  try {
    console.log("Login attempt:", { email, password }); // Log the email and password sent

    const response = await fetch(`${config.apiUrl}/api/instructor-auth/login`, {
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
      localStorage.setItem("instructorAuthToken", data.token); // Store token
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/instructor-auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }), // wrap all fields in an object
      }
    );

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
export const logoutInstructor = async () => {
  try {
    // Get the auth token
    const instructorAuthToken = localStorage.getItem("instructorAuthToken");

    const response = await fetch(
      `${config.apiUrl}/api/instructor-auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${instructorAuthToken}`, // Add token in Authorization header
        },
        // credentials: "include", // Remove this if your API doesn't require credentials
      }
    );

    // Even if the server request fails, we should clean up on the client side
    localStorage.removeItem("instructorAuthToken");

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
    localStorage.removeItem("instructorAuthToken");
    return { success: true, message: "Logged out locally" };
  }
};
