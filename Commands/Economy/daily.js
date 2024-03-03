const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economySchema = require('../../models/Economy/economySchema');
const {RandomNumber} = require('../../data/functions/ImportantFunctions');
const ms = require('pretty-ms');
const {goldCoin} = require('../../data/resources/emojis.json')
require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Get your daily reward"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const emoji = goldCoin;
        const dailies = RandomNumber(2, 25)
        let balanceProfile = await economySchema.findOneAndUpdate({
            userID: interaction.user.id
        }).clone()
        if(balanceProfile){
            let timeout = 86400000
            if(timeout - (Date.now() - balanceProfile.daily) > 0){
                let timeleft = ms(timeout - (Date.now() - balanceProfile.daily), {verbose: true})
                return interaction.reply({content: `You already claimed your reward for today!\nEstimated time: \`${timeleft}\``, ephemeral: true})
            }
            balanceProfile.daily = Date.now();
            const money = balanceProfile.wallet + dailies
            const embed = new EmbedBuilder()
            .setTitle('Here\'s your reward for today')
            .setColor('Green')
            .setDescription(`You\'ve just got ${dailies}${emoji}\n You now have: ${money}${emoji}\n Congrats on that crazy amount!`)
            balanceProfile.wallet = money
            await balanceProfile.save().catch((err) => {
                console.log(err);
            })
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
        else return interaction.reply({
            content: "You don't have an account yet! Use the register command to sign up.",
            ephemeral: true
        })
    }
}