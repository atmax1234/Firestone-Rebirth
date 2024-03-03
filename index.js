const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
require('dotenv').config();
const mongoose = require('mongoose');

const client = new Client({ 
    intents: [Guilds, GuildMembers, GuildMessages], 
    partials: [User, Message, GuildMember, ThreadMember]
});

const { loadEvents } = require("./Handlers/eventHandler");

client.events = new Collection();
client.commands = new Collection();
client.cooldowns = new Collection();

loadEvents(client);

//Connect to MongoDB using mongoose
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Mongo DB Connected Successfully!")).catch((err) => console.error(err));

//Anti Crash Error Handling
process.on("unhandledRejection", async(reason, p) => {
    console.log("⛔ [Anti-Crash]: Unhandled Rejection/Catch");
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log("⛔ [Anti-Crash]: Uncaught Exception/Catch");
    console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("⛔ [Anti-Crash]: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
});

client.login(process.env.DISCORD_TOKEN).then(() => {
    console.log(`client logged in as ${client.user.username}`);
    client.user.setActivity(`with ${client.guilds.cache.size} guild(s)`)
}).catch((err) => console.log(err))