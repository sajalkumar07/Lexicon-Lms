/* eslint-disable no-unused-vars */
import React from "react";
import { registerInstructor } from "../Instructor/Services/instructorAuth";
import AuthLayout from "./AuthLayout";
import SignupForm from "./SignupForm";

const InstructorSignup = () => {
  return (
    <AuthLayout
      title="Sign Up"
      primaryHeading="Minds Shape Futures"
      secondaryHeading="Your classroom, Your rules"
      redirectText="if you already have an account"
      redirectLink="/login-instructor"
      redirectLinkText="login here"
    >
      <SignupForm
        registerFunction={registerInstructor}
        redirectPath="/login-instructor"
      />
    </AuthLayout>
  );
};
export default InstructorSignup;
