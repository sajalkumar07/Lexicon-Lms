import config from "../../../../config";

export const fetchCourseRatings = async (courseId) => {
  try {
    const token = localStorage.getItem("authToken") || "";
    const response = await fetch(
      `${config.apiUrl}/api/courses/${courseId}/ratings/ratings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch course ratings");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching course ratings:", error);
    throw error;
  }
};

export const rateCourse = async (courseId, rating, feedback) => {
  try {
    const token = localStorage.getItem("authToken") || "";
    const response = await fetch(
      `${config.apiUrl}/api/courses/${courseId}/ratings/rate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, feedback }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to rate course");
    }

    return await response.json();
  } catch (error) {
    console.error("Error rating course:", error);
    throw error;
  }
};
