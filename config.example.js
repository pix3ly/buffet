module.exports = {
    token: '',
    alerts: {
        channel: '',
        margin: 2
    },
    commands: {
        ping: require('./commands/ping'),
        price: require('./commands/price')
    }
}
