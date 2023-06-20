"use client";

import React from "react";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { usePostComment } from "@/queries/comments";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { getErrorMessageResponse } from "@/utils/error";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
	postId: string;
	replyToId?: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId, replyToId }) => {
	const [input, setInput] = React.useState("");
	const { toast } = useToast();
	const { loginToast } = useCustomToast();
	const router = useRouter();

	const { postComment, isLoading } = usePostComment({
		onSuccess(data) {
			router.refresh();
			setInput("");
		},
		onError(error) {
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
	});

	return (
		<div className="grid w-full gap-1.5">
			<Label htmlFor="comment">Your comment</Label>
			<div className="mt-2">
				<Textarea
					id="comment"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					rows={1}
					placeholder="What are your throughts?"
				/>

				<div className="mt-2 flex justify-end">
					<Button
						isLoading={isLoading}
						disabled={input.length === 0}
						onClick={() => {
							postComment({
								postId,
								text: input,
								replyToId,
							});
						}}
					>
						Post
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CreateComment;
