/* eslint-disable no-unused-vars */
import React from "react";
import AuthTemplate from "../../../Utils/AuthTemplate";
import { registerUser } from "../../Services/instructorAuth";

const InstructorSignup = () => {
  return (
    <AuthTemplate
      isLogin={false}
      authFunction={registerUser}
      loginRoute="/login-instructor"
      signupRoute="/signup-instructor"
      loginTitle="Instructor Signup"
      loginSubtitle1="Empower Minds"
      loginSubtitle2="Shape Futures"
    />
  );
};

export default InstructorSignup;
