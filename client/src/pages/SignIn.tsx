import logo from '/images/icons/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import './RegistrationLogin.css';
import { FormEvent, useState } from 'react';
import { User } from './Types.ts';
import { saveAuth } from '../lib/auth.ts';

type SignInProps = {
  setUser: (user: User | null) => void;
};

export function SignIn({ setUser }: SignInProps) {
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const formData = new FormData(event.currentTarget);
      const formEntries = Object.fromEntries(formData);

      // validation
      if (!formEntries) {
        setError('Please fill in all fields');
        return;
      }

      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEntries),
      });

      if (!res.ok) {
        throw new Error('Failed to sign in');
      }

      const data = await res.json();
      if (!data.user || !data.user.id) {
        throw new Error('Invalid user data received from server');
      }

      if (data.token) {
        saveAuth(data.user, data.token);
      }

      setUser(data.user);
      navigate('/app');
    } catch (err) {
      console.error('SignIn Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  const handleDemoLogin = async () => {
    setError('');

    const demoCredentials = {
      email: 'demo@mindbloom.com',
      password: 'MindBloomDemo',
    };

    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoCredentials),
      });

      if (!res.ok) {
        throw new Error('Failed to access demo account');
      }

      const data = await res.json();
      if (data.token) {
        saveAuth(data.user, data.token);
      }

      setUser(data.user);
      navigate('/app');
    } catch (err) {
      console.error('Demo Sign-In Error:', err);
      setError('Failed to access demo account. Please try again later.');
    }
  };

  return (
    <div className="reg-container">
      <div className="reg-col justify-center items-center">
        {/* Logo and title */}
        <div className="reg-col justify-center items-center">
          <img className="logo" src={logo} alt="logo" />
          <h1 className="text-3xl">MindBloom</h1>
        </div>

        <form
          className="reg-col justify-center items-center"
          onSubmit={handleLogin}>
          {/* Email and Password */}
          <div className="reg-col">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                className="text-black"
                type="email"
                name="email"
                id="email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                className="text-black"
                type="password"
                name="password"
                id="password"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Submit Button */}
          <div className="reg-row justify-center items-center mt-4">
            <button className="sign-in-button" type="submit">
              Sign In
            </button>
          </div>
        </form>

        {/* Create an account */}
        <div className="reg-row justify-center items-center mt-4">
          <p>
            Don't have an account?{' '}
            <Link
              to="/sign-up"
              className="cursor-pointer text-teal-600 hover:text-teal-500">
              Sign up now
            </Link>
          </p>
        </div>

        <div className="line" />
        <div className="reg-row justify-center items-center mt-4">
          <p
            className="cursor-pointer text-gray-300 hover:text-white"
            onClick={handleDemoLogin}>
            Try Demo Here!
          </p>
        </div>
      </div>
    </div>
  );
}
