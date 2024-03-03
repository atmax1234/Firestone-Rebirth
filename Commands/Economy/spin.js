const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economySchema = require('../../models/Economy/economySchema')
const emotes = require('../../data/resources/emojis.json')

module.exports = {
    cooldown: 90000,
    data: new SlashCommandBuilder()
    .setName("spin")
    .setDescription("Spin the wheel"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        let profile = await economySchema.findOneAndUpdate({
            userID: interaction.user.id,
        });
        if(profile.wallet < 250) return interaction.reply({ content: `${fail} You need at least 250 coins to spin the wheel!`, ephemeral: true})
        let user = interaction.member;
        const symbols = [
            emotes.lottary.lemon,
            emotes.lottary.bell,
            emotes.lottary.cherry,
            ":star:",
            emotes.lottary.gem,
            emotes.lottary.seven,
        ];

        function pickRandomSymbol() {
            return symbols[Math.floor(Math.random() * symbols.length)];
        };

        function generateRow() {
            return `${pickRandomSymbol()} : ${pickRandomSymbol()} : ${pickRandomSymbol()}`;
        };

        function generateAndCheckMiddleRow() {
            const middleRow = `${pickRandomSymbol()} : ${pickRandomSymbol()} : ${pickRandomSymbol()}`
            const symbolsMatch = middleRow.split(" : ").every((symbol, index, array) => symbol === array[0]);
            return { middleRow, symbolsMatch };
        };

        function displayWheel() {
            const topRow = generateRow();
            const { middleRow, symbolsMatch } = generateAndCheckMiddleRow();
            const bottomRow = generateRow();

            let message = `»»——${emotes.lottary.slotsIcon}——««\n`;
            message += `**>>** ${topRow} **<<**\n`;
            message += `**➤**  ${middleRow}  **⮜**\n`;
            message += `**>>** ${bottomRow} **<<**\n`;
            message += `»»——————————««`;

            return { message, symbolsMatch };
        }

        let random = Math.floor((Math.random() * 500000)) + 1;

        const embed1 = new EmbedBuilder()
        .setTitle('🎰 Spin the prize!')
        .setDescription(`**🎊 In the big chest there are ${random}${emotes.economy.goldCoin}**`)
        .setFooter({text: `Developed by aTmAx ©`})
        .setColor('Blue');

        const { message, symbolsMatch } = displayWheel();
        let jackpotMessage;

        if (symbolsMatch) {
            jackpotMessage = `${emotes.lottary.jackpot} Oh snap! You hit the jackpot, fam! ${emotes.economy.Rich}💰`;
            message += `\n${jackpotMessage}`;

            const embed = new EmbedBuilder()
            .setTitle('🎰 Spin completed!')
            .setDescription(message)
            .setFooter({ text: `🔥 Big win!!! 🎊 Your reward is ${random} coins` });

            interaction.reply({
                embeds: [embed1, embed],
                ephemeral: true
            });
            profile.wallet += random
            await profile.save().catch((err) => console.log(err));
        }
        else {
            jackpotMessage = "No dice this time, homie. Better luck next time! 😎🎰";
            message += `\n${jackpotMessage}`;
            const random1 = Math.floor((Math.random() * 300)) + 1;

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('🎰 Spin completed!')
                    .setDescription(`${message}`)
                    .setFooter({ text: `You have received ${random1}${emotes.economy.goldCoin}`})
                ],
                ephemeral: true
            });
            profile.wallet += random1
            await profile.save().catch((err) => console.log(err));
        }
    }
}