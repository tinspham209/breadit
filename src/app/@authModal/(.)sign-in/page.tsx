import SignIn from "@/components/SignIn";
import React from "react";
import AuthModalLayout from "../authModalLayout";
interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
	return (
		<AuthModalLayout>
			<SignIn />
		</AuthModalLayout>
	);
};

export default page;
