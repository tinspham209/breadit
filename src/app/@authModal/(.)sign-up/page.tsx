import SignUp from "@/components/SignUp";
import React from "react";
import AuthModalLayout from "../authModalLayout";
interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
	return (
		<AuthModalLayout>
			<SignUp />
		</AuthModalLayout>
	);
};

export default page;
