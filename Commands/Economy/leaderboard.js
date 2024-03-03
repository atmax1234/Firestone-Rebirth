const { ChatInputCommandInteraction, SlashCommandBuilder, Collection, EmbedBuilder } = require("discord.js");
const { goldCoin } = require('../../data/resources/emojis.json');
const economySchema = require('../../models/Economy/economySchema')

module.exports = {
    cooldown: 40000,
    data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows top 10 Richest users"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
   async execute(interaction) {
        const emoji = goldCoin;
        const collection = new Collection();
        await Promise.all(
            interaction.guild.members.cache.map(async member => {
                const id = member.id;
                let Profile = await economySchema.findOne({ userID: id });
                let bal = Profile?.wallet
                if(!bal) return;
                return bal !== 0 ? collection.set(id, {
                    id, 
                    bal,
                }) : null;
            })
        );
        if (!collection) {
            return  interaction.reply({
                content: `None of the members got ${emoji}`,
                ephemeral: true
            });
        }
        const ata = collection.sort((a, b) => b.bal - a.bal).first(10);
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Top 10 Richest Members in ${interaction.guild.name}`)
                .setDescription(
                    ata.map((v, i) => {
                        return `**${i + 1}** ${interaction.guild.members.cache.get(v.id).user.tag} ❯ **${v.bal} ${emoji}**`;
                    }).join("\n")
                )
                .setTimestamp()
                .setColor('Gold'),
            ],
            ephemeral: true
        })
    }
}