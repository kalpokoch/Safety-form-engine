import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/shared/Sidebar';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import RendererPage from './pages/RendererPage';
import FormRenderer from './components/FormRenderer/FormRenderer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 overflow-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/renderer" element={<RendererPage />} />
            <Route path="/renderer/:formId" element={<FormRenderer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
