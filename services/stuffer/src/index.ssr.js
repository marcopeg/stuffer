import React from 'react'
import { Provider } from 'react-redux'
import { createSSRRender } from '@marcopeg/react-ssr/lib/create-ssr-render'
import { StaticRouter } from 'react-router-dom'
import { createState } from './app/state'
import App from './app/App'
import './app/locale'

const Root = ({ store, location, context, ...props }) => (
    <Provider store={store}>
        <StaticRouter location={location} context={context}>
            <App {...props} />
        </StaticRouter>
    </Provider>
)

export const staticRender = createSSRRender(Root, { createState })
