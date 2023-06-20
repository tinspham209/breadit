"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import React from "react";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVotePost } from "@/queries/subreddit";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessageResponse } from "@/utils/error";
import { useVoteComment } from "@/queries/comments";

type PartialVote = Pick<CommentVote, "type">;

interface PostVoteClientProps {
	commentId: string;
	initialVotesAmount: number;
	initialVote?: PartialVote;
}

const CommentVotes: React.FC<PostVoteClientProps> = ({
	commentId,
	initialVotesAmount,
	initialVote,
}) => {
	const { loginToast } = useCustomToast();
	const { toast } = useToast();
	const [votesAmount, setVotesAmount] = React.useState(initialVotesAmount);

	const [currentVote, setCurrentVote] = React.useState(initialVote);
	const prevVote = usePrevious(currentVote);

	const { isLoading, vote } = useVoteComment({
		commentId: commentId,
		onSuccess(data, variables, context) {},
		onError(error, variables) {
			const { voteType } = variables;

			if (voteType === "UP") {
				setVotesAmount((prev) => prev - 1);
			} else {
				setVotesAmount((prev) => prev + 1);
			}

			// reset current vote
			setCurrentVote(prevVote);

			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				} else {
					toast({
						title: `There was a problem`,
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
		onMutate(variables) {
			const { voteType } = variables;
			if (currentVote?.type === voteType) {
				setCurrentVote(undefined);
				if (voteType === "UP") {
					setVotesAmount((prev) => prev - 1);
				} else {
					setVotesAmount((prev) => prev + 1);
				}
			} else {
				setCurrentVote({ type: voteType });
				if (voteType === "UP") {
					setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
				} else {
					setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
				}
			}
		},
	});

	return (
		<div className="flex gap-1">
			<Button
				onClick={() => {
					vote({
						voteType: "UP",
					});
				}}
				size={"sm"}
				variant="ghost"
				aria-label="upvote"
				disabled={isLoading}
			>
				<ArrowBigUp
					className={cn("h-5 w-5 text-zinc-700", {
						"text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
					})}
				/>
			</Button>

			<p className="text-center py-2 font-medium text-sm text-zinc-900">
				{isLoading ? "..." : votesAmount || 0}
			</p>

			<Button
				onClick={() => {
					vote({
						voteType: "DOWN",
					});
				}}
				size={"sm"}
				variant="ghost"
				aria-label="downvote"
				disabled={isLoading}
			>
				<ArrowBigDown
					className={cn("h-5 w-5 text-zinc-700", {
						"text-red-500 fill-red-500": currentVote?.type === "DOWN",
					})}
				/>
			</Button>
		</div>
	);
};

export default CommentVotes;
