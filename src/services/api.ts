import { toast } from "@/hooks/use-toast";
import { PostCreationRequest } from "@/lib/validators";
import {
	CreateSubredditPayload,
	SubscribeToSubredditPayload,
} from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";

const AXIOS_CONFIG = {
	CONNECTION_TIMEOUT: 30000,
};

axios.defaults.withCredentials = true;

const create = (baseURL = "/api") => {
	const api = axios.create({
		baseURL,
		headers: {
			"Cache-Control": "no-cache",
			Pragma: "no-cache",
			Expires: 0,
			Accept: "application/json",
		},
		timeout: AXIOS_CONFIG.CONNECTION_TIMEOUT,
	});

	api.interceptors.request.use((config) => {
		return Promise.resolve(config);
	});

	api.interceptors.response.use(
		(response) => {
			return response;
		},
		async (error) => {
			if (error instanceof AxiosError) {
				if (error.response?.status === 404) {
					return toast({
						title: `This API doesn't exists`,
						description: "Please check the API route again.",
						variant: "destructive",
					});
				}
			}
			return Promise.reject(error);
		}
	);

	const getRoot = () => api.get("");

	const createSubreddit = (body: CreateSubredditPayload) => {
		return api.post("/subreddit", { ...body });
	};

	const subscribeToSubreddit = (body: SubscribeToSubredditPayload) => {
		return api.post("/subreddit/subscribe", { ...body });
	};

	const unsubscribeToSubreddit = (body: SubscribeToSubredditPayload) => {
		return api.post("/subreddit/unsubscribe", { ...body });
	};

	const createPostInSubreddit = (body: PostCreationRequest) => {
		return api.post("/subreddit/post/create", { ...body });
	};

	return {
		getRoot,

		// Subreddit
		createSubreddit,
		subscribeToSubreddit,
		unsubscribeToSubreddit,
		createPostInSubreddit,
		// Subreddit
	};
};

export type Apis = ReturnType<typeof create>;

export default create;
