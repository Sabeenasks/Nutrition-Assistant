const express = require('express');
const auth = require('../middleware/authMiddleware');
const { generatePlan } = require('../controllers/planController');

const router = express.Router();

router.post('/generate', auth, generatePlan);

module.exports = router;
