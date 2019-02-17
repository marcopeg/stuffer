import Jimp from 'jimp'

export const handler = (settings = {}) => ({ modifiers }) => {
    modifiers.size = {
        // receives the upload field value and should be able to parse it
        // maybe some modifiers accept json or base64...
        parse: v => v,

        // value, req, res
        // should return true/false or raise an exception
        validate: () => true,

        // should return a string that will be used to formulate a cache file name
        // for a list of modifierss
        cacheName: v => `size-${v}`,

        handler: buff => Jimp.read(buff)
            .then(tpl => tpl.cover(80, 80))
            .then(tpl => tpl.getBufferAsync(Jimp.MIME_JPEG)),
    }

    modifiers.filter = {
        // receives the upload field value and should be able to parse it
        // maybe some modifiers accept json or base64...
        parse: v => v,

        // value, req, res
        // should return true/false or raise an exception
        validate: () => true,

        // should return a string that will be used to formulate a cache file name
        // for a list of modifierss
        cacheName: v => `size-${v}`,

        handler: buff => Jimp.read(buff)
            .then(tpl => tpl.grayscale())
            .then(tpl => tpl.getBufferAsync(Jimp.MIME_JPEG)),
    }
}
