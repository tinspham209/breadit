import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

interface authLayoutProps {
	children: React.ReactNode;
}

const authLayout: React.FC<authLayoutProps> = ({ children }) => {
	return (
		<div className="absolute inset-0">
			<div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
				<Link
					href="/"
					className={cn(
						buttonVariants({ variant: "ghost" }),
						"self-start -mt-20"
					)}
				>
					<ChevronLeft className="mr-2 h-4 w-4" /> Home
				</Link>

				{children}
			</div>
		</div>
	);
};

export default authLayout;
