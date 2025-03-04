import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Dashboard } from './pages/Dashboard';
import { Challenges } from './pages/Challenges';
import { Profile } from './pages/Profile';
import { TimeChallenge } from './pages/TimeChallenge';
import { CalendarView } from './pages/CalendarView';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

export default function App() {
  return (
    <Routes>
      <Route index element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="time-challenge" element={<TimeChallenge />} />

      <Route path="/app" element={<NavBar />}>
        <Route index element={<Dashboard />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="profile" element={<Profile />} />
        <Route path="calendar" element={<CalendarView />} />
      </Route>
    </Routes>
  );
}
