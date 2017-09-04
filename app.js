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
        axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=BTC-' + parts[1]).then((response) => {
            const json = response.data

            if (json.success) {
                const btcValue = json.result[0].Last

                axios.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=USDT-BTC').then((response) => {
                    const json = response.data

                    if (json.success) {
                        const currentPrice = Number(json.result[0].Last * btcValue).toFixed(2)
                        const oldPrice = priceCache[parts[1]]

                        let response = parts[1] + ' is currently ' + currentPrice + ' USD'

                        if (oldPrice) {
                            let emoji = ''

                            if (currentPrice > oldPrice) {
                                emoji += ' :rocket:'
                            } else if (currentPrice < oldPrice) {
                                emoji += ' :red_circle:'
                            }

                            response += ' (was previously ' + oldPrice + ' USD' + emoji + ')'
                        }

                        priceCache[parts[1]] = currentPrice

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
