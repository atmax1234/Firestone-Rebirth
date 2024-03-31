const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder , ButtonBuilder, ButtonStyle } = require("discord.js");
const pagination = require('discordjs-button-pagination-v2');
const { readdirSync } = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides the help command"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        let categories = [];
        // Get all files in commands folder and add to category list

        readdirSync("./Commands").forEach((dir) => {
            const commands = readdirSync(`./Commands/${dir}/`).filter((file) =>
            file.endsWith(".js"));

            const cmds = commands.map((command) => {
                let file = require(`../../Commands/${dir}/${command}`);

                if(!file.name) return "No Command Name.";

                let name = file.name.replace(".js", "");
                let description = file.description;

                console.log(name, description)
            })
        });
    }
}