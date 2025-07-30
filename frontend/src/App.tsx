import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NongpanyaVending from './pages/form-page';
import LoginPage from './pages/login-page';
import ResultPage from './pages/result-page';
import LoadingPage from './pages/loading-page';
import ScreenWelcomePage from "./pages/screen/welcome";
import ScreenQRCodePage from "./pages/screen/qrcode-page";
import ScreenPinPage from "./pages/screen/pin-page";
import GivingScreen from "./pages/screen/giving-page";
import CompletionScreen from "./pages/screen/complete-page";
import UnauthorizedPage from './pages/unauthorized-page';
import Homepage from './pages/home-page';
import './App.css';
import './index.css';
import Redirect from './pages/auth-redirect';
import authUser from './hooks/authUser';
import roleBasedAuth from './hooks/roleBasedAuth';
import ScreenAuth from './hooks/screenAuth';
import DashboardPage from './pages/dashboard-page';
import UserLogPage from './pages/user-log-page';
import NotFoundPage from './pages/not-found-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={authUser(<Homepage />)} />
        <Route path="/form" element={authUser(<NongpanyaVending />)} />
        <Route path="/result" element={authUser(<ResultPage />)} />
        <Route path='/loading' element={authUser(<LoadingPage />)} />
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
        <Route path='/screen' element={<ScreenPinPage />} />
        <Route path='/screen/pin' element={<ScreenPinPage />} />
        <Route path='/screen/welcome' element={<ScreenAuth><ScreenWelcomePage /></ScreenAuth>} />
        <Route path='/screen/qrcode' element={<ScreenAuth><ScreenQRCodePage /></ScreenAuth>} />
        <Route path='/screen/giving' element={<ScreenAuth><GivingScreen /></ScreenAuth>} />
        <Route path='/screen/complete' element={<ScreenAuth><CompletionScreen /></ScreenAuth>} />
        {/* Fallback for 404 Not Found */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;