import createSSRState from '@marcopeg/react-ssr/lib/create-ssr-state'

const features = [
    require('features/storage'),
    require('features/network'),
    require('features/locale'),
]

const app = (state = {
    title: 'STUFFER',
}) => state

export const createState = createSSRState({ app }, features)
