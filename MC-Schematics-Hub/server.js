require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const noCache = require('./no-cache-loader');
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  Events
} = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;
const VIP_CODES_FILE = path.join(__dirname, 'usedVipCodes.json');
let usedVipCodes = [];
try {
  usedVipCodes = JSON.parse(fs.readFileSync(VIP_CODES_FILE, 'utf8'));
  if (!Array.isArray(usedVipCodes)) usedVipCodes = [];
} catch {
  usedVipCodes = [];
}

const CHANNEL_ID = process.env.CHANNEL_ID;
const VIP_ROLE_NAME = 'VIP';
const themes = ['Dark', 'Light', 'Retro', 'Matrix', 'Neon'];

app.use(express.json());
app.use(noCache);
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: 0,
  setHeaders: (res) => res.set('Cache-Control', 'no-store'),
}));

// Discord bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Discord bot logged in as ${client.user.tag}`);
  client.user.setActivity('MC Schematics Hub 🎮', { type: 'WATCHING' });
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'help') {
      const ownerRole = interaction.guild.roles.cache.find(r => r.name === 'Owner');
      const helpMsg = `**Free Games Hub Console Commands:**\n
- \`toggleDarkMode()\` - Toggles dark mode
- \`toggleVIP()\` - Enables VIP UI
- \`SetTheme(n)\` - Sets a numbered theme
- \`Help()\` - Shows help in console
- \`listThemes()\` - Shows current themes
- \`Send("Message")\` - Sends a message to the bot`;

      await interaction.reply({ content: helpMsg, ephemeral: true });

      if (ownerRole) {
        ownerRole.members.forEach(member => {
          if (member.id !== interaction.user.id) {
            member.send(`🔔 ${interaction.user.tag} used /help`).catch(() => {});
          }
        });
      }
    } else if (interaction.commandName === 'theme' && interaction.options.getSubcommand() === 'list') {
      await interaction.reply({ content: `🎨 Available Themes:\n- ${themes.join('\n- ')}`, ephemeral: true });
    } else if (interaction.commandName === 'claimvip') {
      const code = interaction.options.getString('code').trim();

      if (!code.match(/^[a-zA-Z0-9]{3,20}$/)) {
        return interaction.reply({ content: '❌ Invalid code format. Use 3-20 alphanumeric characters.', ephemeral: true });
      }

      if (usedVipCodes.includes(code)) {
        return interaction.reply({ content: '❌ This VIP code has already been used.', ephemeral: true });
      }

      const vipRole = interaction.guild.roles.cache.find(r => r.name === VIP_ROLE_NAME);
      if (!vipRole) {
        return interaction.reply({ content: '❌ VIP role not found on this server.', ephemeral: true });
      }

      if (interaction.member.roles.cache.has(vipRole.id)) {
        return interaction.reply({ content: '🎟️ You already have VIP role!', ephemeral: true });
      }

      await interaction.member.roles.add(vipRole);
      usedVipCodes.push(code);
      fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(usedVipCodes, null, 2));

      await interaction.reply({ content: `✅ VIP role granted! Your VIP code "${code}" is now used and can’t be reused.`, ephemeral: true });
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    if (!interaction.replied) {
      await interaction.reply({ content: '⚠️ Something went wrong.', ephemeral: true });
    }
  }
});

// Register slash commands
const commands = [
  new SlashCommandBuilder().setName('help').setDescription('Displays website command help'),
  new SlashCommandBuilder()
    .setName('theme')
    .setDescription('Manage visual themes')
    .addSubcommand(sub => sub.setName('list').setDescription('List all available themes')),
  new SlashCommandBuilder()
    .setName('claimvip')
    .setDescription('Claim your VIP role with a custom code')
    .addStringOption(opt =>
      opt.setName('code').setDescription('Pick your VIP code (3-20 alphanumeric characters)').setRequired(true)),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('✅ Slash commands deployed'))
  .catch(console.error);

// Express endpoints for frontend command logic
app.post('/validate-vip', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.json({ success: false, message: "Invalid VIP code" });
  }
  const isValid = !usedVipCodes.includes(code.trim());
  res.json({ success: isValid, message: isValid ? "VIP code valid and unused" : "VIP code already used" });
});

app.post('/log-command', async (req, res) => {
  const { command, timestamp } = req.body;
  if (!command || !timestamp) {
    return res.status(400).json({ error: 'Missing command or timestamp' });
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) return res.status(500).json({ error: 'Discord channel not found' });

    await channel.send(`🖥️ Console command used: **${command}** at ${timestamp}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending log:', error);
    res.status(500).json({ error: 'Failed to send log' });
  }
});

app.post('/send-message', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) return res.status(500).json({ error: 'Discord channel not found' });

    await channel.send(message);
    res.json({ success: true, message: 'Message sent to Discord channel' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/api/themes', (req, res) => {
  res.json({ success: true, themes });
});

app.listen(PORT, () => {
  console.log(`🌐 Website running at http://localhost:${PORT}`);
});

client.login(process.env.TOKEN);
