import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMeal, deleteMeal, getMeals, updateMeal } from '../services/api';

const emptyForm = { name: '', calories: '', protein: '', carbs: '', fats: '' };

export default function DashboardPage() {
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchMeals = async () => {
    try {
      const { data } = await getMeals();
      setMeals(data);
    } catch {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  useEffect(() => { fetchMeals(); }, []);

  const totals = useMemo(() => meals.reduce((acc, m) => {
    acc.calories += m.calories;
    acc.protein += m.protein;
    acc.carbs += m.carbs;
    acc.fats += m.fats;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 }), [meals]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats)
    };

    try {
      if (editId) {
        await updateMeal(editId, payload);
      } else {
        await createMeal(payload);
      }
      setForm(emptyForm);
      setEditId('');
      fetchMeals();
    } catch {
      setError('Unable to save meal');
    }
  };

  const onEdit = (meal) => {
    setEditId(meal._id);
    setForm({
      name: meal.name,
      calories: String(meal.calories),
      protein: String(meal.protein),
      carbs: String(meal.carbs),
      fats: String(meal.fats)
    });
  };

  const onDelete = async (id) => {
    await deleteMeal(id);
    fetchMeals();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <main className="dashboard">
      <header className="dash-header">
        <h1>Nutrition Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/ai-menu')}>AI Menu Generator</button>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="hero-strip">
        <img src="https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=1200&q=80" alt="Meal planning" />
      </section>

      <section className="grid">
        <article className="card">
          <h2>{editId ? 'Update Meal' : 'Add Meal'}</h2>
          <form onSubmit={onSubmit} className="meal-form">
            <input placeholder="Meal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="number" placeholder="Calories" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} required />
            <input type="number" placeholder="Protein" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} required />
            <input type="number" placeholder="Carbs" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} required />
            <input type="number" placeholder="Fats" value={form.fats} onChange={(e) => setForm({ ...form, fats: e.target.value })} required />
            {error && <small className="error">{error}</small>}
            <button type="submit">{editId ? 'Update' : 'Add'} Meal</button>
          </form>
        </article>

        <article className="card stats">
          <h2>Nutrition Totals</h2>
          <p>Calories: <strong>{totals.calories}</strong></p>
          <p>Protein: <strong>{totals.protein}g</strong></p>
          <p>Carbs: <strong>{totals.carbs}g</strong></p>
          <p>Fats: <strong>{totals.fats}g</strong></p>
        </article>
      </section>

      <section className="card table-card">
        <h2>Meal History</h2>
        <table>
          <thead>
            <tr><th>Meal</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fats</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id}>
                <td>{meal.name}</td>
                <td>{meal.calories}</td>
                <td>{meal.protein}</td>
                <td>{meal.carbs}</td>
                <td>{meal.fats}</td>
                <td className="actions">
                  <button onClick={() => onEdit(meal)}>Edit</button>
                  <button onClick={() => onDelete(meal._id)} className="danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
