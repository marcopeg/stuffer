import { POSTGRES_BEFORE_START } from 'ssr/services/postgres/hooks'
import { EXPRESS_GRAPHQL } from 'ssr/services/express/hooks'

import * as ApiToken from './api-token.model'
import { initApiToken } from './api-token.graphql'
import { FEATURE_NAME } from './hooks'

export const register = ({ registerAction, settings }) => {
    // forward static settings to the model
    ApiToken.setDefaultToken(settings.apiToken.defaultToken)

    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: FEATURE_NAME,
        handler: ({ options }) => {
            options.models.push(ApiToken)
        },
    })

    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: FEATURE_NAME,
        trace: __filename,
        handler: initApiToken,
    })
}
