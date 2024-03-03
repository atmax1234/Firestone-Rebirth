const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economySchema = require('../../models/Economy/economySchema')
const { goldCoin, success, fail } = require('../../data/resources/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("donate")
    .setDescription("Donate or Pay to someone")
    .addIntegerOption(option => option.setName("amount")
    .setDescription("Amount of Gold Coins you want to donate.")
    .setRequired(true))
    .addUserOption(option => option.setName("target")
    .setDescription('The user that you want to pay/donate to.')
    .setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const emoji = goldCoin;
        const amount = interaction.options.getInteger('amount');
        if(isNaN(amount)) {
            return interaction.reply({content: `${fail} Please provide a valid value for the amount tou want to give.`, ephemeral:true });
        }
        let target = interaction.options.getMember('target');
        let Profile = await economySchema.findOne({
            userID: interaction.user.id
        }).clone();
        if(Profile) {
            if(Profile.wallet < amount){
                return interaction.reply({
                    content: `${fail} Hmm.. You don't seem to have the required amount. Please check your balance.`,
                    ephemeral: true
                })
            }
            Profile.wallet -= parseInt(amount)
            await Profile.save()
        }
        else return interaction.reply({ content: `${fail} You don't have an account yet! Use the register command to sign up.`, ephemeral: true});
        let targetWallet = await economySchema.findOne({
            userID: target.id
        }).clone();
        if(targetWallet){
            targetWallet.wallet += parseInt(amount);
            await targetWallet.save()
        }
        else return interaction.reply({ content: `${fail} This user does not have an account yet!`, ephemeral: true});

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.avatarURL()
                })
                .setTitle('Transaction Successful')
                .setColor('Green')
                .setDescription(`${success} The transaction was successful\n**Receiver**: ${target.user.tag}\n**Sender**: ${interaction.user.tag}\n**Amount**: ${amount}${emoji}\n\nAt: ${new Date().toLocaleString('en-US')}`)
            ],
        });
    }
}