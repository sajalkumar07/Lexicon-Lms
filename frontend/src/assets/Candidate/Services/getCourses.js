import config from "../../../../config";

export const fetchAllCourses = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/api/courses/fetchCourses`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch courses");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in courseService.fetchAllCourses:", error);
    throw error;
  }
};

export const fetchCourseDetails = async (courseId) => {
  try {
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/courses/course/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch course details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
};

export const fetchCourseVideos = async (courseId) => {
  try {
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/courses/course/${courseId}/videos`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch course videos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching course videos:", error);
    throw error;
  }
};
