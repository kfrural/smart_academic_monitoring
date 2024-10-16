const express = require('express');
const StudyData = require('../models/StudyData');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Adicionar dados de estudo
router.post('/', authMiddleware, async (req, res) => {
  const { studyHours, performanceScore } = req.body;

  try {
    const studyData = await StudyData.create(req.user.id, studyHours, performanceScore);
    res.status(201).json(studyData);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar dados de estudo' });
  }
});

// Obter dados de estudo do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const data = await StudyData.findByUserId(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter dados de estudo' });
  }
});

module.exports = router;
