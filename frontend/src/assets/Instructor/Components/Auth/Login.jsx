/* eslint-disable no-unused-vars */
import React from "react";
import AuthTemplate from "../../../Utils/AuthTemplate";
import { loginUser } from "../../Services/instructorAuth";

const InstructorLogin = () => {
  const handleSuccessfulLogin = (response) => {
    const instructorData = {
      email: response.instructor.email,
      name: response.instructor.name,
      avatar:
        response.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          response.instructor.email.split("@")[0]
        )}&background=random`,
      token: response.token || localStorage.getItem("authToken"),
      instructor: response.instructor.id,
    };

    localStorage.setItem("instructorData", JSON.stringify(instructorData));
  };

  return (
    <AuthTemplate
      isLogin={true}
      authFunction={loginUser}
      loginRoute="/instructor-dashboard"
      signupRoute="/signup-instructor"
      loginTitle="Instructor Login"
      loginSubtitle1="Empower Minds"
      loginSubtitle2="Shape Futures"
      onSuccessfulAuth={handleSuccessfulLogin}
    />
  );
};

export default InstructorLogin;
