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
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout showBugButton={false}><LoginPage /></Layout>} />
        <Route path="/home" element={authUser(<Layout><Homepage /></Layout>)} />
        <Route path="/form" element={authUser(<Layout><NongpanyaVending /></Layout>)} />
        <Route path="/result" element={authUser(<Layout><ResultPage /></Layout>)} />
        <Route path='/loading' element={authUser(<Layout><LoadingPage /></Layout>)} />
        <Route path='/auth' element={<Layout showBugButton={false}><Redirect /></Layout>} />
        <Route path='/unauthorized' element={<Layout><UnauthorizedPage /></Layout>} />
        {/* Role-based protected routes */}
        <Route 
          path='/dashboard' 
          element={roleBasedAuth(<Layout><DashboardPage /></Layout>, { 
            // requiredRole: 'admin',
            allowedRoles: ['admin', 'superadmin'],
            fallbackPath: '/unauthorized'
          })} 
        />
        <Route 
          path='/user-log' 
          element={roleBasedAuth(<Layout><UserLogPage /></Layout>, { 
            // requiredRole: 'admin',
            allowedRoles: ['admin', 'superadmin'],
            fallbackPath: '/unauthorized'
          })} 
        />
        {/* For Screen Only */}
        <Route path='/screen' element={<Layout showBugButton={false}><ScreenPinPage /></Layout>} />
        <Route path='/screen/pin' element={<Layout showBugButton={false}><ScreenPinPage /></Layout>} />
        <Route path='/screen/welcome' element={<ScreenAuth><Layout showBugButton={false}><ScreenWelcomePage /></Layout></ScreenAuth>} />
        <Route path='/screen/qrcode' element={<ScreenAuth><Layout showBugButton={false}><ScreenQRCodePage /></Layout></ScreenAuth>} />
        <Route path='/screen/giving' element={<ScreenAuth><Layout showBugButton={false}><GivingScreen /></Layout></ScreenAuth>} />
        <Route path='/screen/complete' element={<ScreenAuth><Layout showBugButton={false}><CompletionScreen /></Layout></ScreenAuth>} />
        {/* Fallback for 404 Not Found */}
        <Route path='*' element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;