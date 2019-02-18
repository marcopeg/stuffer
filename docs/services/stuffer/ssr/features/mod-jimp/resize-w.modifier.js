import Jimp from 'jimp'

export default (settings) => ({
    // receives the upload field value and should be able to parse it
    // maybe some modifiers accept json or base64...
    parse: v => v,

    // value, file, req, res
    // checks that the file meta informations are valid
    validate: (value, file) => {
        // there should be informations about allowed resize policies
        let sizes
        try {
            sizes = Object.keys(file.meta.data.resizeW)
        } catch (err) {
            throw new Error('resizeW modifier: no policy was found')
        }

        // the requested policy must exist
        if (!sizes.includes(value)) {
            throw new Error(`resizeW modifier: unknown policy "${value}"`)
        }

        return true
    },

    // should return a string that will be used to formulate a cache file name
    // for a list of modifierss
    cacheName: v => `jimp-resize-w-${v}`,

    handler: (buff, value, file) => {
        const size = Number(file.meta.data.resizeW[value])
        return Jimp.read(buff)
            .then(tpl => tpl.resize(size, Jimp.AUTO))
            .then(tpl => tpl.getBufferAsync(Jimp.AUTO))
    },
})
