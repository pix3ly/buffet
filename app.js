const config = require('./config')

const Discord = require('discord.js')
const axios = require('axios')

const client = new Discord.Client()

const tracking = []

tracking['ETH'] = {}
tracking['GNT'] = {}
tracking['MTL'] = {}
tracking['NEO'] = {}

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

function track() {
    for (const key in tracking) {
        const value = tracking[key]

        getPrice(key, (error, usd) => {
            if (!error) {
                if (value.price) {
                    let change = Number((usd - value.price) / value.price * 100).toFixed(1)

                    let broadcast = false

                    if (change >= config.alerts.margin) {
                        broadcast = key + ' is going up by ' + change + '%'
                    } else if (change <= -config.alerts.margin) {
                        broadcast = key + ' is going down by ' + change + '%'
                    }

                    if (broadcast) {
                        client.channels.get(config.alerts.channel).sendMessage(broadcast)
                    }
                }

                tracking[key].price = usd
            }
        })
    }
}

client.login(config.token)

track()
setInterval(track, 1000 * 60 * 5)
