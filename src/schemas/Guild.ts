import mongoose from 'mongoose';

export interface Warn {
	user_id: string;
	reason?: string;
}

const GuildSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		warns: [Object],
		xp: {
			type: Map,
			of: Number,
			default: new Map()
		},
		plugins: {
			type: Map,
			of: Boolean,
			default: new Map()
		},
		settings: {
			type: Map,
			of: Object,
			default: new Map()
		}
	},
);

export const Guild = mongoose.model('Guild', GuildSchema);

export function getLevel(xp: number) {
	for (let i = 0;; i++) {
		if (xp < getXP(i + 1)) return i;
	}
}

export function getXP(level: number) {
	if (level == 0) return 0;
	return level * 100 + getXP(level - 1);
}