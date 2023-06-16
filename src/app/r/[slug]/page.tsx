import React from "react";

interface PageProps {
	params: {
		slug: string;
	};
}

const Page: React.FC<PageProps> = ({ params }) => {
	const { slug } = params;

	return <div>Page</div>;
};

export default Page;
