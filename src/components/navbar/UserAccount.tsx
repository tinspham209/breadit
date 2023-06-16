"use client";

import { Loader2 } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import UserAvatar from "./UserAvatar";
import { useToast } from "@/hooks/use-toast";

interface UserAccountProps {
	user: Pick<User, "name" | "image" | "email">;
}

const UserAccount: React.FC<UserAccountProps> = ({ user }) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const { toast } = useToast();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<UserAvatar
					className="h-8 w-8"
					user={{
						name: user.name || null,
						image: user.image || null,
					}}
				/>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="bg-white" align="end">
				<div className="flex items-center justify-start gap-2 p-2">
					<div className="flex flex-col space-y-1 leading-none">
						{user.name && <p className="font-medium">{user.name}</p>}
						{user.email && (
							<p className="w-[200px] truncate text-sm text-zinc-700">
								{user.email}
							</p>
						)}
					</div>
				</div>
				<DropdownMenuSeparator />
				{[
					{ href: "/", title: "Feed" },
					{ href: "/r/create", title: "Create community" },
					{ href: "/settings", title: "Settings" },
				].map((item, index) => (
					<DropdownMenuItem
						asChild
						key={`${item.title}-${index}`}
						className="cursor-pointer"
					>
						<Link href={item.href}>{item.title}</Link>
					</DropdownMenuItem>
				))}

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onSelect={(event) => {
						event.preventDefault();
						setIsLoading(true);
						signOut({
							callbackUrl: `${window.location.origin}/sign-in`,
						}).then(() => {
							setIsLoading(false);
							toast({
								title: "Sign Out successfully",
							});
						});
					}}
					className="cursor-pointer"
				>
					{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAccount;
