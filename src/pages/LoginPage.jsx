import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', preference: 'maintain' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await loginUser(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80" alt="Healthy food" />
        <h1>Welcome Back</h1>
        <p>Login to continue tracking your nutrition.</p>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select value={form.preference} onChange={(e) => setForm({ ...form, preference: e.target.value })}>
            <option value="weightloss">Weight Loss</option>
            <option value="maintain">Maintain Weight</option>
            <option value="weightgain">Weight Gain</option>
          </select>
          {error && <small className="error">{error}</small>}
          <button type="submit">Login</button>
        </form>
        <p className="switch">New user? <Link to="/register">Create account</Link></p>
      </div>
    </section>
  );
}
