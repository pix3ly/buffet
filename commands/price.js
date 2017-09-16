const getPrice = require('../helpers/get_price')

module.exports = (config, request, respond) => {
    const currency = request.arguments[0].toUpperCase()

    getPrice(currency, (error, usd) => {
        if (!error) {
            respond(currency + ' is currently ' + usd + ' USD')
        } else {
            respond('there\'s no currency with that name')
        }
    })
}