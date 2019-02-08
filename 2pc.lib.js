const makeClient2pc = (orm) => {
  return {
    prepare: async (action, ...args) => {
      const transaction = await sequelize.transaction({autocommit: false});
      await action(...args, { transaction });
      return transaction;
    },
    commit: async (transaction) => {
      await transaction.commit();
    }
  }
}

const makeClient2pc = (orm) => {
  return {
    prepare: async (action, ...args) => {
      const transaction = await sequelize.transaction({autocommit: false});
      await action(...args, { transaction });
      return transaction;
    },
    commit: async (transaction) => {
      await transaction.commit();
    }
  }
}

const makeServer2pc = (clients) => {
  return {
    prepare: () => {

    }
  }
}



class HttpClient2pc {
  constructor (http, orm, model) {

  }

  start() {
    http.post()
  }

  prepare () {

  }
}