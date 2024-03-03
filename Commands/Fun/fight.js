const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fights = require('../../data/resources/fights.json')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("fight")
    .setDescription("Fight with someone!")
    .addUserOption(option => option.setName('opponent')
        .setDescription('The user you want to fight with')
        .setRequired(true))
    .addStringOption(option => option.setName('reason')
        .setDescription('Why are you fighting?')
        .setRequired(false)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const user = interaction.options.getUser( 'opponent', true);
        if (!user) return interaction.reply({ content: 'You can\`t fight with a thin air, pick someone fool..', ephemeral: true });
        const reason = interaction.options.getString('reason');
        if (user.id === "838501692743221248") return interaction.reply({
            content: `You can\'t win against him, he will kill you :wink:`,
            ephemeral: true
        })
        else if (user.id === "1079082158796324975") return interaction.reply({
            content: ['I\'m a bot and therefore you don\'t stand a chance against me!'],
            ephemeral: true
        })
        else {
            const fightEmbed = new EmbedBuilder()
            .setColor('Fuchsia')
            .setDescription(`Our fighters: ||${interaction.user.id}|| is fighting vs ||${user.username}||\n\n**Reason:** \`${reason}\`\n**The result:** ||${fights[Math.floor(Math.random() * fights.length)]}||`)

            interaction.reply({embeds: [fightEmbed]})
        }
    }
}