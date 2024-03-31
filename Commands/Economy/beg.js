const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economySchema = require("../../models/Economy/economySchema");
const {RandomNumber} = require('../../data/functions/ImportantFunctions')
require('mongoose');

module.exports = {
    cooldown: 18000,
    data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Try your luck you might get some money"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        let balanceProfile = await economySchema.findOne({
            userID: interaction.user.id
        }).clone();
        if(balanceProfile){
            let amount = RandomNumber(1, 25);
            let chance = RandomNumber(1, 10);
            if(chance >= 1 && chance <= 3){
                const array = [
                    "Fine take my money..",
                    "Take it, this is all I have",
                    "I hope thats enough",
                ];
                balanceProfile.wallet += amount
                await balanceProfile.save();
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({
                            name: client.user.username,
                            iconURL: client.user.avatarURL()
                        })
                        .setColor('Gold')
                        .setTitle(`You just got $${amount}`)
                        .setDescription(`${array[Math.floor(Math.random() * array.length)]}`)
                    ],
                    ephemeral: true
                })
            }
            else {
                const array = [
                    "I dont feel like it",
                    "Nope",
                    "If I had the money, I would help you.",
                    "Sorry buddy!",
                    "Maybe next time.."
                ];
                interaction.reply({
                    ephemeral: true,
                    content: `${array[Math.floor(Math.random() * array.length)]}`
                });
            }
        }
        else return interaction.reply({
            content: "You don't have an account yet! Use the register command to sign up.",
            ephemeral: true
        })
    }
}