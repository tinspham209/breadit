import { CommentRequest } from "@/lib/validators/comment";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { CommentVoteRequest } from "@/lib/validators";

export function usePostComment(
	options: UseMutationOptions<any, Error, CommentRequest>
) {
	const { mutate: postComment, isLoading } = useMutation<
		any,
		Error,
		CommentRequest
	>({
		mutationFn: async (payload: CommentRequest) => {
			const { data } = await apiClient.postComment(payload);

			return data;
		},
		...options,
	});

	return {
		postComment,
		isLoading,
	};
}

export function useVoteComment(
	options: UseMutationOptions<
		any,
		Error,
		{ voteType: CommentVoteRequest["voteType"] }
	> & {
		commentId: string;
	}
) {
	const { mutate: vote, isLoading } = useMutation<
		any,
		Error,
		{ voteType: CommentVoteRequest["voteType"] }
	>({
		mutationFn: async (payload: {
			voteType: CommentVoteRequest["voteType"];
		}) => {
			const formatPayload = {
				commentId: options.commentId,
				voteType: payload.voteType,
			};
			const { data } = await apiClient.voteComment(formatPayload);

			return data;
		},
		...options,
	});

	return {
		vote,
		isLoading,
	};
}

export function useReplyToComment(
	options: UseMutationOptions<any, Error, CommentRequest>
) {
	const { mutate: replyToComment, isLoading } = useMutation<
		any,
		Error,
		CommentRequest
	>({
		mutationFn: async (payload: CommentRequest) => {
			const { data } = await apiClient.postComment(payload);

			return data;
		},
		...options,
	});

	return {
		replyToComment,
		isLoading,
	};
}
