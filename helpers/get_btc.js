const axios = require('axios')

module.exports = callback => {
    axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=USDT-BTC')
        .then(response => {
            const json = response.data

            const btc = Number(json.result[0].Last).toFixed(2)

            if (json.success) {
                callback(false, btc)
            } else {
                callback(true, null)
            }
        })
}