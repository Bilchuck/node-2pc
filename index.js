const Sequelize = require('sequelize');

const sequelize = new Sequelize('new', 'root', 'secret', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.sync()
  .then(() => start())
  .then(jane => {
    console.log(jane.toJSON());
  });


const start = async () => {
  try {
    const t = await sequelize.transaction({autocommit: false});
    const res = await sequelize.query(`
      INSERT INTO test (id,value) VALUES (4,4)
    `, { transaction: t });
    console.log(res);
    await t.commit();
    console.log(t);
  } catch (error) {
    console.error(error);
  }
}