"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useToast } from "@/hooks/use-toast";
import { useCreateSubreddit } from "@/queries/subreddit";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

interface pageProps {}

const Page: React.FC<pageProps> = ({}) => {
	const router = useRouter();
	const [input, setInput] = React.useState<string>("");
	const { toast } = useToast();
	const { loginToast } = useCustomToast();
	const { createSubreddit, isLoading } = useCreateSubreddit({
		onSuccess(data) {
			toast({
				title: `Create community [${data}] successfully!`,
			});
			router.push(`/r/${data}`);
		},
		onError(error) {
			if (error instanceof AxiosError) {
				toast({
					title: `Error when create community`,
					description: `${
						error.response?.data[0]?.message || error.response?.data
					}`,
					variant: "destructive",
				});
			} else {
				toast({
					title: "Something went wrong",
					description: `Please try again`,
					variant: "destructive",
				});
			}
		},
	});

	const handleCreateSubreddit = (value: string) => {
		createSubreddit({
			name: value,
		});
	};

	return (
		<div className="container flex items-center h-full max-w-3xl mx-auto">
			<div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-semibold">Create a community</h1>
				</div>

				<hr className="bg-zinc-500 h-px" />

				<div className="">
					<p className="text-lg font-medium">Name</p>
					<p className="text-xs pb-2">
						Community names including capitalization cannot be changed
					</p>

					<div className="relative">
						<p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
							r/
						</p>

						<Input
							value={input}
							onChange={(e) => {
								setInput(e.target.value);
							}}
							className="pl-6"
						/>
					</div>
				</div>

				<div className="flex justify-end gap-4">
					<Button
						variant={"subtle"}
						onClick={() => {
							router.back();
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							handleCreateSubreddit(input);
						}}
						isLoading={isLoading}
						disabled={input.length === 0}
					>
						Create Community
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Page;
