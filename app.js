const config = require('./config')

const Discord = require('discord.js')
const axios = require('axios')

const client = new Discord.Client()

const trackingHistory = []
const trackingCoins = ['ETH', 'MTL', 'GNT']

function getPrice(currency, callback) {
    axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=BTC-' + currency)
        .then((response) => {
            const json = response.data

            if (json.success) {
                const btcPrice = json.result[0].Last

                axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=USDT-BTC')
                    .then((response) => {
                        const json = response.data

                        const usdPrice = Number(json.result[0].Last * btcPrice).toFixed(2)

                        callback(false, usdPrice)
                    })
            } else {
                callback(true, null)
            }
        })
}

client.on('message', msg => {
    if (msg.content === '.ping') {
        msg.reply('pong')
    }

    const parts = msg.content.split(' ')

    if (parts[0] === '.price') {
        const currency = parts[1].toUpperCase()

        getPrice(currency, (error, usd) => {
            if (!error) {
                msg.reply(currency + ' is currently ' + usd + ' USD');
            } else {
                msg.reply('there\'s no currency with that name')
            }
        })
    }
})

setInterval(() => {
    trackingCoins.forEach((coin) => {
        getPrice(coin, (error, usd) => {
            if (!error) {
                if (trackingHistory[coin] > usd) {
                    const percentage = Number(trackingHistory[coin] / usd * 100).toFixed(1) - 100

                    if (percentage >= 5) {
                        client.channels.get(config.alertsChannel).sendMessage(coin + ' is going up by ' + percentage + '%')
                    }
                } else if (trackingHistory[coin] < usd) {
                    const percentage = Number(usd / trackingHistory[coin] * 100).toFixed(1) - 100

                    if (percentage >= 5) {
                        client.channels.get(config.alertsChannel).sendMessage(coin + ' is going down by ' + percentage + '%')
                    }
                }

                trackingHistory[coin] = usd
            }
        })
    })
}, 1000 * 60 * 5)

client.login(config.token)
