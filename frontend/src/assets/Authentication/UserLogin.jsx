/* eslint-disable no-unused-vars */
import React from "react";
import { loginUser } from "../Candidate/Services/userAuth";
import AuthLayout from "./AuthLayout";
import LoginForm from "./LoginForm";

const UserLogin = () => {
  return (
    <AuthLayout
      title="Login"
      primaryHeading="Your Learning Journey"
      secondaryHeading="Unlock Endless Possibilities!"
      redirectText="if you don't have an account"
      redirectLink="/signup"
      redirectLinkText="signup here"
    >
      <LoginForm loginFunction={loginUser} redirectPath="/" userType="user" />
    </AuthLayout>
  );
};

export default UserLogin;
