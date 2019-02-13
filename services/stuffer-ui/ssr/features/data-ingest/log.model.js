import Sequelize from 'sequelize'

export const name = 'Log'

const fields = {
    ctime: {
        type: Sequelize.DATE,
    },
    host: {
        type: Sequelize.STRING,
    },
    container: {
        type: Sequelize.STRING,
    },
    message: {
        type: Sequelize.TEXT,
    },
    meta: {
        type: Sequelize.JSONB,
        allowNull: false,
    },
}

const options = {
    tableName: 'logs',
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        afterSync: ({ sequelize }) =>
            sequelize
                .query(`SELECT create_hypertable('logs', 'ctime')`)
                .catch(() => {})
        ,
    },
}

export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    return Model.sync()
}

export const reset = async (conn, Model) => {
    await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
}
