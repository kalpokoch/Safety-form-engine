import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import RendererPage from './pages/RendererPage';
import FormRenderer from './components/FormRenderer/FormRenderer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/renderer" element={<RendererPage />} />
          <Route path="/renderer/:formId" element={<FormRenderer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
