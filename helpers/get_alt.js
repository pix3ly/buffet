const getBtc = require('./get_btc')

const axios = require('axios')

module.exports = (currency, callback) => {
    axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=BTC-' + currency)
        .then(response => {
            const json = response.data

            const altBtc = Number(json.result[0].Last).toFixed(5)

            getBtc((error, btc) => {
                const usd = Number(altBtc * btc).toFixed(2)

                callback(false, altBtc, usd)
            })
        })
}