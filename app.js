const config = require('./config')

const Discord = require('discord.js')
const axios = require('axios')

const client = new Discord.Client()

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

client.login(config.token)