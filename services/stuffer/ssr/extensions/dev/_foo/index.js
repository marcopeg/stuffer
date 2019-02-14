exports.register = ({ registerAction }) =>
    registerAction({
        hook: `◇ finish`,
        name: 'foo--extension',
        handler: () => console.log(`# foo (dev) >> ${Math.random()}`),
    })
