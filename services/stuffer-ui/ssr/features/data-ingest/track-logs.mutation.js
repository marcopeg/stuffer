import { logError } from 'ssr/services/logger'

import {
    GraphQLNonNull,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { getModel } from 'ssr/services/postgres'
import { name as Log } from './log.model'

export const trackLogs = () => ({
    description: 'TrackLogsMutation',
    args: {
        data: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLInputObjectType({
                name: 'LogRecord',
                fields: {
                    host: {
                        type: new GraphQLNonNull(GraphQLString),
                    },
                    container: {
                        type: new GraphQLNonNull(GraphQLString),
                    },
                    message: {
                        type: new GraphQLNonNull(GraphQLString),
                    },
                    meta: {
                        type: GraphQLJSON,
                    },
                    ctime: {
                        type: GraphQLDateTime,
                    },
                },
            }))),
        },
    },
    type: GraphQLBoolean,
    resolve: async (params, args) => {
        try {
            await getModel(Log).bulkCreate(args.data.map(record => ({
                ...record,
                ctime: record.ctime || new Date(),
                meta: record.meta || {},
            })))
            return true
        } catch (err) {
            logError(err)
        }
    },
})
