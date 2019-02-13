import bodyParser from 'body-parser'

import { POSTGRES_BEFORE_START } from 'ssr/services/postgres/hooks'
import { EXPRESS_MIDDLEWARE } from 'ssr/services/express/hooks'
import { API_TOKEN_QUERIES } from 'ssr/features/api-token/hooks'
import { FEATURE_NAME } from './hooks'

import * as Metric from './metric.model'
import * as Log from './log.model'

import { trackMetrics } from './track-metrics.mutation'
import { trackLogs } from './track-logs.mutation'

export const register = ({ registerAction }) => {
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(Metric)
            options.models.push(Log)
        },
    })

    registerAction({
        hook: API_TOKEN_QUERIES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ queries, mutations }) => {
            mutations.trackMetrics = trackMetrics()
            mutations.trackLogs = trackLogs()
        },
    })

    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: async ({ app, settings }) => {
            app.use(bodyParser.json({
                limit: settings.jsonBodyLimit,
            }))
        },
    })
}
