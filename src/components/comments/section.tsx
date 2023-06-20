import { getComments } from "@/app/actions";
import { getSession } from "next-auth/react";
import React from "react";
import PostComment from "./PostComment";
import CreateComment from "./create";

interface CommentsSectionProps {
	postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
	const session = await getSession();
	const comments = await getComments(postId);
	return (
		<div className="flex flex-col gap-y-4 mt-4">
			<hr className="w-full h-px py-6" />

			{/* TODO: Create comment */}
			<CreateComment postId={postId} />

			<div className="flex flex-col gap-y-6 mt-4">
				{comments
					.filter((comment) => !comment.replyToId)
					.map((topLevelComment, topLevelIndex) => {
						const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
							(acc, vote) => {
								if (vote.type === "UP") return acc + 1;
								if (vote.type === "DOWN") return acc - 1;
								return acc;
							},
							0
						);

						const topLevelCommentVote = topLevelComment.votes.find(
							(vote) => vote.userId === session?.user.id
						);

						return (
							<div
								className="flex flex-col"
								key={`${topLevelComment.id}-${topLevelIndex}`}
							>
								<div className="mb-2">
									<PostComment
										comment={topLevelComment}
										postId={postId}
										currentVote={topLevelCommentVote}
										votesAmt={topLevelCommentVotesAmt}
									/>
								</div>
								{/* render replies */}
								{topLevelComment.replies
									.sort((a, b) => b.votes.length - a.votes.length)
									.map((reply) => {
										const replyVotesAmt = reply.votes.reduce((acc, vote) => {
											if (vote.type === "UP") return acc + 1;
											if (vote.type === "DOWN") return acc - 1;
											return acc;
										}, 0);

										const replyVote = reply.votes.find(
											(vote) => vote.userId === session?.user.id
										);
										return (
											<div
												key={reply.id}
												className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
											>
												<PostComment
													comment={reply}
													postId={postId}
													currentVote={replyVote}
													votesAmt={replyVotesAmt}
													isSubComment={true}
												/>
											</div>
										);
									})}
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default CommentsSection;
