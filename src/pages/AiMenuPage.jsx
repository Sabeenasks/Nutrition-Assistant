import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAiPlan, getMeals } from '../services/api';

export default function AiMenuPage() {
  const [meals, setMeals] = useState([]);
  const [planInput, setPlanInput] = useState({ weight: '', mealsPerDay: 4, goal: 'maintain' });
  const [planResult, setPlanResult] = useState(null);
  const [planError, setPlanError] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMeals();
        setMeals(data);
      } catch {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    load();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.preference && ['weightloss', 'maintain', 'weightgain'].includes(user.preference)) {
      setPlanInput((prev) => ({ ...prev, goal: user.preference }));
    }
  }, []);

  const totals = useMemo(() => meals.reduce((acc, m) => {
    acc.calories += m.calories;
    acc.protein += m.protein;
    acc.carbs += m.carbs;
    acc.fats += m.fats;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 }), [meals]);

  const handleGoalChange = (goal) => {
    setPlanInput({ ...planInput, goal });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...user, preference: goal }));
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setPlanError('');
    if (!planInput.weight || Number(planInput.weight) < 25) {
      setPlanResult(null);
      setPlanError('Please enter a valid weight (minimum 25 kg).');
      return;
    }

    setIsGeneratingPlan(true);
    try {
      const payload = {
        weight: Number(planInput.weight),
        goal: planInput.goal,
        mealsPerDay: Number(planInput.mealsPerDay),
        totals,
        variationId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      };
      const { data } = await generateAiPlan(payload);
      setPlanResult(data);
    } catch {
      setPlanResult(null);
      setPlanError('Unable to generate AI menu right now.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <main className="dashboard ai-menu-page">
      <header className="dash-header">
        <h1>AI Menu Generator</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </header>

      <section className="card plan-card">
        <p className="plan-sub">Generate a personalized AI meal menu based on your goal and inputs.</p>
        <form className="plan-form" onSubmit={handleGeneratePlan}>
          <div className="plan-controls">
            <input
              type="number"
              min="25"
              placeholder="Weight (kg)"
              value={planInput.weight}
              onChange={(e) => setPlanInput({ ...planInput, weight: e.target.value })}
            />
            <select value={planInput.goal} onChange={(e) => handleGoalChange(e.target.value)}>
              <option value="weightloss">Weight Loss</option>
              <option value="maintain">Maintain Weight</option>
              <option value="weightgain">Weight Gain</option>
            </select>
            <input
              type="number"
              min="3"
              max="8"
              placeholder="Meals/day"
              value={planInput.mealsPerDay}
              onChange={(e) => setPlanInput({ ...planInput, mealsPerDay: e.target.value })}
            />
          </div>
          {planError && <small className="error">{planError}</small>}
          <button type="submit" className="plan-btn" disabled={isGeneratingPlan}>
            {isGeneratingPlan ? 'Generating AI Menu...' : 'Generate AI Menu'}
          </button>
        </form>

        {planResult && (
          <>
            <div className="plan-metrics">
              <p>Target Calories: <strong>{planResult.targetCalories} kcal/day</strong></p>
              <p>Protein: <strong>{planResult.protein}g</strong> | Carbs: <strong>{planResult.carbs}g</strong> | Fats: <strong>{planResult.fats}g</strong></p>
              <p>Per Meal ({planResult.mealsPerDay} meals): <strong>{planResult.caloriesPerMeal} kcal</strong></p>
            </div>

            <div className="plan-grid">
              <img src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1000&q=80" alt="AI generated meal planning" />
              <ul>
                {planResult.mealIdeas.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
