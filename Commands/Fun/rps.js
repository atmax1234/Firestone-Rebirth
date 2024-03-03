const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");
const RPS = require('discord-rock-paper-scissor');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Rock always wins")
    .addUserOption(option => option.setName("opponent")
    .setDescription( "The user you want to challenge.")
    .setRequired(false)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const rps = new RPS({
            choiceReply: "You chose {move}",
            endTitle: "Game over! The winner is {winner}",
            readyMessage: "Get ready for a game of Rock Paper Scissors!",
            drawEndTitle: "Imagine getting a draw..",
            drawEndDescription: "{player1} chose: {player1move}\n\n{player2} chose: {player2move}\nGood Game!",
            endDescription: "{winner} takes a big W\n\n{looser} takes the L"
        });
        const opponent = interaction.options.getUser("opponent");
        if (!opponent) rps.solo(interaction, client);
        else rps.duo(interaction, opponent);
    }
}