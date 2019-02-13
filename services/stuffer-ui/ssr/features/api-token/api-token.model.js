import Sequelize from 'sequelize'
import { logError } from 'ssr/services/logger'

export const name = 'ApiToken'

const settings = {
    defaultToken: 'no', // populates a token record
}

const fields = {
    token: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
}

const options = {
    tableName: 'api_tokens',
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false,
    hooks: {
        afterSync: ({ sequelize }) => {
            if (settings.defaultToken === 'no') return

            const query = [
                `INSERT INTO api_tokens`,
                `(token, created_at)`,
                `VALUES ( :token, now() )`,
                `ON CONFLICT DO NOTHING`,
            ].join(' ')

            const replacements = {
                token: settings.defaultToken,
            }

            sequelize
                .query(query, { replacements })
                .catch(logError)
        },
    },
}

const validateToken = (conn, Model) => async token => {
    const record = await Model.findOne({
        where: { token },
        raw: true,
    })

    if (!record) {
        throw new Error('api token not found')
    }

    return true
}

export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    Model.validateToken = validateToken(conn, Model)
    return Model.sync()
}

export const reset = async (conn, Model) => {
    await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
}

export const setDefaultToken = token => {
    settings.defaultToken = token
}
