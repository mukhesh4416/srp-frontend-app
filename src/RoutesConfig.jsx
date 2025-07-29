import Srp from './SRP/Srp';
import LoginPage from './Authentications/LoginPage';
import Home from './SRP/Home';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProjectRegistration from './SRP/ProjectRegistration';
import Tasks from './SRP/Tasks';
import Bugs from './SRP/Bugs';
import UserRegistration from './SRP/UserRegistration';
import TaskBugTracker from './SRP/dragCmp/TaskBugTracker';

const RoutesConfig = () => (
    <Routes>
        <Route path="/" element={<PrivateRoute redirectPath="/srp/home" />} />
        <Route path="login" element={<PrivateRoute redirectPath="/srp/home" loginPage />} />
        {/* <Route  path="*" element={<PageNotFound/>}  />
        <Route  path="/forbidden" element={<Forbidden/>}  /> */}
        <Route path="/srp" element={<Srp/>}>
            <Route path="home" element={<Home/>} />
            <Route path="tasks" element={<Tasks/>} />
            <Route path="bugs" element={<Bugs/>} />
            <Route path="projects" element={<ProjectRegistration/>} />
            <Route path="user-registration" element={<UserRegistration/>} />
            <Route path="pending" element={<TaskBugTracker/>} />
        </Route>
    </Routes>
)


const PrivateRoute = ({ redirectPath, loginPage }) => {
    const isAuthenticated = sessionStorage.getItem("TOKEN");
    if (loginPage) {
      return isAuthenticated ? <Navigate to={redirectPath} replace /> : <LoginPage/>;
    }

    return isAuthenticated ? (
      <Navigate to={redirectPath} replace />
    ) : (
       <Navigate to="/login" replace />
    );
};
  
PrivateRoute.propTypes = {
  redirectPath: PropTypes.string.isRequired,
  loginPage: PropTypes.bool,
};

export default RoutesConfig;