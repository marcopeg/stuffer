import Jimp from 'jimp'

const policies = [ 'bw', 'fancy' ]

export default (settings) => ({
    // receives the upload field value and should be able to parse it
    // maybe some modifiers accept json or base64...
    parse: v => v,

    // value, req, res
    // should return true/false or raise an exception
    validate: (value) => {
        if (!policies.includes(value)) {
            throw new Error(`filter modifier: unknown policy "${value}"`)
        }

        return true
    },

    // should return a string that will be used to formulate a cache file name
    // for a list of modifierss
    cacheName: v => `filter-${v}`,

    handler: (buff, policy) =>
        Jimp.read(buff)
            .then(tpl => {
                switch (policy) {
                    case 'bw': return tpl.grayscale()
                    case 'fancy': return tpl.color([
                        { apply: 'hue', params: [-90] },
                        { apply: 'lighten', params: [50] },
                        { apply: 'xor', params: ['#06D'] },
                    ])
                }
            })
            .then(tpl => tpl.getBufferAsync(Jimp.AUTO))
    ,
})
