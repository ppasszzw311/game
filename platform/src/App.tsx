import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MainMenu } from './pages/MainMenu';
import { TeamManagement } from './pages/TeamManagement';
import { MatchPage } from './pages/MatchPage';
import { SeasonDashboard } from './pages/SeasonDashboard';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/season" element={<SeasonDashboard />} />
          <Route path="/settings" element={<div className="text-center text-2xl mt-10">Settings Coming Soon</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
