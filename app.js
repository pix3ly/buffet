const config = require('./config')

const Discord = require('discord.js')
const axios = require('axios')

const client = new Discord.Client()

const cache = []
const tracking = []

tracking['ETH'] = {}
tracking['GNT'] = {}
tracking['MTL'] = {}
tracking['NEO'] = {}

client.on('message', msg => {
    const startingCharacter = msg.content.substr(0, 1)

    if (startingCharacter === '.') {
        const parts = msg.content.split(' ')

        const command = parts[0].substr(1)

        if (config.commands[command]) {
            parts.shift()

            const request = {
                arguments: parts
            }

            config.commands[command](config, request, response => {
                msg.reply(response)
            })
        }
    }
})

const getPrice = require('./helpers/get_price')

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
