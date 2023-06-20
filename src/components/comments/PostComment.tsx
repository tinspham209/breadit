"use client";

import React from "react";
import UserAvatar from "../navbar/UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./votes";
import { Button } from "../ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { useReplyToComment } from "@/queries/comments";
import { AxiosError } from "axios";
import { getErrorMessageResponse } from "@/utils/error";
import { useToast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

type ExtendedComment = Comment & {
	votes: CommentVote[];
	author: User;
};

interface PostCommentProps {
	comment: ExtendedComment;
	votesAmt: number;
	currentVote: CommentVote | undefined;
	postId: string;
	canReply?: boolean;
	isSubComment?: boolean;
}

const PostComment: React.FC<PostCommentProps> = ({
	comment,
	votesAmt,
	currentVote,
	postId,
	canReply = true,
	isSubComment = false,
}) => {
	const commentRef = React.useRef<HTMLDivElement>(null);
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	const router = useRouter();
	const { data: session } = useSession();
	const { toast } = useToast();
	const { loginToast } = useCustomToast();
	const [isReplying, setIsReplying] = React.useState(false);

	const [input, setInput] = React.useState("");

	const { isLoading, replyToComment } = useReplyToComment({
		onSuccess() {
			router.refresh();
			setIsReplying(false);
		},
		onError(error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				} else {
					toast({
						title: `There was a problem when comment`,
						description: `${getErrorMessageResponse(error)}`,
						variant: "destructive",
					});
				}
			} else {
				toast({
					title: "Something went wrong",
					description: `Please try again`,
					variant: "destructive",
				});
			}
		},
	});

	return (
		<div className="flex flex-col" ref={commentRef}>
			<div className="flex items-center">
				<UserAvatar
					user={{
						name: comment.author.name || null,
						image: comment.author.image || null,
					}}
					className="h-6 w-6"
				/>

				<div className="ml-2 flex items-center gap-x-2">
					<p className="text-sm font-medium text-gray-900">
						u/{comment.author.username}
					</p>
					<p className="max-h-40 truncate text-xs text-gray-500">
						{formatTimeToNow(new Date(comment.createdAt))}
					</p>
				</div>
			</div>

			<p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

			<div className="flex gap-2 items-center flex-wrap">
				<CommentVotes
					commentId={comment.id}
					initialVotesAmount={votesAmt}
					initialVote={currentVote}
				/>
				{canReply ? (
					<Button
						variant={"ghost"}
						size={"xs"}
						aria-label="reply"
						onClick={() => {
							if (!session) router.push("/sign-in");
							setIsReplying(true);
							setTimeout(() => {
								textareaRef.current?.focus();
							}, 100);
						}}
					>
						<MessageSquare className="h-4 w-4 mr-1.5" />
						Reply
					</Button>
				) : null}

				{isReplying ? (
					<div className="grid w-full gap-1.5">
						<Label htmlFor="comment">Your comment</Label>
						<div className="mt-2">
							<Textarea
								ref={(e) => {
									// @ts-ignore
									textareaRef.current = e;
								}}
								id="comment"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								rows={1}
								placeholder="What are your throughts?"
							/>

							<div className="mt-2 flex justify-end gap-2">
								<Button
									tabIndex={-1}
									variant={"subtle"}
									onClick={() => setIsReplying(false)}
								>
									Cancel
								</Button>
								<Button
									isLoading={isLoading}
									disabled={input.length === 0}
									onClick={() => {
										if (!input) return;

										replyToComment({
											postId,
											text: isSubComment
												? `@${comment.author.username}: ${input}`
												: input,
											replyToId: comment.replyToId ?? comment.id,
										});
									}}
								>
									Post
								</Button>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default PostComment;
