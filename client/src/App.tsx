import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
