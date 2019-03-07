/**
 * Resize an image.
 * 
 * It takes desired width, height and resulting quality.
 * quality === "auto" -> 80
 * 
 * You can set width or height to "auto" to have a resize that
 * keeps the aspect ratio.
 * 
 * If you specify both width and height then you can pass a 4th
 * parameter "cover" or "contain" to set how you want to the boxing
 * done. "contain" is default.
 * 
 * {
 *   "resize":{
 *     "v1": [350, "auto", "auto"],
 *     "v2":["auto", 80, 60],
 *     "v3": [150, 150, 60],
 *     "v4": [150, 150, 60, "cover"]
 *   }
 * }
 */

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
            .then(tpl => {
                const w = size[0] === 'auto' ? Jimp.AUTO : Number(size[0])
                const h = size[1] === 'auto' ? Jimp.AUTO : Number(size[1])
                
                if (w === Jimp.AUTO || h === Jimp.AUTO) {
                    return tpl.resize(w, h)
                } else {
                    return size[3] === 'cover'
                        ? tpl.cover(w, h)
                        : tpl.contain(w, h)
                }
            })
            .then(tpl => tpl.quality(size[2] === 'auto' ? 80 : size[2]))
            .then(tpl => tpl.getBufferAsync(Jimp.AUTO))
    },
})
