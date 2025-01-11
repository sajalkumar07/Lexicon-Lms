import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./assets/CommonComponent/LandingPage";
import Login from "./assets/Candidate/Components/Auth/Login";
import Signup from "./assets/Candidate/Components/Auth/Signup";
import Courses from "./assets/Candidate/Components/Courses/getCourses";
import InstructorDashboard from "./assets/Instructor/Components/InstructorDashboard/DashboardMain";
import CreateCourse from "./assets/Instructor/Components/InstructorDashboard/CreateCourse";
import Communication from "./assets/Instructor/Components/InstructorDashboard/Communication";
import Performance from "./assets/Instructor/Components/InstructorDashboard/Performance";
import Help from "./assets/Instructor/Components/InstructorDashboard/Helps";
import InstructorLogin from "./assets/Instructor/Components/Auth/Login";
import InstructorSignin from "./assets/Instructor/Components/Auth/Signin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/get-courses" element={<Courses />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login-instructor" element={<InstructorLogin />} />
        <Route path="/signup-instructor" element={<InstructorSignin />} />
      </Routes>
    </Router>
  );
}

export default App;
