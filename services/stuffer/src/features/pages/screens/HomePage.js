import React from 'react'
import { injectIntl, intlShape, defineMessages } from 'react-intl'
import MobilePage, {
    Title,
    Text,
    mixins,
} from 'components/MobilePage'

const messages = defineMessages({
    title: {
        id: 'pages.HomePage.title',
        defaultMessage: 'STUFFER',
    },
    text: {
        id: 'pages.HomePage.text',
        defaultMessage: 'dump your files here and retrieve it in some smart ways',
    },
})

const styles = {
    wrapper: {
        ...mixins.flexCenteredTop,
        flex: 1,
        flexDirection: 'column',
    },
    inner: {
        ...mixins.flexCentered,
        flexDirection: 'column',
        width: '70%',
        maxWidth: 350,
        marginTop: '20vh',
    },
}

const HomePage = ({ intl }) => (
    <MobilePage>
        <MobilePage.Body noScroll withPadding flex>
            <div style={styles.wrapper}>
                <div style={styles.inner}>
                    <Title>
                        {intl.formatMessage(messages.title)}
                    </Title>
                    <Text>
                        {intl.formatMessage(messages.text)}
                    </Text>
                </div>
            </div>
        </MobilePage.Body>
    </MobilePage>
)

HomePage.propTypes = {
    intl: intlShape.isRequired,
}

export default injectIntl(HomePage)
