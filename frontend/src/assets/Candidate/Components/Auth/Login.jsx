/* eslint-disable no-unused-vars */
import React from "react";
import AuthTemplate from "../../../Utils/AuthTemplate";
import { loginUser } from "../../Services/userAuth";

const StudentLogin = () => {
  const handleSuccessfulLogin = (response) => {
    const userData = {
      email: response.user.email,
      name: response.user.name,
      avatar:
        response.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          response.user.email.split("@")[0]
        )}&background=random`,
      token: response.token || localStorage.getItem("authToken"),
    };

    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthTemplate
      isLogin={true}
      authFunction={loginUser}
      loginRoute="/"
      signupRoute="/signup"
      loginTitle="Student Login"
      loginSubtitle1="Your Learning Journey"
      loginSubtitle2="Starts Here!"
      onSuccessfulAuth={handleSuccessfulLogin}
    />
  );
};

export default StudentLogin;
