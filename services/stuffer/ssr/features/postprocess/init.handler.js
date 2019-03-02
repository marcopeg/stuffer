/**
 * Hook to let extension to register new processors
 */

import { createHook } from '@marcopeg/hooks'
import { REGISTER_PROCESSORS } from './hooks'
import { registerProcessor } from './processors'

export const handler = () => {
    createHook(REGISTER_PROCESSORS, { args: {
        registerProcessor,
    } })
}
