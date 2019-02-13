/* eslint-disable */
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import MobilePage from '../MobilePage'

const wrapperStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontFamily: 'monospace',
}

const inputStyle = {
    textAlign: 'right',
    width: 40,
    border: '1px solid #666',
    borderRadius: 4,
    padding: '2px 5px',
}

/* emitter */
if (!window.__MobilePageGlobalThemeCallbacks) {
    window.__MobilePageGlobalThemeCallbacks = []
}

const setGlobalTheme = theme => {
    window.__MobilePageGlobalTheme = theme
    window.__MobilePageGlobalThemeCallbacks.forEach(cb => cb(theme))
}

const registerCmp = (cb) => {
    window.__MobilePageGlobalThemeCallbacks.push(cb)
}

const unregisterCmp = (cb) => {
    window.__MobilePageGlobalThemeCallbacks = window.__MobilePageGlobalThemeCallbacks.filter(i => i !== cb)
}
/* emitter */

class MobilePageComponentWrapper extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            theme: window.__MobilePageGlobalTheme || 'white',
        }
    }

    componentDidMount () {
        registerCmp(this.setInternalTheme)
    }

    componentWillUnmount () {
        unregisterCmp(this.setInternalTheme)
    }

    setInternalTheme = theme => {
        this.setState({ theme })
    }

    renderPage () {
        const page = (
            <MobilePage theme={this.state.theme}>
                <MobilePage.Body withPadding>
                    {this.props.children}
                </MobilePage.Body>
            </MobilePage>
        )

        return this.props.withRouter
            ? (
                <StaticRouter context={{}}>
                    {page}
                </StaticRouter>
            )
            : page
    }

    render () {
        return (
            <div>
                <div style={wrapperStyle}>
                    <div>{' '}</div>
                    <div>
                        {'theme: '}
                        <select
                            value={this.state.theme}
                            onChange={(e) => setGlobalTheme(e.target.value)}
                            style={{ ...inputStyle, width: 80 }}
                            dir="rtl"
                        >
                            <option value={'white'}>white</option>
                            <option value={'dark'}>dark</option>
                            <option value={'c1'}>c1</option>
                        </select>
                    </div>
                </div>
                <div style={{ border: '5px solid #ddd' }}>
                    {this.renderPage()}
                </div>
            </div>
        )
    }
}

export default MobilePageComponentWrapper
