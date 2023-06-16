import { CreateSubredditPayload } from "@/lib/validators/subreddit";
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
