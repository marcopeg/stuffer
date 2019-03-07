import Jimp from 'jimp'

const policies = [ 'bw', 'px', 'fancy', 'mysocial' ]

export default (settings) => ({
    // receives the upload field value and should be able to parse it
    // maybe some modifiers accept json or base64...
    parse: v => v,

    // value, req, res
    // should return true/false or raise an exception
    validate: (value, options) => {
        if (!policies.includes(value)) {
            throw new Error(`filter modifier: unknown policy "${value}"`)
        }

        if (!Object.values(options).includes(value)) {
            throw new Error(`filter modifier: policy "${value}" not allowed`)
        }

        return true
    },

    // should return a string that will be used to formulate a cache file name
    // for a list of modifierss
    cacheName: v => `jimp-filter-${v}`,

    handler: (buff, value) =>
        Jimp.read(buff)
            .then(tpl => {
                switch (value) {
                    case 'bw': return tpl.grayscale()
                    case 'fancy': return tpl.color([
                        { apply: 'hue', params: [-90] },
                        { apply: 'lighten', params: [50] },
                    ])
                    case 'mysocial': return tpl.color([
                        { apply: 'lighten', params: [10] },
                        { apply: 'blue', params: [150] },
                    ])
                    case 'px': return tpl.convolute([
                        [-2, -1, 0],
                        [-1, 1, 1],
                        [0, 1, 2],
                    ])
                }
            })
            .then(tpl => tpl.getBufferAsync(Jimp.AUTO))
    ,
})
