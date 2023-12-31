import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { Guild } from '../../schemas/Guild';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns a user.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user to warn.')
				.setRequired(true)
		)
		.addStringOption(
			new SlashCommandStringOption()
				.setName('reason')
				.setDescription('The reason for the warn.')
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason', false);

		interaction.guild.members
			.fetch(user.id)
			.then(async member => {
				if (member.id == interaction.guild.members.me.id) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description: 'I can not warn myself!',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				if ((interaction.member as GuildMember).roles.highest.position <= member.roles.highest.position
					&& interaction.guild.ownerId != interaction.user.id) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description:
									'You do not have a higher role than the target member.',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				const guild = await Guild.findById(interaction.guild.id) ??
					await Guild.create({ _id: interaction.guild.id });

				const embed = new Embed({ color: EmbedColor.primary, title: 'Warn' }).addField({
					name: 'User',
					value: user.toString(),
				});

				if (reason) embed.addField({ name: 'Reason', value: reason });

				interaction.reply({ embeds: [embed] });

				guild.warns.push({ user_id: user.id, reason: reason });
				guild.save();
			})
			.catch(() => {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.danger,
							description: 'Can not find this user in this server.',
						}),
					],
					ephemeral: true,
				});
			});
	},
} satisfies Command;