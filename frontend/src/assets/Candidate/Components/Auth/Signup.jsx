/* eslint-disable no-unused-vars */
import React from "react";
import AuthTemplate from "../../../Utils/AuthTemplate";
import { registerUser } from "../../Services/userAuth";

const StudentSignup = () => {
  return (
    <AuthTemplate
      isLogin={false}
      authFunction={registerUser}
      loginRoute="/login"
      signupRoute="/signup"
      loginTitle="Student Signup"
      loginSubtitle1="Your Learning Journey"
      loginSubtitle2="Starts Here!"
    />
  );
};

export default StudentSignup;
