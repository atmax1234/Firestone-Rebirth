const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const emotes = require('../../data/resources/emojis.json');
const economySchema = require('../../models/Economy/economySchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unregister")
    .setDescription("Delete all your data from the economic system."),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const verify = emotes.general.success;
        const cancel = emotes.general.fail;

        const econ = await economySchema.findOne({
            userID: interaction.user.id
        }).clone()
        if (!econ) return interaction.reply({
            content:  `${cancel} You are not registered in our economic system.`,
            ephemeral: true
        });

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId("verify")
                .setEmoji(verify)
                .setStyle("SUCCESS")
                .setLabel("Yes")
                .setDisabled(state),
                new ButtonBuilder()
                .setCustomId("deny")
                .setEmoji(cancel)
                .setStyle("DANGER")
                .setLabel("No")
                .setDisabled(state)
            )
        ]
        const initialEmbed = new EmbedBuilder()
        .setTitle("UNREGISTER")
        .setDescription(`Are you sure you want to unregister yourself from the economy system?`)
        .addFields({
            name: "\u200B",
            value: ` Click ${verify} to unregister. Click ${cancel} to cancel the process.`
        })
        const initialMessage = await interaction.reply({
            embeds: [initialEmbed],
            components: [components(false)],
            ephemeral: true
        })
        const filter = (interaction) => {return interaction.user.id === interaction.user.id};
        const collector = initialMessage.createMessageComponentCollector({
            filter,
            componentType: "BUTTON",
            max: 1,
        })

        collector.on('collect', async (buttonInteraction) => {
            buttonInteraction.deferUpdate();
            if (buttonInteraction.customId === "verify") {
                const editEmbed = new EmbedBuilder()
                .setTitle('Unregistration')
                .setDescription('Your data from the economy system has been deleted.')
                .setColor('Random')
                initialMessage.edit({ embeds: [editEmbed], components: [components(true)]})
                econ.deleteOne({UserID: interaction.user.id}).catch((err) => console.log(err))
            }
            else if (buttonInteraction.customId === "deny") {
                const editEmbed = new EmbedBuilder()
                .setTitle('Cancelled Unregistration')
                .setDescription('The unregistration process has been cancelled.')
                .setColor('Random')
                initialMessage.edit({embeds: [editEmbed], components: [components(true)]});
            }
        })
    }
}