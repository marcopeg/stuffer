import React from 'react'
import { LocaleProvider } from 'features/locale'
import AppHeader from './AppHeader'
import AppRoutes from './AppRoutes'
import '../lib/reset.css'
import './App.css'

export default () => (
    <LocaleProvider>
        <React.Fragment>
            <AppHeader />
            <AppRoutes />
        </React.Fragment>
    </LocaleProvider>
)
