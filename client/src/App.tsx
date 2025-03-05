import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Dashboard } from './pages/Dashboard';
import { Challenges } from './pages/Challenges';
import { Profile } from './pages/Profile';
import { TimeChallenge } from './pages/TimeChallenge';
import { CalendarView } from './pages/CalendarView';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { useState } from 'react';
import { User } from './pages/Types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Routes>
      <Route index element={<SignIn setUser={setUser} />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="time-challenge" element={<TimeChallenge user={user} />} />

      <Route path="/app" element={<NavBar />}>
        <Route index element={<Dashboard user={user} />} />
        <Route path="challenges" element={<Challenges user={user} />} />
        <Route path="profile" element={<Profile />} />
        <Route path="calendar" element={<CalendarView user={user} />} />
      </Route>
    </Routes>
  );
}
