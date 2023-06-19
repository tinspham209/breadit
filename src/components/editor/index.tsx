"use client";

import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJSType from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { compressFile } from "@/utils/file";
import { useToast } from "@/hooks/use-toast";
import { useCreatePostInSubreddit } from "@/queries/subreddit";
import { usePathname, useRouter } from "next/navigation";
interface EditorProps {
	formId: string;
	title?: string;
	subredditId: string;
}

const Editor: React.FC<EditorProps> = ({
	formId,
	title = "Title",
	subredditId,
}) => {
	const ref = React.useRef<EditorJSType>();
	const [isMounted, setIsMounted] = React.useState(false);
	const { toast } = useToast();
	const pathname = usePathname();
	const router = useRouter();

	React.useLayoutEffect(() => {
		if (typeof window !== undefined) {
			setIsMounted(true);
		}
	}, []);

	const initializeEditor = React.useCallback(async () => {
		const EditorJS = (await import("@editorjs/editorjs")).default;
		const Header = (await import("@editorjs/header")).default;
		const Embed = (await import("@editorjs/embed")).default;
		const Table = (await import("@editorjs/table")).default;
		const List = (await import("@editorjs/list")).default;
		const Code = (await import("@editorjs/code")).default;
		const LinkTool = (await import("@editorjs/link")).default;
		const InlineCode = (await import("@editorjs/inline-code")).default;
		const ImageTool = (await import("@editorjs/image")).default;

		if (!ref.current) {
			const editor = new EditorJS({
				holder: "editor",
				onReady() {
					ref.current = editor;
				},
				placeholder: "Type here to write your post...",
				inlineToolbar: true,
				data: {
					blocks: [],
				},
				tools: {
					header: Header,
					linkTool: {
						class: LinkTool,
						config: {
							endpoint: "/api/link",
						},
					},
					image: {
						class: ImageTool,
						config: {
							uploader: {
								async uploadByFile(file: File) {
									const compress = await compressFile(file);
									const [res] = await uploadFiles([compress], "imageUploader");

									return {
										success: 1,
										file: {
											url: res.fileUrl,
										},
									};
								},
							},
						},
					},
					list: List,
					code: Code,
					inlineCode: InlineCode,
					table: Table,
					embed: Embed,
				},
			});
		}
	}, []);

	React.useEffect(() => {
		const init = async () => {
			await initializeEditor();
		};

		setTimeout(() => {
			// set focus to title
			_titleRef.current?.focus();
		}, 0);

		if (isMounted) {
			init();

			return () => {
				ref.current?.destroy();
				ref.current = undefined;
			};
		}
	}, [isMounted, initializeEditor]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PostCreationRequest>({
		resolver: zodResolver(PostValidator),
		defaultValues: {
			subredditId: subredditId,
			title: "",
			content: null,
		},
	});

	const _titleRef = React.useRef<HTMLTextAreaElement>(null);

	React.useEffect(() => {
		if (Object.keys(errors).length) {
			for (const [_key, value] of Object.entries(errors)) {
				toast({
					title: "Something went wrong",
					description: (value as { message: string }).message,
					variant: "destructive",
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [errors]);

	const onSubmit = async (data: PostCreationRequest) => {
		toast({
			title: "Uploading...",
			description: "Please wait a minute",
		});
		const blocks = await ref.current?.save();

		const payload: PostCreationRequest = {
			title: data.title,
			content: blocks,
			subredditId,
		};

		createPostInSubreddit(payload);
	};

	const { createPostInSubreddit, isLoading: isLoadingCreatePost } =
		useCreatePostInSubreddit({
			onSuccess(data) {
				// /r/test/submit >> /r/test
				const newPathname = pathname.split("/").slice(0, -1).join("/");

				router.push(newPathname);

				router.refresh();

				return toast({
					description: "Your post has been published.",
				});
			},
			onError(error) {
				toast({
					title: "Something went wrong",
					description: "Your post was not published, please try again later",
				});
			},
		});

	const { ref: titleRef, ...rest } = register("title");

	const isLoading = React.useMemo(() => {
		return isLoadingCreatePost;
	}, [isLoadingCreatePost]);

	return (
		<div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
			<form id={formId} className="w-fit" onSubmit={handleSubmit(onSubmit)}>
				<div className="prose prose-stone dark:prose-invert">
					<TextareaAutosize
						ref={(e) => {
							titleRef(e);

							// @ts-ignore
							_titleRef.current = e;
						}}
						{...rest}
						placeholder={title}
						disabled={isLoading}
						className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
					/>

					<div id="editor" className="min-h-[500px]" />
				</div>
			</form>
		</div>
	);
};

export default Editor;
