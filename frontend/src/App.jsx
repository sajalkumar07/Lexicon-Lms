import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./assets/Utils/LandingPage";
import Login from "./assets/Candidate/Components/Auth/Login";
import Signup from "./assets/Candidate/Components/Auth/Signup";
import Courses from "./assets/Candidate/Components/Courses/getCourses";
import InstructorCourses from "./assets/Instructor/Components/InstructorDashboard/InstructorCourses";
import Communication from "./assets/Instructor/Components/InstructorDashboard/Communication";
import Dashboard from "./assets/Instructor/Components/InstructorDashboard/Dashboard";
import InstructorLogin from "./assets/Instructor/Components/Auth/Login";
import InstructorSignin from "./assets/Instructor/Components/Auth/Signup";
import CourseDetailsPage from "./assets/Instructor/DashboardComponents/CourseDetailsPage";
import CustomVideoPlayer from "./assets/Instructor/DashboardComponents/CustomVideoPlayer";
import Profile from "./assets/Candidate/Components/CandidateProfile/Profile";
import Setting from "./assets/Candidate/Components/CandidateProfile/Setting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/get-courses" element={<Courses />} />
        <Route path="/instructor/courses" element={<InstructorCourses />} />
        <Route
          path="/instructor/courses/:courseId"
          element={<CourseDetailsPage />}
        />
        <Route path="/communication" element={<Communication />} />
        <Route path="/instructor-dashboard" element={<Dashboard />} />
        <Route path="/login-instructor" element={<InstructorLogin />} />
        <Route path="/signup-instructor" element={<InstructorSignin />} />
        <Route
          path="/courses/:courseId/player"
          element={<CustomVideoPlayer />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
