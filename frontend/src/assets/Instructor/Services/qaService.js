import config from "../../../../config";

// Post a new question to a course
export const postQuestion = async (courseId, questionContent) => {
  try {
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/courses/${courseId}/questions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: questionContent,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to post question");
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting question:", error);
    throw error;
  }
};

// Fetch all questions for a course
export const fetchCourseQuestions = async (courseId) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/courses/${courseId}/questions`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch course questions");
    }

    const responseData = await response.json();
    return { questions: responseData.data || [] };
  } catch (error) {
    console.error("Error fetching course questions:", error);
    throw error;
  }
};

// Post an answer to a question
export const postAnswer = async (questionId, answerContent) => {
  try {
    const token = localStorage.getItem("authToken") || "";

    const response = await fetch(
      `${config.apiUrl}/api/questions/${questionId}/answers/instructor`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: answerContent,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to post answer");
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting answer:", error);
    throw error;
  }
};

// Fetch all answers for a question
export const fetchQuestionAnswers = async (questionId) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/questions/${questionId}/answers`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch question answers");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching question answers:", error);
    throw error;
  }
};
