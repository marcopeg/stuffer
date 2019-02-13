import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql'

import { createHook } from '@marcopeg/hooks'
import { getModel } from 'ssr/services/postgres'
import { name as ApiToken } from './api-token.model'
import { API_TOKEN_QUERIES } from './hooks'

export const initApiToken = async ({ queries, mutations }) => {
    const apiQueries = {}
    const apiMutations = {}

    const queryPrototype = {
        description: 'Enable test apis protected by a token',
        args: {
            token: {
                type: new GraphQLNonNull(GraphQLString),
            },
        },
        resolve: (params, args) =>
            getModel(ApiToken).validateToken(args.token),
    }

    const defaultQueries = {
        enabled: {
            type: GraphQLBoolean,
            resolve: () => true,
        },
    }

    await createHook(API_TOKEN_QUERIES, {
        async: 'serie',
        args: {
            queries: apiQueries,
            mutations: apiMutations,
        },
    })

    queries.api = {
        ...queryPrototype,
        type: new GraphQLObjectType({
            name: 'ApiQuery',
            fields: {
                ...apiQueries,
                ...defaultQueries,
            },
        }),
    }

    mutations.api = {
        ...queryPrototype,
        type: new GraphQLObjectType({
            name: 'ApiMutation',
            fields: {
                ...apiMutations,
                ...defaultQueries,
            },
        }),
    }
}
