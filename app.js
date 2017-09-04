const config = require('./config')

const Discord = require('discord.js')
const axios = require('axios')

const client = new Discord.Client()

const priceCache = []

client.on('message', msg => {
    if (msg.content === '.ping') {
        msg.reply('pong')
    }

    const parts = msg.content.split(' ')

    if (parts[0] === '.price') {
        const coin = parts[1].toUpperCase()

        axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=BTC-' + coin).then((response) => {
            const json = response.data

            if (json.success) {
                const btcValue = json.result[0].Last

                axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=USDT-BTC').then((response) => {
                    const json = response.data

                    if (json.success) {
                        const currentPrice = Number(json.result[0].Last * btcValue).toFixed(2)
                        const oldPrice = priceCache[coin]

                        let response = coin + ' is currently ' + currentPrice + ' USD'

                        if (oldPrice) {
                            let emoji = ''

                            if (currentPrice > oldPrice) {
                                emoji += ' :chart_with_downwards_trend:'
                            } else if (currentPrice < oldPrice) {
                                emoji += ' :chart_with_upwards_trend:'
                            }

                            response += ' (was previously ' + oldPrice + ' USD' + emoji + ')'
                        }

                        priceCache[coin] = currentPrice

                        msg.reply(response)
                    }
                })
            } else {
                msg.reply('there\'s no currency with that name')
            }
        })
    }
})

client.login(config.token)
