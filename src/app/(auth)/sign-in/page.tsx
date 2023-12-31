import SignIn from "@/components/SignIn";
import React from "react";
import AuthLayout from "../authLayout";
interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
	return (
		<AuthLayout>
			<SignIn />
		</AuthLayout>
	);
};

export default Page;
