import config from "../../../../config";

//get all courses api
export const fetchAllInstructorCourses = async () => {
  try {
    // Get the JWT token from wherever you're storing it (localStorage, cookie, etc.)
    // This is just an example - replace with your actual token retrieval method
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/courses/instructorCourses`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch courses");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in courseService.fetch your courses:", error);
    throw error;
  }
};

//create course api
export const createCourse = async (courseData) => {
  try {
    // Get the JWT token from wherever you store it (localStorage, context, etc.)
    // This is just an example - replace with your actual token management
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(`${config.apiUrl}/api/courses/createCourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create course");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};
