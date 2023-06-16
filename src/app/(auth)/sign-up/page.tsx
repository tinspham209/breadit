import SignUp from "@/components/SignUp";
import React from "react";
import AuthLayout from "../authLayout";
interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
	return (
		<AuthLayout>
			<SignUp />
		</AuthLayout>
	);
};

export default Page;
