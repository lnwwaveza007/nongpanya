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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/form" element={<NongpanyaVending />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path='/loading' element={<LoadingPage />} />
        <Route path='/auth' element={<Redirect />} />
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