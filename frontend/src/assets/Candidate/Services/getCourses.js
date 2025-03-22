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
