import { getSubredditAllContent } from "@/app/actions";
import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

interface PageProps {
	params: {
		slug: string;
	};
}

const Page = async ({ params }: PageProps) => {
	const { slug } = params;

	const session = await getAuthSession();

	const subreddit = await getSubredditAllContent(slug);

	if (!subreddit) return notFound();

	return (
		<>
			<h1 className="font-bold text-3xl md:text-4xl h-14">
				r/{subreddit.name}
			</h1>

			<MiniCreatePost session={session} />

			{/* TODO: show posts in user feed */}
			<PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
		</>
	);
};

export default Page;
