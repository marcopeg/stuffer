import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

const mapState = ({ app, locale }) => ({
    title: app.title,
    lang: locale.locale,
})

const Head = ({ title, lang }) => (
    <Helmet
        title={title}
        htmlAttributes={{ lang }}
    />
)

Head.propTypes = {
    title: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
}

export default connect(mapState)(Head)
