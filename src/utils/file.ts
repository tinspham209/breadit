import Compressor from "compressorjs";

export const compressFile = (file: File): Promise<File> => {
	return new Promise((resolve, reject) => {
		const isImage = [
			"image/jpg",
			"image/jpeg",
			"image/png",
			"image/webp",
		].includes(file?.type);

		if (isImage) {
			new Compressor(file, {
				quality: 0.7,
				maxWidth: 1080,
				maxHeight: 1080,
				convertSize: 0,
				success(result: File) {
					resolve(result);
				},
				error(err: Error) {
					reject(err);
				},
			});
		} else {
			resolve(file);
		}
	});
};
