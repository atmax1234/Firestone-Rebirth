const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economySchema = require("../../models/Economy/economySchema");
const emojis = require('../../data/resources/emojis.json')
require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your/another person\'s balance")
    .addUserOption(option => 
        option.setName('user')
    .setDescription('The user you want to check the balance of')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const titleEmoji = emojis.economy.Rich;
        const descriptionEmoji = emojis.economy.goldCoin;
        const userID = interaction.options.getUser("user") || interaction.user;
        let balanceProfile = await economySchema.findOne({ userID: userID.id })
        if (balanceProfile) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                .setAuthor({
                    name: `${userID.username}`,
                    iconURL: userID.avatarURL({
                        dynamic: true
                    })
                })
                .setFooter({
                    text: `Developed by aTmAx ©`
                })
                .setTitle(`${userID.username}'s Balance ${titleEmoji}`)
                .setDescription(`${userID.id == interaction.user.id ? `Your Balance: ${balanceProfile.wallet}${descriptionEmoji}` : `${userID.username}'s Balance: ${balanceProfile.wallet}${descriptionEmoji}`}`)
                .setColor('Green')
            ],  ephemeral: true
            })
        }
        else {
            return userID.id == interaction.user.id ? interaction.reply({
                content: "You don't have an account yet! Use the register command to sign up.", ephemeral: true
            }) : interaction.reply({ content: "This user doesn't have an account!", ephemeral: true });
        }
    },
};