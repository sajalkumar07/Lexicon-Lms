import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./assets/Utils/LandingPage";
import Login from "./assets/Candidate/Components/Auth/Login";
import Signup from "./assets/Candidate/Components/Auth/Signup";
import Courses from "./assets/Candidate/Components/Courses/getCourses";
import InstructorCourses from "./assets/Instructor/Components/InstructorDashboard/InstructorCourses";
import Communication from "./assets/Instructor/Components/InstructorDashboard/Communication";
import Dashboard from "./assets/Instructor/Components/InstructorDashboard/Dashboard";
import Help from "./assets/Instructor/Components/InstructorDashboard/Helps";
import InstructorLogin from "./assets/Instructor/Components/Auth/Login";
import InstructorSignin from "./assets/Instructor/Components/Auth/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/get-courses" element={<Courses />} />
        <Route path="/instructor/courses" element={<InstructorCourses />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/instructor-dashboard" element={<Dashboard />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login-instructor" element={<InstructorLogin />} />
        <Route path="/signup-instructor" element={<InstructorSignin />} />
      </Routes>
    </Router>
  );
}

export default App;
