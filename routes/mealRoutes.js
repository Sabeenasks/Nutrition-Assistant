const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const { createMeal, getMeals, updateMeal, deleteMeal } = require('../controllers/mealController');
const router = express.Router();
const mealValidation = [
  body('name').notEmpty().withMessage('Meal name is required'),
  body('calories').isNumeric().withMessage('Calories must be numeric'),
  body('protein').isNumeric().withMessage('Protein must be numeric'),
  body('carbs').isNumeric().withMessage('Carbs must be numeric'),
  body('fats').isNumeric().withMessage('Fats must be numeric')
];

router.get('/', auth, getMeals);
router.post('/', auth, mealValidation, createMeal);
router.put('/:id', auth, mealValidation, updateMeal);
router.delete('/:id', auth, deleteMeal);

module.exports = router;
