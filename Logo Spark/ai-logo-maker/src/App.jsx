import LandingPage from './LandingPage'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogoMaker from './LogoMaker';
import Documentation from './Documentation';
import Pricing from './Pricing';
import LogoIdeas from './LogoIdeas';
import Blog from './Blog';
import Article from './Article';
import LoginRegister from './LoginRegister';
import Dashboard from './Dashboard';
import SavedLogos from './SavedLogos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/logo-maker" element={<LogoMaker />} />
        <Route path="/documentation" element={<Documentation />} /> 
        <Route path="/pricing" element={<Pricing />} /> 
        <Route path="/logo-ideas" element={<LogoIdeas />} /> 
        <Route path="/blog" element={<Blog />} /> 
        <Route path="/blog/article/:slug" element={<Article />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/saved-logos" element={<SavedLogos />} />
      </Routes>
    </Router>
  )
}

export default App
