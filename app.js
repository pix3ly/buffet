const config = require('./config')

const Discord = require('discord.js')

const client = new Discord.Client()

client.on('message', msg => {
    if (msg.content === '.ping') {
        msg.reply('pong')
    }
})

client.login(config.token)