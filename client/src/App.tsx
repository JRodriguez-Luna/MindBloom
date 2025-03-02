import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Dashboard } from './pages/Dashboard';
import { Challenges } from './pages/Challenges';
import { Profile } from './pages/Profile';
import { TimeChallenge } from './pages/TimeChallenge';
import { CalendarView } from './pages/CalendarView';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Dashboard />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Route>
      <Route path="/time-challenge" element={<TimeChallenge />} />
    </Routes>
  );
}
