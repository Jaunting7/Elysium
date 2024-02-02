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


// Time Elapsed Functions
function totalTimeElapsed(total_end) {
  let elapsed = total_end - total_start;  // elapsed time in milliseconds
  return formatTime(elapsed/1000); // convert milliseconds to seconds
}

function yesTimeElapsed(yes_end) {
  let elapsed = yes_end - yes_start;  // elapsed time in milliseconds
  return formatTime(elapsed/1000); // convert milliseconds to seconds
}

function noTimeElapsed(no_end) {
  let elapsed = no_end - no_start;  // elapsed time in milliseconds
  return formatTime(elapsed/1000); // convert milliseconds to seconds
}

// Formats the seconds into d, h, m, s
function formatTime(seconds) {
//  const seconds = totalSeconds;
  const days = Math.floor(seconds / 864000); // 864000 seconds in a day
  const hours = Math.floor((seconds % 864000) / 3600); // 3600 seconds in an hour
  let minutes = Math.floor((seconds % 3600) / 60); // 60 seconds in a minute
  let remainingSeconds = Math.round(seconds % 60);
  if (remainingSeconds === 60) {
    minutes += 1;
    remainingSeconds = 0;
  }

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


// Counters
let total_counter = 1; // Total bot uptime
let no_counter = 1; // Time that there is no server
let yes_counter = 1; // Time that there is a server

let instance_counter_tracker = 0; // stores instance value

let total_start = Date.now(); 
let total_end = Date.now();
let no_start = Date.now();
let yes_start = Date.now();


// Main
function checkInstances() {
  const placeId = "14894612329"; // Replace with your place ID
  noblox
    .getGameInstances(placeId)
    .then((instances) => {
      const instanceCount = instances.length;

      total_end = Date.now(); // 0s first run.

      // More than one server
      if (instanceCount > 0) {
        if (yes_counter === 1) {
          yes_start = Date.now();
          yes_counter = null;
          no_counter = 1;  // Reset counter for tracking start time of having no servers (only for no_start)
        }
        if (total_counter === 1) {
          total_start = Date.now();
        }
        no_end = Date.now();
        const channel = client.channels.cache.get('1202020061221761165');   // GET channel ID
        // When server instances increase
        if (instance_counter_tracker < instanceCount) { 
          yes_end = Date.now(); // Could place only one above but put here for accurate times                   
          channel.send(`<@&1202351752574423050> There are **${instanceCount}** instance(s) open for Elysium   (Uptime: ${yesTimeElapsed(yes_end)},   Total: ${totalTimeElapsed(total_end)})`);   // shows placeID - channel.send(`<@254344094636179466> There are ${instanceCount} instances open for place ID ${placeId}.`);
          instance_counter_tracker = instanceCount;
          total_counter++;
        // When server instances decrease
        } else if (instance_counter_tracker > instanceCount) {
          yes_end = Date.now();                     
          channel.send(`<@&1202351752574423050> There are **${instanceCount}** instance(s) open for Elysium   (Uptime: ${yesTimeElapsed(yes_end)},   Total: ${totalTimeElapsed(total_end)})`);   // shows placeID - channel.send(`<@254344094636179466> There are ${instanceCount} instances open for place ID ${placeId}.`);
          instance_counter_tracker = instanceCount;
          total_counter++;
        // When server instance stays the same
        } else {
          yes_end = Date.now()
          channel.send(`Elysium has **${instanceCount}** instance${instanceCount !== 1 ? 's' : ''} open    (Uptime: ${yesTimeElapsed(yes_end)}  |  Total: ${totalTimeElapsed(total_end)})`);
          total_counter++;
        }

      // One server
      } else if (instanceCount === 0) {
        if (no_counter === 1) {
          no_start = Date.now();
          no_counter = null;
          yes_counter = 1;  // Reset counter for tracking start time of an up server (only for yes_start)
        }
        if (total_counter === 1) {
          total_start = Date.now();
        }
        yes_end = Date.now();
        const channel = client.channels.cache.get('1202020061221761165');   // GET channel ID
        if (instance_counter_tracker > 0) {
          channel.send(`<@&1202351752574423050> All Elysiums have shut down   (Uptime: ${yesTimeElapsed(yes_end)}  |  Total: ${totalTimeElapsed(total_end)}`);
          instance_counter_tracker = 0;   // Reset counter because only will only be used when server goes back up
          total_counter++;
        } else {
          no_end = Date.now();
          channel.send(`No open instances for Elysium   (None: ${noTimeElapsed(no_end)}  |  Total: ${totalTimeElapsed(total_end)})`);   // shows placeID - channel.send(`There are no instances open for place ID ${placeId}.`);
          total_counter++;
        }
      }
    }).catch(err => {
      console.error(err);
    });
  }

setInterval(checkInstances, 10000); // Milliseconds

client.login(process.env.TOKEN);



