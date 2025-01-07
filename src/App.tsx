import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NongpanyaVending from './pages/form-page';
import LoginPage from './pages/login-page';
import ResultPage from './pages/result-page';
import LoadingPage from './pages/loading-page';
import ScreenWelcomePage from "./pages/screen/welcome";
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/form" element={<NongpanyaVending />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path='/loading' element={<LoadingPage />} />
        {/* For Screen Only */}
        <Route path='/screen/welcome' element={<ScreenWelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;