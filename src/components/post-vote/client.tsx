"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import React from "react";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVotePost } from "@/queries/subreddit";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessageResponse } from "@/utils/error";

interface PostVoteClientProps {
	postId: string;
	initialVotesAmount: number;
	initialVote?: VoteType | null;
}

const PostVoteClient: React.FC<PostVoteClientProps> = ({
	postId,
	initialVotesAmount,
	initialVote,
}) => {
	const { loginToast } = useCustomToast();
	const { toast } = useToast();
	const [votesAmount, setVotesAmount] = React.useState(initialVotesAmount);

	const [currentVote, setCurrentVote] = React.useState(initialVote);
	const prevVote = usePrevious(currentVote);

	React.useEffect(() => {
		setCurrentVote(initialVote);
	}, [initialVote]);

	const { isLoading, vote } = useVotePost({
		postId: postId,
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
			if (currentVote === voteType) {
				setCurrentVote(undefined);
				if (voteType === "UP") {
					setVotesAmount((prev) => prev - 1);
				} else {
					setVotesAmount((prev) => prev + 1);
				}
			} else {
				setCurrentVote(voteType);
				if (voteType === "UP") {
					setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
				} else {
					setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
				}
			}
		},
	});

	return (
		<div className="flex flex-col gap-2 sm:gap-0 sm:w-20 pb-4 sm:pb-0 pr-3 sm:pr-6">
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
						"text-emerald-500 fill-emerald-500": currentVote === "UP",
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
						"text-red-500 fill-red-500": currentVote === "DOWN",
					})}
				/>
			</Button>
		</div>
	);
};

export default PostVoteClient;
