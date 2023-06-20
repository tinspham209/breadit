import { getCachedPostDetail, getPostDetail } from "@/app/actions";
import EditorOutput from "@/components/editor/output";
import PostVoteServer from "@/components/post-vote/server";
import { buttonVariants } from "@/components/ui/Button";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

interface PageProps {
	params: {
		postId: string;
	};
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const Page = async ({ params }: PageProps) => {
	const { postId } = params;
	const cachedPosts = await getCachedPostDetail(postId);

	let post: (Post & { votes: Vote[]; author: User }) | null = null;

	if (!cachedPosts) {
		post = await getPostDetail(postId);
	}

	if (!post && !cachedPosts) return notFound();

	return (
		<div>
			<div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
				<Suspense fallback={<PostVoteShell />}>
					{/* @ts-expect-error Server Component */}
					<PostVoteServer
						postId={post?.id ?? cachedPosts.id}
						getData={async () => {
							return await getPostDetail(postId, { needAuthor: false });
						}}
					/>
				</Suspense>

				<div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
					<p className="max-h-40 mt-1 truncate text-xs text-gray-500">
						Posted by u/{post?.author.username ?? cachedPosts.authorUsername} •{" "}
						{formatTimeToNow(
							new Date(post?.createdAt ?? cachedPosts.createdAt)
						)}
					</p>
					<h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
						{post?.title ?? cachedPosts?.title}
					</h1>

					<EditorOutput content={post?.content ?? cachedPosts?.content} />
				</div>
			</div>
		</div>
	);
};

function PostVoteShell() {
	return (
		<div className="flex items-center flex-col pr-6 w-20">
			{/* up vote */}
			<div
				className={buttonVariants({
					variant: "ghost",
				})}
			>
				<ArrowBigUp className="h-5 w-5 text-zinc-700" />
			</div>

			{/* score */}
			<div className="text-center py-2 font-medium text-sm text-zinc-900">
				<Loader2 className="h-3 w-3 animate-spin" />
			</div>

			{/* down vote */}
			<div
				className={buttonVariants({
					variant: "ghost",
				})}
			>
				<ArrowBigDown className="h-5 w-5 text-zinc-700" />
			</div>
		</div>
	);
}

export default Page;
