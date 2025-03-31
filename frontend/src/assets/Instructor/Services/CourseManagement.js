import config from "../../../../config";

// Fetch a specific course's details
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

// Fetch videos for a specific course
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

// Add a new video lecture to a course
export const addVideoLecture = async (courseId, videoData) => {
  try {
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/courses/course/${courseId}/videos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(videoData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add video lecture");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding video lecture:", error);
    throw error;
  }
};

// Delete a video lecture from a course
export const deleteVideoLecture = async (courseId, videoId) => {
  try {
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/courses/deleteCourse/${courseId}/videos/${videoId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete video lecture");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting video lecture:", error);
    throw error;
  }
};

// Get all courses for an instructor
export const fetchAllInstructorCourses = async () => {
  try {
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
    console.error("Error fetching instructor courses:", error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
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

// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/courses/deleteCourse/${courseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete course");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
  try {
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/courses/updateCourse/${courseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update course");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Update a video lecture
export const updateVideoLecture = async (courseId, videoId, videoData) => {
  try {
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/courses/updateCourse/${courseId}/videos/${videoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(videoData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update video lecture");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating video lecture:", error);
    throw error;
  }
};

export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch(`${config.apiUrl}/api/upload-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload image");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Upload a video without authentication
export const uploadVideo = async (videoFile) => {
  try {
    const formData = new FormData();
    formData.append("file", videoFile);

    const response = await fetch(`${config.apiUrl}/api/upload-video`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload video");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};
