import { POSTGRES_BEFORE_START } from 'ssr/services/postgres/hooks'
import { TRACK_METRICS_AFTER_CREATE } from 'ssr/features/data-ingest/hooks'
import { getModel } from 'ssr/services/postgres'
import { FEATURE_NAME } from './hooks'
import * as Container from './container.model'

export const register = ({ registerAction }) => {
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(Container)
        },
    })

    registerAction({
        hook: TRACK_METRICS_AFTER_CREATE,
        name: FEATURE_NAME,
        handler: async ({ records }) => {
            const record = records.find(r => r.metric === 'containers')
            if (!record) return

            const containers = Object.values(record.value)
                .map(container => ({
                    host: record.host,
                    cid: container.cid,
                    name: container.name,
                    meta: container,
                }))

            await getModel(Container.name).bulkUpsert(containers)
        },
    })
}
