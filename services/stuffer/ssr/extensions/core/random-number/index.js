exports.name = 'Random Number'
exports.register = ({ registerAction }) =>
    registerAction({
        hook: `◇ finish`,
        name: 'random-number--extension',
        handler: () => console.log(`# random number >> ${Math.random()}`),
    })
