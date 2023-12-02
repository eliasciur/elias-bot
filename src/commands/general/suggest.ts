import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { Command } from "../../structure/Command";
import { Embed } from "../../structure/Embed";
import emojis from "../../json/emojis.json";

module.exports = {

   data: new SlashCommandBuilder().setName("suggest").setDescription("Creates a suggestion.")
      .addStringOption(new SlashCommandStringOption().setName("suggestion").setDescription("The suggestion.").setRequired(true)),

   async onCommandInteraction(interaction: ChatInputCommandInteraction) {
       
      const message = await interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Suggestion',
         author: {name: interaction.user.displayName, iconURL: interaction.user.avatarURL()},
         description: interaction.options.getString("suggestion")})], fetchReply: true});

      message.react(emojis.upvote);
      message.react(emojis.downvote);

   },

} satisfies Command