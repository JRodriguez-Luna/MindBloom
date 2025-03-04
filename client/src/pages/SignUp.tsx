import logo from '/images/icons/logo.svg';
import './RegistrationLogin.css';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function SignUp() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(event.currentTarget);
      const firstName = formData.get('firstName')?.toString().trim() || '';
      const lastName = formData.get('lastName')?.toString().trim() || '';
      const email = formData.get('email')?.toString().trim() || '';
      const password = formData.get('password')?.toString() || '';
      const confirmPassword = formData.get('confirmPassword')?.toString() || '';

      // Validation
      if (!firstName || !lastName || !email || !password) {
        setError('Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('SignUp Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    }
  };

  return (
    <div className="reg-container" id="sign-up">
      <div className="reg-col justify-center items-center">
        {/* Logo and title */}
        <div className="reg-col justify-center items-center">
          <img className="logo" src={logo} alt="logo" />
          <h1 className="text-3xl">MindBloom</h1>
        </div>

        <form
          className="reg-col justify-center items-center padding-bottom"
          onSubmit={handleSignUp}>
          <div className="reg-col">
            {/* First Name */}
            <div className="input-group">
              <label htmlFor="firstName" className="sr-only">
                First name
              </label>
              <input
                className="text-black"
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First name"
                required
              />
            </div>

            {/* Last Name */}
            <div className="input-group">
              <label htmlFor="lastName" className="sr-only">
                Last name
              </label>
              <input
                className="text-black"
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last name"
                required
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <label htmlFor="sign-up-email" className="sr-only">
                Email
              </label>
              <input
                className="text-black"
                type="email"
                name="email"
                id="sign-up-email"
                placeholder="Email"
                required
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="sign-up-password" className="sr-only">
                Password
              </label>
              <input
                className="text-black"
                type="password"
                name="password"
                id="sign-up-password"
                placeholder="Password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label htmlFor="sign-up-confirm-password" className="sr-only">
                Confirm password
              </label>
              <input
                className="text-black"
                type="password"
                name="confirmPassword"
                id="sign-up-confirm-password"
                placeholder="Confirm password"
                required
              />
            </div>

            {/* Messages */}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}

            {/* Submit Button - MOVED INSIDE FORM */}
            <div className="reg-row justify-center items-center mt-4">
              <button className="sign-in-button" type="submit">
                Sign up
              </button>
            </div>
          </div>
        </form>

        {/* Existing account */}
        <div className="reg-row justify-center items-center mt-4">
          <p>
            Already have an account?{' '}
            <Link
              to="/sign-in"
              className="cursor-pointer text-teal-600 hover:text-teal-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
