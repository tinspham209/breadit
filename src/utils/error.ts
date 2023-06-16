import { AxiosError } from "axios";

export const getErrorMessageResponse = (error: any) => {
	if (error instanceof AxiosError) {
		return error.response?.data[0]?.message || error.response?.data;
	} else {
		return error.response?.data;
	}
};
