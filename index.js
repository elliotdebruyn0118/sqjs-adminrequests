const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, 'config.cfg') });

const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

const channelIds = [process.env.channelid];

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('messageCreate', (message) => {
  if (channelIds.includes(message.channel.id) && message.embeds.length > 0) {
    const embed = message.embeds[0];

    const button = new Discord.MessageButton()
      .setStyle('SUCCESS')
      .setLabel('Mark as Completed')
      .setCustomId('completedButton');

    const row = new Discord.MessageActionRow().addComponents(button);

    message.edit({ embeds: [embed], components: [row] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'completedButton') {
    await interaction.deferUpdate();

    const embed = interaction.message.embeds[0];
    embed.setColor('GREEN');
    embed.setTitle('Request Completed');

    const buttonComponent = interaction.message.components[0].components.find(
      (component) => component.customId === 'completedButton'
    );

    if (buttonComponent) {
      buttonComponent.setDisabled(true);
      buttonComponent.setLabel('Completed');
    }

    const interactionUser = interaction.user.toString();
    const handledByField = { name: 'Request handled by:', value: interactionUser };

    embed.addField(handledByField.name, handledByField.value);

    await interaction.message.edit({ embeds: [embed], components: interaction.message.components });
  }
});

client.login(process.env.discordtoken);
