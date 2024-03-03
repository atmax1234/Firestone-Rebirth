const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economySchema = require("../../models/Economy/economySchema");
const {goldCoin, Rich} = require('../../data/resources/emojis.json')
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
        const titleEmoji = Rich;
        const descriptionEmoji = goldCoin;
        const userID = interaction.options.getMember("user") || interaction.user;
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
            ]
            })
        }
        else {
            return userID.id == interaction.user.id ? interaction.reply({
                content: "You don't have an account yet! Use the register command to sign up."
            }) : interaction.reply({ content: "This user doesn't have an account!" });
        }
    },
};