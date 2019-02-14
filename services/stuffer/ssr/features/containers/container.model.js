import Sequelize from 'sequelize'
import { logError } from 'ssr/services/logger'

export const name = 'Container'

const fields = {
    host: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    cid: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
    },
    meta: {
        type: Sequelize.JSONB,
        allowNull: false,
    },
}

const options = {
    tableName: 'containers',
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
}

const bulkUpsert = (conn, Model) => records =>
    Promise.all(records.map(async record => {
        const query = [
            `INSERT INTO containers`,
            `( host, cid, name, meta, created_at, updated_at ) VALUES`,
            `( :host, :cid, :name, :meta, NOW(), NOW() )`,
            `ON CONFLICT (host, cid) DO UPDATE SET`,
            `meta = excluded.meta,`,
            'updated_at = NOW()',
        ].join(' ')

        const replacements = {
            host: record.host,
            cid: record.cid,
            name: record.name,
            meta: JSON.stringify(record.meta),
        }

        try {
            await conn.query(query, { replacements })
        } catch (err) {
            logError(err)
        }
    }))

export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    Model.bulkUpsert = bulkUpsert(conn, Model)
    return Model.sync()
}

export const reset = async (conn, Model) => {
    await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
}
