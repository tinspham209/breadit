import { Comment, Post, Subreddit, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
	subreddit: Subreddit;
	votes: Vote[];
	author: User;
	comments: Comment[];
};

export type GetPropertiesParams = {
	skip?: number;
	take?: number;
	order?: string;
	search?: string;
	sort?: string;
	[key: string]: string | number | string[] | boolean;
};
