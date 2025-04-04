import config from "../../../../config";

export const fetchInstructorCourseRatings = async (instructorId) => {
  try {
    const token = localStorage.getItem("instructorAuthToken") || "";
    const response = await fetch(
      `${config.apiUrl}/api/instructors/${instructorId}/ratings`,
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
