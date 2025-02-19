const {REST} = require('@discordjs/rest');
const  {Routes} = require('discord-api-types/v10');
const {token} = require('../config.json');

const fs = require('node:fs');
const { version } = require('node:os');

const clientId = '1340284056977412097';
const guildId = '';

module.exports = (client) => {
    client.handleCommands = async (commandFolders , path) => {
        client.commandArray = [];
        for(folder of commandFolders){
            const commandFiles = fs.readdirSync(`${path}/${floder}`).filter(file => file.endsWith('.js'));
            for(const file of commandFiles){
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());

            }
        }

        const rest = new REST({
            version: '10'

        }).setToken('token');


        (async () => {
            try{
                console.log('Started regreshing application commands. ');
                await rest.put(
                    Routes.applicationCommand(clientId), {
                        body: client.commandArray
                    },
                );
                console.log('successfully doneeewss');
            }catch (error) {
                console.error(error);
            }
        });
    }
}