import loadable from 'react-loadable'

export const reducers = {}
export const services = []
export const listeners = []

const Loading = () => null

export const HomePage = loadable({
    loader: () => import(/* webpackChunkName: "HomePage" */ './screens/HomePage'),
    loading: Loading,
})
