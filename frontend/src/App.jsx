import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./assets/Utils/LandingPage";
import Login from "./assets/Authentication/UserLogin";
import Signup from "./assets/Authentication/UserSingup";
import Courses from "./assets/Candidate/Components/Courses/getCourses";
import InstructorCourses from "./assets/Instructor/Components/InstructorDashboard/InstructorCourses";
import Communication from "./assets/Instructor/Components/InstructorDashboard/Communication";
import Dashboard from "./assets/Instructor/Components/InstructorDashboard/Dashboard";
import InstructorLogin from "./assets/Authentication/InstructorLogin";
import InstructorSignin from "./assets/Authentication/InstructorSingup";
import CourseDetailsPage from "./assets/Instructor/DashboardComponents/CourseDetailsPage";
import CustomVideoPlayer from "./assets/Instructor/DashboardComponents/CustomVideoPlayer";
import Profile from "./assets/Candidate/Components/CandidateProfile/Profile";
import Setting from "./assets/Candidate/Components/CandidateProfile/Setting";
import CourseDetailsCandidate from "./assets/Candidate/Components/Courses/CourseDetails";
import Test from "./assets/Candidate/test";
import MyLearning from "./assets/Candidate/Components/Courses/MyLearning";

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
        <Route
          path="/candidate/courses/:courseId"
          element={<CourseDetailsCandidate />}
        />
        <Route path="/test" element={<Test />} />
        <Route path="/my-learning" element={<MyLearning />} />
      </Routes>
    </Router>
  );
}

export default App;
