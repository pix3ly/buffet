const axios = require('axios')

module.exports = (currency, callback) => {
    axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=BTC-' + currency)
        .then(response => {
            const json = response.data

            if (json.success) {
                const btcPrice = json.result[0].Last

                axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=USDT-BTC')
                    .then(response => {
                        const json = response.data

                        const usdPrice = Number(json.result[0].Last * btcPrice).toFixed(2)

                        callback(false, usdPrice)
                    })
            } else {
                callback(true, null)
            }
        })
}