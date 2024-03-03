const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require('moment');
const economySchema = require('../../models/Economy/economySchema')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Sign Up in our economy system."),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const econ = await economySchema.findOne({
            userID: interaction.user.id
        }).clone();
        if(econ) return interaction.reply({
            content: `You are already registered!\nDate Registered: \`${moment(econ.createdAt).fromNow()}\``,
            ephemeral: true
        })
        else {
            new economySchema({
                guildID: interaction.guildId,
                userID: interaction.user.id,
                createdAt: (Date.now() * 1000) / 1000,
                wallet: + 250
            }).save()
            const registered = new EmbedBuilder()
            .setTitle('Registered Successfully!')
            .setDescription(`\`${interaction.user.username}\`, you have been registered to the economy system at \`${moment((Date.now() * 1000) / 1000).fromNow()}\`.`)
            .setColor('Random')
            .setTimestamp()
            interaction.reply({
                embeds: [registered],
                ephemeral: true
            })
        }
    }
}