import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Dashboard } from './pages/Dashboard';
import { Challenges } from './pages/Challenges';
import { Profile } from './pages/Profile';
import { TimeChallenge } from './components/TimeChallenge';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Dashboard />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/time-challenge" element={<TimeChallenge />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
