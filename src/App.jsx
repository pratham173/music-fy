/**
 * Main App Component
 * Routing and global layout
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Study from './pages/Study';
import Upload from './pages/Upload';
import Results from './pages/Results';
import './styles/global.css';
import './styles/study.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/study" replace />} />
          <Route path="/study" element={<Study />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
