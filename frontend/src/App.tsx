import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NongpanyaVending from './pages/form-page';
import LoginPage from './pages/login-page';
import ResultPage from './pages/result-page';
import LoadingPage from './pages/loading-page';
import ScreenWelcomePage from "./pages/screen/welcome";
import ScreenQRCodePage from "./pages/screen/qrcode-page";
import GivingScreen from "./pages/screen/giving-page";
import CompletionScreen from "./pages/screen/complete-page";
import './App.css';
import './index.css';
import Redirect from './pages/auth-redirect';
import authUser from './hooks/authUser';
import DashboardPage from './pages/dashboard-page';
import UserLogPage from './pages/user-log-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/form" element={authUser(<NongpanyaVending />)} />
        <Route path="/result" element={authUser(<ResultPage />)} />
        <Route path='/loading' element={<LoadingPage />} />
        <Route path='/auth' element={<Redirect />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/user-log' element={<UserLogPage />} />
        {/* For Screen Only */}
        <Route path='/screen/welcome' element={<ScreenWelcomePage />} />
        <Route path='/screen/qrcode' element={<ScreenQRCodePage />} />
        <Route path='/screen/giving' element={<GivingScreen />} />
        <Route path='/screen/complete' element={<CompletionScreen />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;