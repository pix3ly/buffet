const getAlt = require('../helpers/get_alt')

module.exports = (config, request, respond) => {
    const currency = request.arguments[0].toUpperCase()

    getAlt(currency, (error, btc, usd) => {
        if (!error) {
            respond(currency + ' is currently ' + btc + ' BTC (' + usd + ' USD)')
        } else {
            respond('something went wrong')
        }
    })
}