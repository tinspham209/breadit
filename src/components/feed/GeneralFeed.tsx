import { getGeneralPost } from "@/app/actions";
import React from "react";
import PostFeed from "../PostFeed";

interface GeneralFeedProps {}

const GeneralFeed = async ({}: GeneralFeedProps) => {
	const posts = await getGeneralPost();
	return <PostFeed initialPosts={posts} />;
};

export default GeneralFeed;
