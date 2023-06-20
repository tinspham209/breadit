import { db } from "@/lib/db";

export const getComments = async (postId: string) => {
	const comments = await db.comment.findMany({
		where: {
			postId,
			replyToId: null,
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			author: true,
			votes: true,
			replies: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});
	return comments;
};
