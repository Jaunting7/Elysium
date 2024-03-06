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
 
// client.on("messageCreate", async (message) => {
//   if (message.content.startsWith("check")) {
//     const placeId = message.content.split(" ")[1];
//     const instances = await noblox.getGameInstances(placeId);
//     let instanceCount = instances.length;
//     if (instanceCount === 0) {
//       message.reply(`There are no instances open for place ID ${placeId}.`);
//     } else {
//       message.reply(
//         `There are ${instanceCount} instances open for place ID ${placeId}.`,
//       );
//     }
//   }
// });

let lastExecutionTime = 0; // Initialize with zero (no previous execution)

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("time")) {
    let currentTime = Date.now() / 1000;
    if (currentTime - lastExecutionTime >= 5) {
      const instances = await noblox.getGameInstances(placeId);
      let instanceCount = instances.length;
      if (instanceCount > 0) {
          message.reply(`Server Uptime: ${time2}  |  Bot Uptime: ${total_time2}`);
          lastExecutionTime = currentTime;
      } else {
          message.reply(`No Servers: ${time2}  |  Bot Uptime: ${total_time2}`);
          lastExecutionTime = currentTime;
      } 
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
  let days_calculation = (((seconds /60) /60) /24); // /60 gives minutes, /60 gives hours, /24 gives days
  let days = Math.floor(days_calculation)
  days_calculation = days_calculation - days;

  let hours_calculation = days_calculation * 24; // 3600 seconds in an hour
  let hours = Math.floor(hours_calculation);
  hours_calculation = hours_calculation - hours;

  let minutes_calculation = hours_calculation * 60; // 60 seconds in a minute
  let minutes = Math.floor(minutes_calculation);
  minutes_calculation = minutes_calculation - minutes;

  let seconds_calculation = minutes_calculation * 60;
  let seconds2 = Math.round(seconds_calculation);
  seconds_calculation = seconds_calculation - seconds2;

  if (seconds2 === 60) {
      seconds2 = 0;
      minutes += 1;
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
  result += `${seconds2}s`;
  return result;
}

// Store time
function currentTime(time, total_time, channel) {
  time2 = time;
  total_time2 = total_time;
  channel2 = channel;
}

// Counters
let total_counter = 1; // Used to track total_start
let no_counter = 1; // Used to track no_start
let yes_counter = 1; // Used to track yes_start
 
let instance_counter_tracker = 0; // stores instance value
 
let total_start = Date.now(); 
let total_end = Date.now();
let no_start = Date.now();
let yes_start = Date.now();

const placeId = "14894612329"; // GET place ID
const roleID = "1202351752574423050"; // GET role ID

bot_start = true;

// Main
async function checkInstances() {
  const channel = await client.channels.fetch('1202020061221761165');   // GET channel ID
  // console.log(`The role ID is: ${roleID}`);
  // console.log(`The place ID is: ${placeId}`);
  // console.log(`The channel ID is: ${channel}`);
  noblox
    .getGameInstances(placeId)
    .then((instances) => {
      const instanceCount = instances.length;
      
      if (bot_start == true) {
        currentTime(null, null, 1202020061221761165);
        channel.send("The Elysium Bot is now up. Server uptime will be inaccurate if there is an Elysium.")
        bot_start = false;
      }

      total_end = Date.now(); // 0s first run.

      // More than one server
      if (instanceCount > 0) {
        if (yes_counter === 1) {
          yes_start = Date.now();
          yes_counter = 2;
          no_counter = 1;  // Reset counter for tracking start time of having no servers (only for no_start)
        }
        if (total_counter === 1) {
          total_start = Date.now();
          total_counter = 2;
        }
        no_end = Date.now();
        // When server instances increase
        if (instance_counter_tracker < instanceCount) { 
          yes_end = Date.now(); // Could place only one above but put here for accurate times
          channel.send(`<@&${roleID}> There are **${instanceCount}** instance(s) open for Elysium   (Uptime: ${yesTimeElapsed(yes_end)},   Total: ${totalTimeElapsed(total_end)})`);   // shows placeId - channel.send(`<@254344094636179466> There are ${instanceCount} instances open for place ID ${placeId}.`);
          instance_counter_tracker = instanceCount;
        // When server instances decrease
        } else if (instance_counter_tracker > instanceCount) {
          yes_end = Date.now();                     
          channel.send(`<@&${roleID}> There are **${instanceCount}** instance(s) open for Elysium   (Uptime: ${yesTimeElapsed(yes_end)},   Total: ${totalTimeElapsed(total_end)})`);   // shows placeId - channel.send(`<@254344094636179466> There are ${instanceCount} instances open for place ID ${placeId}.`);
          instance_counter_tracker = instanceCount;
        // When server instance stays the same
        } else {
          yes_end = Date.now()
          currentTime(yesTimeElapsed(yes_end), totalTimeElapsed(total_end), channel)
          // channel.send(`Elysium has **${instanceCount}** instance${instanceCount !== 1 ? 's' : ''} open    (Uptime: ${yesTimeElapsed(yes_end)}  |  Total: ${totalTimeElapsed(total_end)})`);
        }
 
      // One server
      } else if (instanceCount === 0) {
        if (no_counter === 1) {
          no_start = Date.now();
          no_counter = 2;
          yes_counter = 1;  // Reset counter for tracking the start time of when a server is up (only for yes_start)
        }
        if (total_counter === 1) {
          total_start = Date.now();
          total_counter = 2;
        }
        yes_end = Date.now();
        if (instance_counter_tracker > 0) {
          channel.send(`<@&${roleID}> All Elysiums have shut down   (Uptime: ${yesTimeElapsed(yes_end)}  |  Total: ${totalTimeElapsed(total_end)}`);
          instance_counter_tracker = 0;   // Reset counter because only will only be used when server goes back up
        } else {
          no_end = Date.now();
          currentTime(noTimeElapsed(yes_end), totalTimeElapsed(total_end), channel)
          // channel.send(`No open instances for Elysium   (None: ${noTimeElapsed(no_end)}  |  Total: ${totalTimeElapsed(total_end)})`);   // shows placeId - channel.send(`There are no instances open for place ID ${placeId}.`);
        }
      }
    }).catch(err => {
      console.error(err);
    });
  }
setInterval(checkInstances, 5000); // Milliseconds
 
client.login(process.env.TOKEN);