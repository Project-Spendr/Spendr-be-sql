const pool = require('../utils/pool');

module.exports = class Goals {
  id;
  title;
  goalAmount;
  currentAmount;
  privatestate;
  completed;
  dateCreated;
  userId;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.goalAmount = row.goal_amount;
    this.currentAmount = row.current_amount;
    this.privatestate = row.private_state;
    this.completed = row.completed;
    this.dateCreated = row.date_created;
    this.userId = row.user_id;
  }

  static async insert({ title, goalAmount, currentAmount, privatestate, completed, dateCreated, userId }) {
    const { rows } = await pool.query(
      'INSERT INTO goals (title, goal_amount, current_amount, private_state, completed, date_created, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, goalAmount, currentAmount, privatestate, completed, dateCreated, userId]
    );

    return new Goals(rows[0]);
  }

  static async update({ title, goalAmount, currentAmount, privatestate, completed, dateCreated, userId }) {
    const { rows } = await pool.query(
      'UPDATE goals SET title=$1, current_amount=0, completed=false, private_state=false WHERE id=1 RETURNING *',
      [text, id]
    );

    if (!rows[0]) throw new Error(`No tweet found for id ${id}`);

    return new Tweet(rows[0]);
  }

  static async delete(id, userId) {
    const { rows } = await pool.query(
      'DELETE FROM videos WHERE id=$1 AND user_id=$2 RETURNING *',
      [id, userId]
    );
  }
};