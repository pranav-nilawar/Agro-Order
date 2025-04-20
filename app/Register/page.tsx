"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${apiUrl}/auth/register`, form);
      alert('Registered! Please login.');
      router.push('/Login');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        className="border p-2 mb-4 block w-full rounded"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        className="border p-2 mb-4 block w-full rounded"
      />
      <select
        name="role"
        onChange={handleChange}
        className="border p-2 mb-4 block w-full rounded"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Register
      </button>
    </div>
  );
}
