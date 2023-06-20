import { db } from "@/lib/db";
import config from "@/utils/config";
import { getSession } from "next-auth/react";

export const getGeneralPost = async () => {
	const posts = await db.post.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			votes: true,
			author: true,
			comments: true,
			subreddit: true,
		},
		take: config.INFINITE_SCROLLING_PAGINATION_RESULTS,
	});
	return posts;
};

export const getCustomPost = async () => {
	const session = await getSession();

	const followedCommunities = await db.subscription.findMany({
		where: {
			userId: session?.user.id,
		},
		include: {
			subreddit: true,
		},
	});

	const posts = await db.post.findMany({
		where: {
			subreddit: {
				name: {
					in: followedCommunities.map(({ subreddit }) => subreddit.id),
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			votes: true,
			author: true,
			comments: true,
			subreddit: true,
		},
		take: config.INFINITE_SCROLLING_PAGINATION_RESULTS,
	});

	return posts;
};
