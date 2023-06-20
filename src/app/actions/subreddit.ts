import { db } from "@/lib/db";
import config from "@/utils/config";

export const getSubredditById = async (id: string) => {
	const subreddit = await db.subreddit.findFirst({
		where: { name: id },
	});
	return subreddit;
};

export const getSubredditAllContent = async (id: string) => {
	const subreddit = await db.subreddit.findFirst({
		where: { name: id },
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
					comments: true,
					subreddit: true,
				},
				orderBy: {
					createdAt: "desc",
				},
				take: config.INFINITE_SCROLLING_PAGINATION_RESULTS,
			},
		},
	});
	return subreddit;
};

export const getSubredditIncludeAuthorAndVote = async (id: string) => {
	const subreddit = await db.subreddit.findFirst({
		where: { name: id },
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});

	// const;
	return subreddit;
};

export const getSubscription = async (subredditId: string, userId: string) => {
	const subscription = await db.subscription.findFirst({
		where: {
			subreddit: {
				name: subredditId,
			},
			user: {
				id: userId,
			},
		},
	});
	return subscription;
};

export const getCountSubscription = async (subredditId: string) => {
	const subscription = await db.subscription.count({
		where: {
			subreddit: {
				name: subredditId,
			},
		},
	});
	return subscription;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getSubredditAllContent,
	getSubredditIncludeAuthorAndVote,
	getSubscription,
	getCountSubscription,
};
