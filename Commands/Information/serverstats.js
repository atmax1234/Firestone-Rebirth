const axios = require("axios");
const { DOMParser } = require("xmldom");
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const emojis = require("../../data/resources/emojis.json");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstats")
    .setDescription("Show Game Server Stats")
    .addStringOption((option) =>
      option
        .setName("ip")
        .setDescription("Server IP to get stats from")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    //Get the IP
    let ip = interaction.options.get("ip").value;
    try {
      //Send a request to the server and wait for it to respond
      await axios
        .get(
          `http://api.gametracker.rs/demo/xml/server_info/${encodeURIComponent(
            ip
          )}/`
        )
        .then(async (response) => {
          const xmlData = response.data;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlData, "text/xml");

          //API Error HANDLING
          if (response.apiError === 1) {
            return interaction.reply({
              content: "Server not found!",
              ephemeral: true,
            });
          }

          //Deba toz gametracker vurna xml data type.. Sq trqbvashe da vzema root elementa na XML Dokument s tag name-a
          //Pak che ima specialna biblioteka v JS za takiva sluchei da jivee JS!
          const sName = xmlDoc.getElementsByTagName("name")[0].textContent;
          const modName = xmlDoc.getElementsByTagName("modname")[0].textContent;
          const wRank = xmlDoc.getElementsByTagName("rank")[0].textContent;
          const balkanRank =
            xmlDoc.getElementsByTagName("balcan")[0].textContent === "1"
              ? xmlDoc.getElementsByTagName("rank_balcan")[0].textContent
              : "N/A";
          const players = xmlDoc.getElementsByTagName("players")[0].textContent;
          const maxPlayers =
            xmlDoc.getElementsByTagName("playersmax")[0].textContent;
          const status =
            xmlDoc.getElementsByTagName("status")[0].textContent == "1"
              ? "Online"
              : "Offline";
          const mapName = xmlDoc.getElementsByTagName("map")[0].textContent;
          const ownerName =
            xmlDoc.getElementsByTagName("ownerusername")[0].textContent;
          const country =
            xmlDoc.getElementsByTagName("countryname")[0].textContent;
          const countryFlag = `${xmlDoc.getElementsByTagName("iso2")[0].textContent}`;
          const gamename =
            xmlDoc.getElementsByTagName("gamename")[0].textContent;
          const bestRank =
            xmlDoc.getElementsByTagName("rank_min")[0].textContent;
          const worstRank =
            xmlDoc.getElementsByTagName("rank_max")[0].textContent;
          const lastMap = xmlDoc.getElementsByTagName("lastMap")[0].textContent;
          const mapImage = `http://banners.gametracker.rs/map/${
            xmlDoc.getElementsByTagName("gameshort")[0].textContent
          }/${xmlDoc.getElementsByTagName("map")[0].textContent}.jpg`;

          //A sq kusmet da izmislish gotin embed message Axele..
          let serverEmbed = new EmbedBuilder()
            .setTitle(gamename)
            .setThumbnail(mapImage)
            .setDescription("**Server Information:**")
            .addFields(
              { name: "Server Name:", value: `${sName}`, inline: true },
              { name: "Mod:", value: `${modName}` },
              {
                name: "Status:",
                value: status == "Online" ? `🟢 ${status}` : `🔴 ${status}`,
              },
              { name: "Founded By:", value: `${ownerName}` },
              { name: `Country:`, value: `${country}` },
              { name: `Country Flag:`, value: `${countryFlag}` },
              { name: `\u200b`, value: `\u200b` },
              { name: `**Ranks**`, value: `\u200B` },
              { name: "World Rank:", value: `${wRank}`, inline: true },
              {
                name: "Balkan Rank:",
                value: balkanRank === "N/A" ? "N/A" : `${balkanRank}`,
                inline: true,
              },
              { name: "Best Rank:", value: `${bestRank}`, inline: true },
              { name: "Worst Rank:", value: `${worstRank}`, inline: true },
              { name: `\u200b`, value: `\u200b` },
              { name: `**Players & Map Info**`, value: "\u200b" },
              {
                name: "Players Online:",
                value: `${players}/${maxPlayers}`,
                inline: true,
              },
              { name: "Last Played Map: ", value: `${lastMap}`, inline: true },
              { name: "Current Map:", value: `${mapName}`, inline: true }
            )
            .setFooter({text: 'All the information is pulled from GameTracker.RS'});
          await interaction.reply({
            embeds: [serverEmbed],
            ephemeral: true,
          });
        });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: `${emojis.general.fail} An error has occurred!`,
        ephemeral: true,
      });
    }
  },
};
