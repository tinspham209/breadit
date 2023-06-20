import { getCustomPost } from "@/app/actions/post";
import React from "react";
import PostFeed from "../PostFeed";
import { getAuthSession } from "@/lib/auth";

interface CustomFeedProps {}

const CustomFeed = async ({}: CustomFeedProps) => {
	const posts = await getCustomPost();

	return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
