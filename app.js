const config = require('./config')

const Discord = require('discord.js')
const axios = require('axios')

const client = new Discord.Client()

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
                        msg.reply(parts[1] + ' is currently ' + Number(json.result[0].Last * btcValue).toFixed(2) + ' USD')
                    }
                })
            } else {
                msg.reply('there\'s no currency with that name')
            }
        })
    }
})

client.login(config.token)
