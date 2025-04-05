/* eslint-disable no-unused-vars */
import React from "react";
import { loginInstructor } from "../Instructor/Services/instructorAuth";
import AuthLayout from "./AuthLayout";
import LoginForm from "./LoginForm";

const InstructorLogin = () => {
  return (
    <AuthLayout
      title="Login"
      primaryHeading="Minds Shape Futures"
      secondaryHeading="Your classroom, Your rules"
      redirectText="if you don't have an account"
      redirectLink="/signup-instructor"
      redirectLinkText="signup here"
    >
      <LoginForm
        loginFunction={loginInstructor}
        redirectPath="/instructor-dashboard"
        userType="instructor"
      />
    </AuthLayout>
  );
};

export default InstructorLogin;
