import Jimp from 'jimp'

export default (settings) => ({
    // receives the upload field value and should be able to parse it
    // maybe some modifiers accept json or base64...
    parse: v => v,

    // value, file, req, res
    // checks that the file meta informations are valid
    validate: (value, options) => {
        // there should be informations about allowed resize policies
        let sizes
        try {
            sizes = Object.keys(options)
        } catch (err) {
            throw new Error('resize modifier: no policy was found')
        }

        // the requested policy must exist
        if (!sizes.includes(value)) {
            throw new Error(`resize modifier: unknown policy "${value}"`)
        }

        return true
    },

    // should return a string that will be used to formulate a cache file name
    // for a list of modifierss
    cacheName: v => `jimp-resize-${v}`,

    handler: (buff, value, options) => {
        const size = options[value]
        return Jimp.read(buff)
            .then(tpl => tpl.cover(size[0], size[1]))
            .then(tpl => tpl.quality(size[2]))
            .then(tpl => tpl.getBufferAsync(Jimp.AUTO))
    },
})
