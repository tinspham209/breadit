import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			// 401: Error - Unauthorized
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();
		const { subredditId, title, content } = PostValidator.parse(body);

		const subscriptionExists = await db.subscription.findFirst({
			where: {
				subredditId,
				userId: session.user.id,
			},
		});

		if (!subscriptionExists) {
			return new Response("Subscribe to post.", {
				status: 400,
			});
		}

		await db.post.create({
			data: {
				title,
				content,
				authorId: session.user.id,
				subredditId,
			},
		});

		return new Response("Create post successfully", {
			status: 200,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			// 422: Error: Unprocessable Content - Make sure that the data sent in the request contains all valid fields and values beforehand.
			return new Response("Invalid request data passed.", { status: 422 });
		}

		return new Response(
			"Could not post to subreddit, please try again later.",
			{
				status: 500,
			}
		);
	}
}
