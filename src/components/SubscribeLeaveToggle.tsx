"use client";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useToast } from "@/hooks/use-toast";
import {
	useSubscribeToSubreddit,
	useUnSubscribeToSubreddit,
} from "@/queries/subreddit";
import { getErrorMessageResponse } from "@/utils/error";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";
import { Button } from "./ui/Button";

interface SubscribeLeaveToggleProps {
	subredditId: string;
	subredditName: string;
	isSubscribed: boolean;
}

const SubscribeLeaveToggle: React.FC<SubscribeLeaveToggleProps> = ({
	subredditId,
	subredditName,
	isSubscribed,
}) => {
	const { toast } = useToast();
	const { loginToast } = useCustomToast();
	const router = useRouter();

	const { subscribeToSubreddit, isLoading: isLoadingSubscribe } =
		useSubscribeToSubreddit({
			onSuccess(data) {
				startTransition(() => {
					router.refresh();
				});
				return toast({
					title: "Subscribed",
					description: `You are now subscribe to r/${subredditName}`,
				});
			},
			onError(error) {
				if (error instanceof AxiosError) {
					if (error.response?.status === 401) {
						return loginToast();
					} else {
						toast({
							title: `There was a problem`,
							description: `${getErrorMessageResponse(error)}`,
							variant: "destructive",
						});
					}
				} else {
					toast({
						title: "Something went wrong",
						description: `Please try again`,
						variant: "destructive",
					});
				}
			},
		});

	const { unsubscribeToSubreddit, isLoading: isLoadingUnSubscribe } =
		useUnSubscribeToSubreddit({
			onSuccess(data) {
				startTransition(() => {
					router.refresh();
				});
				return toast({
					title: "Unsubscribed",
					description: `You are now unsubscribe to r/${subredditName}`,
				});
			},
			onError(error) {
				if (error instanceof AxiosError) {
					if (error.response?.status === 401) {
						return loginToast();
					} else {
						toast({
							title: `There was a problem`,
							description: `${getErrorMessageResponse(error)}`,
							variant: "destructive",
						});
					}
				} else {
					toast({
						title: "Something went wrong",
						description: `Please try again`,
						variant: "destructive",
					});
				}
			},
		});

	const isLoading = React.useMemo(() => {
		return isLoadingSubscribe || isLoadingUnSubscribe;
	}, [isLoadingSubscribe, isLoadingUnSubscribe]);

	return isSubscribed ? (
		<Button
			className="w-full mt-1 mb-4"
			onClick={() => {
				unsubscribeToSubreddit({
					subredditId,
				});
			}}
			isLoading={isLoading}
		>
			Leave community
		</Button>
	) : (
		<Button
			className="w-full mt-1 mb-4"
			onClick={() => {
				subscribeToSubreddit({
					subredditId,
				});
			}}
			isLoading={isLoading}
		>
			Join to post
		</Button>
	);
};

export default SubscribeLeaveToggle;
