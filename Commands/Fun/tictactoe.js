const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");
const simplydjs = require('simply-djs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play a game of Tic Tac Toe"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        simplydjs.tictactoe(interaction, {
            strict: true,
            type: 'Embed',
            buttons: {
                X: { style: ButtonStyle.Danger },
                O: { style: ButtonStyle.Success },
                blank: { style: ButtonStyle.Secondary }
              },
              embed: {
                game: {
                  color: simplydjs.toRgb("#406dbc")
                }
            }
        })
    }
}