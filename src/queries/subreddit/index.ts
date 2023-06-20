import {
	CreateSubredditPayload,
	SubscribeToSubredditPayload,
} from "@/lib/validators/subreddit";
import {
	useInfiniteQuery,
	useMutation,
	UseMutationOptions,
	UseQueryOptions,
} from "@tanstack/react-query";
import apiClient from "../apiClient";
import { PostCreationRequest, PostVoteRequest } from "@/lib/validators";
import { useState } from "react";
import { ExtendedPost, GetPropertiesParams } from "@/types/db";
import config from "@/utils/config";

export function useCreateSubreddit(
	options?: UseMutationOptions<any, Error, CreateSubredditPayload>
) {
	const { mutate: createSubreddit, isLoading } = useMutation<
		any,
		Error,
		CreateSubredditPayload
	>({
		mutationFn: async (payload: CreateSubredditPayload) => {
			const { data } = await apiClient.createSubreddit(payload);

			return data as string;
		},
		...options,
	});

	return {
		createSubreddit,
		isLoading,
	};
}

export function useSubscribeToSubreddit(
	options?: UseMutationOptions<any, Error, SubscribeToSubredditPayload>
) {
	const { mutate: subscribeToSubreddit, isLoading } = useMutation<
		any,
		Error,
		SubscribeToSubredditPayload
	>({
		mutationFn: async (payload: SubscribeToSubredditPayload) => {
			const { data } = await apiClient.subscribeToSubreddit(payload);

			return data as string;
		},
		...options,
	});

	return {
		subscribeToSubreddit,
		isLoading,
	};
}

export function useUnSubscribeToSubreddit(
	options?: UseMutationOptions<any, Error, SubscribeToSubredditPayload>
) {
	const { mutate: unsubscribeToSubreddit, isLoading } = useMutation<
		any,
		Error,
		SubscribeToSubredditPayload
	>({
		mutationFn: async (payload: SubscribeToSubredditPayload) => {
			const { data } = await apiClient.unsubscribeToSubreddit(payload);

			return data as string;
		},
		...options,
	});

	return {
		unsubscribeToSubreddit,
		isLoading,
	};
}

export function useCreatePostInSubreddit(
	options?: UseMutationOptions<any, Error, PostCreationRequest>
) {
	const { mutate: createPostInSubreddit, isLoading } = useMutation<
		any,
		Error,
		PostCreationRequest
	>({
		mutationFn: async (payload: PostCreationRequest) => {
			const { data } = await apiClient.createPostInSubreddit(payload);

			return data;
		},
		...options,
	});

	return {
		createPostInSubreddit,
		isLoading,
	};
}

export function useGetPostFeed(
	options: UseQueryOptions<any, Error> & {
		subredditName: string | undefined | null;
		initialPosts: ExtendedPost[];
	}
) {
	const { data, isLoading, fetchNextPage, isFetchingNextPage } =
		useInfiniteQuery(
			["post-feed-infinite-query"],
			async ({ pageParam = 1 }) => {
				const { data } = await apiClient.getPostFeed({
					limit: config.INFINITE_SCROLLING_PAGINATION_RESULTS,
					page: pageParam,
					subredditName: options.subredditName,
				});
				return data as ExtendedPost[];
			},
			{
				getNextPageParam: (_, pages) => {
					return pages.length + 1;
				},
				initialData: { pages: [options.initialPosts], pageParams: [1] },
			}
		);

	return { data, isLoading, fetchNextPage, isFetchingNextPage };
}

export function useVotePost(
	options: UseMutationOptions<
		any,
		Error,
		{ voteType: PostVoteRequest["voteType"] }
	> & {
		postId: string;
	}
) {
	const { mutate: vote, isLoading } = useMutation<
		any,
		Error,
		{ voteType: PostVoteRequest["voteType"] }
	>({
		mutationFn: async (payload: { voteType: PostVoteRequest["voteType"] }) => {
			const formatPayload = {
				postId: options.postId,
				voteType: payload.voteType,
			};
			const { data } = await apiClient.votePost(formatPayload);

			return data;
		},
		...options,
	});

	return {
		vote,
		isLoading,
	};
}
