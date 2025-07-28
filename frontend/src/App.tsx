import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NongpanyaVending from './pages/form-page';
import LoginPage from './pages/login-page';
import ResultPage from './pages/result-page';
import LoadingPage from './pages/loading-page';
import ScreenWelcomePage from "./pages/screen/welcome";
import ScreenQRCodePage from "./pages/screen/qrcode-page";
import GivingScreen from "./pages/screen/giving-page";
import CompletionScreen from "./pages/screen/complete-page";
import UnauthorizedPage from './pages/unauthorized-page';
import Homepage from './pages/homepage';
import './App.css';
import './index.css';
import Redirect from './pages/auth-redirect';
import authUser from './hooks/authUser';
import roleBasedAuth from './hooks/roleBasedAuth';
import DashboardPage from './pages/dashboard-page';
import UserLogPage from './pages/user-log-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={authUser(<Homepage />)} />
        <Route path="/form" element={authUser(<NongpanyaVending />)} />
        <Route path="/result" element={authUser(<ResultPage />)} />
        <Route path='/loading' element={<LoadingPage />} />
        <Route path='/auth' element={<Redirect />} />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />
        {/* Role-based protected routes */}
        <Route 
          path='/dashboard' 
          element={roleBasedAuth(<DashboardPage />, { 
            // requiredRole: 'admin',
            allowedRoles: ['admin', 'superadmin'],
            fallbackPath: '/unauthorized'
          })} 
        />
        <Route 
          path='/user-log' 
          element={roleBasedAuth(<UserLogPage />, { 
            // requiredRole: 'admin',
            allowedRoles: ['admin', 'superadmin'],
            fallbackPath: '/unauthorized'
          })} 
        />
        {/* For Screen Only */}
        <Route path='/screen/welcome' element={<ScreenWelcomePage />} />
        <Route path='/screen/qrcode' element={<ScreenQRCodePage />} />
        <Route path='/screen/giving' element={<GivingScreen />} />
        <Route path='/screen/complete' element={<CompletionScreen />} />
      </Routes>
    </Router>
  );
}

export default App;