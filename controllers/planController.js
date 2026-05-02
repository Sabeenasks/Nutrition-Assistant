const { generatePlanWithAI } = require('../services/aiPlanService');

exports.generatePlan = async (req, res) => {
  const { weight, goal, mealsPerDay, totals, variationId } = req.body;

  if (!weight || Number(weight) < 25) {
    return res.status(400).json({ message: 'Weight must be at least 25 kg.' });
  }

  if (!mealsPerDay || Number(mealsPerDay) < 3 || Number(mealsPerDay) > 8) {
    return res.status(400).json({ message: 'Meals per day must be between 3 and 8.' });
  }

  if (!['weightloss', 'maintain', 'weightgain'].includes(goal)) {
    return res.status(400).json({ message: 'Invalid goal.' });
  }

  const plan = await generatePlanWithAI({
    weight: Number(weight),
    goal,
    mealsPerDay: Number(mealsPerDay),
    totals,
    variationId
  });

  return res.json(plan);
};
