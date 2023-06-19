import { getSubredditById } from "@/app/actions";
import Editor from "@/components/editor";
import { Button } from "@/components/ui/Button";
import { notFound } from "next/navigation";
import React from "react";
interface PageProps {
	params: {
		slug: string;
	};
}

const FORM_ID = "subreddit-post-form";

const Page = async ({ params }: PageProps) => {
	const subRedditName = params.slug;

	const subreddit = await getSubredditById(subRedditName);

	if (!subreddit) return notFound();

	return (
		<div className="flex flex-col items-start gap-6">
			<div className="border-b border-gray-200 pb-5">
				<div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
					<h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
						Create Post
					</h3>
					<p className="ml-2 mt-1 truncate text-sm text-gray-500">
						in r/{subRedditName}
					</p>
				</div>
			</div>

			{/* Form */}
			<Editor formId={FORM_ID} subredditId={subreddit.id} />
			<div className="w-full flex justify-end">
				<Button type="submit" className="w-full" form={FORM_ID}>
					Post
				</Button>
			</div>
		</div>
	);
};

export default Page;
