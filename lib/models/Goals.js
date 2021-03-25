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

  static async update(id, { title, goalAmount, currentAmount, privatestate, completed, userId }) {
    console.log(id)
    const { rows } = await pool.query(
      'UPDATE goals SET title=$1, goal_amount=$2, current_amount=$3, private_state=$4, completed=$5 WHERE id=$6 AND user_id =$7 RETURNING *',
      [title, goalAmount, currentAmount, privatestate, completed, id, userId]
    );

    if (!rows[0]) throw new Error(`No goal found for id ${id}`);
    return new Goals(rows[0]);
  }

  static async find({ userId }) {
    const { rows } = await pool.query(
      'select * from goals where user_id=$1',
      [userId]
    );

    if (!rows[0]) throw new Error(`No goal found for id ${id}`);
    return rows.map(row => new Goals(row));
  }


  static async findOneGoal(id, { userId }) {

    const { rows } = await pool.query(
      'select * from goals where user_id=$1 AND id=$2',
      [userId, id]
    );

    if (!rows[0]) throw new Error(`No goal found for id ${id}`);
    return new Goals(rows[0]);
  }

  static async findAllPublicGoals() {
    const { rows } = await pool.query(
      'select * from goals where private_state=false'
    );
    return rows.map(row => new Goals(row));
  }

  static async delete(id, userId) {
    const { rows } = await pool.query(
      'DELETE FROM goals WHERE id=$1 AND user_id=$2 RETURNING *',
      [id, userId]
    );
  }
};