const db = require('../config/db');

const StudyData = {
  create: async (userId, studyHours, performanceScore) => {
    const result = await db.query(
      'INSERT INTO study_data (user_id, study_hours, performance_score) VALUES ($1, $2, $3) RETURNING *',
      [userId, studyHours, performanceScore]
    );
    return result.rows[0];
  },

  findByUserId: async (userId) => {
    const result = await db.query('SELECT * FROM study_data WHERE user_id = $1 ORDER BY date DESC', [userId]);
    return result.rows;
  }
};

module.exports = StudyData;
