"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password,
      });

      const { token, role } = response.data;

      // Save token + role in localStorage (or cookies, depending on your setup)
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      alert('Login successful!');
      router.push('/'); // or redirect to /order or /dashboard based on role
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="p-4 border mt-10">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        className="border p-2 mr-2"
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="border p-2 mr-2"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Login
      </button>
      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <a href="/Register" className="text-blue-600 underline">
          Register here
        </a>
      </p>
    </div>
  );
}
