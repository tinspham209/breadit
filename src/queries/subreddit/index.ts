import {
	CreateSubredditPayload,
	SubscribeToSubredditPayload,
} from "@/lib/validators/subreddit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import apiClient from "../apiClient";

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
