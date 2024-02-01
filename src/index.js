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

// Counters
total_counter = 1; // Total bot uptime

no_counter = 1; // Time that there is no server

yes_counter = 1; // Time that there is a server

// total_days_counter = 0; // Total days that bot is up

instance_counter_tracker = 0; // stores instance value

// Formats the seconds*10 into d, h, m, s
function formatTime(totalSeconds) {
  const seconds = totalSeconds * 10;
  const days = Math.floor(seconds / 864000); // 864000 seconds in a day
  const hours = Math.floor((seconds % 864000) / 3600); // 3600 seconds in an hour
  const minutes = Math.floor((seconds % 3600) / 60); // 60 seconds in a minute
  const remainingSeconds = seconds % 60;

  let result = "";

  if (days > 0) {
      result += `${days}d `;
  }

  if (hours > 0 || days > 0) {
      result += `${hours}h `;
  }

  if (minutes > 0 || hours > 0 || days > 0) {
      result += `${minutes}m `;
  }

  result += `${remainingSeconds}s`;

  return result.trim(); // Remove leading/trailing whitespaces
}

function checkInstances() {
  const placeId = "14894612329"; // Replace with your place ID
  noblox
    .getGameInstances(placeId)
    .then((instances) => {
      const instanceCount = instances.length;
      // More than one server
      if (instanceCount > 0) {
        const channel = client.channels.cache.get('1202020061221761165');   // GET channel ID
        // When server instances increase
        if (instance_counter_tracker < instanceCount) {                     
          channel.send(`<@&1202351752574423050> There are **${instanceCount}** instance(s) open for Elysium   (Uptime: ${formatTime(yes_counter)},   Total: ${formatTime(total_counter)})`);   // shows placeID - channel.send(`<@254344094636179466> There are ${instanceCount} instances open for place ID ${placeId}.`);
          instance_counter_tracker = instanceCount;
          total_counter++;
          yes_counter++;
          no_counter = 1;
        // When server instances decrease
        } else if (instance_counter_tracker > instanceCount) {                     
          channel.send(`<@&1202351752574423050> There are **${instanceCount}** instance(s) open for Elysium   (Uptime: ${formatTime(yes_counter)},   Total: ${formatTime(total_counter)})`);   // shows placeID - channel.send(`<@254344094636179466> There are ${instanceCount} instances open for place ID ${placeId}.`);
          instance_counter_tracker = instanceCount;
          total_counter++;
          yes_counter++;
          no_counter = 1;
        // When server instance stays the same
        } else {
          channel.send(`Elysium has **${instanceCount}** instance${instanceCount !== 1 ? 's' : ''} open   (Uptime: ${formatTime(yes_counter)}  |  Total: ${formatTime(total_counter)})`);
          total_counter++;
          yes_counter++;
          no_counter = 1; // Reset how long there has been no servers
        }
      // One server
      } else if (instanceCount === 0) {
        const channel = client.channels.cache.get('1202020061221761165');   // GET channel ID
        if (instance_counter_tracker > 0) {
          channel.send(`<@&1202351752574423050> All Elysiums have shut down   (Uptime: ${formatTime(yes_counter)}  |  Total: ${formatTime(total_counter)})`);
          instance_counter_tracker = 0;
          total_counter++;
          no_counter++;
          yes_counter = 1; // Reset how long there has been a server up
        } else {
          channel.send(`No open instances for Elysium   (None: ${formatTime(no_counter)}   Total: ${formatTime(total_counter)})`);   // shows placeID - channel.send(`There are no instances open for place ID ${placeId}.`);
          total_counter++;
          no_counter++;
        }
      }

      // Counters reset after 1 days if run constantly (unlikely). Only total counter will reset after 1 days all the time.
      // if (total_counter === 8640) {
      //   total_counter = 1;
      // //  total_days_counter++;
      // } else if (no_counter === 8640) {
      //   no_counter = 1;
      // } else if (yes_counter === 8640) {
      //   yes_counter = 1;
      // }
    }).catch(err => {
      console.error(err);
    });
  }

setInterval(checkInstances, 10000); // Milliseconds

client.login(process.env.TOKEN);



