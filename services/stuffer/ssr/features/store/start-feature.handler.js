/**
 * Implement the extension point for customizing file resolvers
 *
 */

import { createHook } from '@marcopeg/hooks'
import { STORE_SET_RESOLVER } from './hooks'
import { setMetaResolver, setFileResolver } from './resolvers'

export const startFeatureHandler = () =>
    createHook(STORE_SET_RESOLVER, {
        args: {
            setMetaResolver,
            setFileResolver,
        },
    })