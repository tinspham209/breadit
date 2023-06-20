import { toast } from "@/hooks/use-toast";
import {
	CommentVoteRequest,
	PostCreationRequest,
	PostVoteRequest,
} from "@/lib/validators";
import { CommentRequest } from "@/lib/validators/comment";
import {
	CreateSubredditPayload,
	SubscribeToSubredditPayload,
} from "@/lib/validators/subreddit";
import { stringify } from "@/utils/api";
import config from "@/utils/config";
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

	const getPostFeed = (params: {
		limit: any;
		page: any;
		subredditName?: any;
	}) => {
		const queryString = stringify(params);
		return api.get(`/posts?${queryString}`);
	};

	const votePost = (body: PostVoteRequest) => {
		return api.patch(`/subreddit/post/vote`, { ...body });
	};

	const postComment = (body: CommentRequest) => {
		return api.patch("subreddit/post/comment", { ...body });
	};

	const voteComment = (body: CommentVoteRequest) => {
		return api.patch(`/subreddit/post/comment/vote`, { ...body });
	};

	return {
		getRoot,

		// Subreddit
		createSubreddit,
		subscribeToSubreddit,
		unsubscribeToSubreddit,
		createPostInSubreddit,
		getPostFeed,
		votePost,
		// Subreddit

		// Comment
		postComment,
		voteComment,
	};
};

export type Apis = ReturnType<typeof create>;

export default create;
