import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', preference: 'maintain' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await registerUser(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80" alt="Healthy bowl" />
        <h1>Create Account</h1>
        <p>Start your nutrition journey today.</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password (min 6)" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select value={form.preference} onChange={(e) => setForm({ ...form, preference: e.target.value })}>
            <option value="weightloss">Weight Loss</option>
            <option value="maintain">Maintain Weight</option>
            <option value="weightgain">Weight Gain</option>
          </select>
          {error && <small className="error">{error}</small>}
          <button type="submit">Register</button>
        </form>
        <p className="switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </section>
  );
}
