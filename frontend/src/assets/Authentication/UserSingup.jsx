/* eslint-disable no-unused-vars */
// UserSignup.jsx
import React from "react";
import { registerUser } from "../Candidate/Services/userAuth";
import AuthLayout from "./AuthLayout";
import SignupForm from "./SignupForm";

const UserSignup = () => {
  return (
    <AuthLayout
      title="Sign Up"
      primaryHeading="Your Learning Journey"
      secondaryHeading="Unlock Endless Possibilities!"
      redirectText="if you already have an account"
      redirectLink="/login"
      redirectLinkText="login here"
    >
      <SignupForm registerFunction={registerUser} redirectPath="/login" />
    </AuthLayout>
  );
};
export default UserSignup;
