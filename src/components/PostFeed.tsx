"use client";

import { ExtendedPost } from "@/types/db";
import React from "react";
import { useIntersection } from "@mantine/hooks";
import { useGetPostFeed } from "@/queries/subreddit";
import { useSession } from "next-auth/react";
import Post from "./Post";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
	initialPosts: ExtendedPost[];
	subredditName?: string;
}

const PostFeed: React.FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
	const lastPostRef = React.useRef<HTMLElement>(null);

	const { entry, ref } = useIntersection({
		root: lastPostRef.current,
		threshold: 1,
	});

	const { data: session } = useSession();

	const { data, isLoading, fetchNextPage, isFetchingNextPage } = useGetPostFeed(
		{
			subredditName: subredditName,
			initialPosts: initialPosts,
		}
	);

	React.useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage();
		}
	}, [entry, fetchNextPage]);

	const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

	return (
		<ul className="flex flex-col col-span-2 space-y-6">
			{posts.map((post, index) => {
				const votesAmount = post.votes.reduce((acc, vote) => {
					if (vote.type === "UP") return acc + 1;
					if (vote.type === "DOWN") return acc - 1;
					return acc;
				}, 0);

				const currentVote = post.votes.find(
					(vote) => vote.userId === session?.user.id
				);

				if (index === posts.length - 1) {
					return (
						<li key={`${post.id}-${index}`} ref={ref}>
							<Post
								subredditName={post.subreddit.name}
								post={post}
								commentAmount={post.comments.length}
								currentVote={currentVote}
								votesAmt={votesAmount}
							/>
						</li>
					);
				} else {
					return (
						<Post
							key={`${post.id}-${index}`}
							subredditName={post.subreddit.name}
							post={post}
							commentAmount={post.comments.length}
							currentVote={currentVote}
							votesAmt={votesAmount}
						/>
					);
				}
			})}
			{isFetchingNextPage ? (
				<div className="flex flex-row justify-center">
					<Loader2 className="w-8 h-8 animate-spin" />
				</div>
			) : null}
		</ul>
	);
};

export default PostFeed;
