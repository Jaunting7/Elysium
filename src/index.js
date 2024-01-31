require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");
const noblox = require("noblox.js");
const express = require("express")
const app = express();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Project is running!');
});

app.get("/", (req, res) => {
  res.send("Hello world!");
})

client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("check")) {
    const placeId = message.content.split(" ")[1];
    const instances = await noblox.getGameInstances(placeId);
    const instanceCount = instances.length;
    if (instanceCount === 0) {
      message.reply(`There are no instances open for place ID ${placeId}.`);
    } else {
      message.reply(
        `There are ${instanceCount} instances open for place ID ${placeId}.`,
      );
    }
  }
});

counter = 1
if (counter === 1000000) {
  counter = 1;
}

function checkInstances() {
  const placeId = "14894612329"; // Replace with your place ID
  noblox
    .getGameInstances(placeId)
    .then((instances) => {
      const instanceCount = instances.length;
      if (instanceCount === 0) {
            const channel = client.channels.cache.get('1202020061221761165');   // Replace with your channel ID
            channel.send(`There are no instances open for Elysium (${counter}).`);   // shows placeID - channel.send(`There are no instances open for place ID ${placeId}.`);
            counter++;
          } else {
            const channel = client.channels.cache.get('1202020061221761165');   // Replace with your channel ID
            channel.send(`<@254344094636179466> There are ${instanceCount} instances open for Elysium.`);   // shows placeID - channel.send(`<@254344094636179466> There are ${instanceCount} instances open for place ID ${placeId}.`);
          }
        }).catch(err => {
          console.error(err);
        });
      }

setInterval(checkInstances, 10000); // Milliseconds

client.login(process.env.TOKEN);

