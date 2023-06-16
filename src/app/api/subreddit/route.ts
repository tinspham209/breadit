import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			// 401: Error - Unauthorized
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();
		const { name } = SubredditValidator.parse(body);

		const subredditExists = await db.subreddit.findFirst({
			where: {
				name,
			},
		});

		if (subredditExists) {
			// 409: Error: Conflict
			return new Response(
				"Subreddit already exists, Please choose a different subreddit name",
				{ status: 409 }
			);
		}

		const subreddit = await db.subreddit.create({
			data: {
				name,
				creatorId: session.user.id,
			},
		});

		await db.subscription.create({
			data: {
				userId: session.user.id,
				subredditId: subreddit.id,
			},
		});

		return new Response(subreddit.name);
	} catch (error) {
		if (error instanceof z.ZodError) {
			// 422: Error: Unprocessable Content - Make sure that the data sent in the request contains all valid fields and values beforehand.
			return new Response(error.message, { status: 422 });
		}

		return new Response("Could not create subreddit", { status: 500 });
	}
}
