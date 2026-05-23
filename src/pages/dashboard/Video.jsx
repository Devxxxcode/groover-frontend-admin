import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "sonner";
import { validateForm } from "../../helpers/validate-form";
import { convertToFormData } from "../../helpers/convert-to-form-data";
import { ENDPOINT } from "../../constants/endpoint";
import { invalidateRequestTag } from "../../services/api/invalidate-request-tag";
import {
	useGetRequestQuery,
	usePostRequestMutation,
} from "../../services/api/request";
import { Loading } from "../../components/loading";

const Video = () => {
	const [video, setVideo] = useState(null);

	const { data, isLoading } = useGetRequestQuery({
		url: ENDPOINT.GET_SETTINGS,
	});

	useEffect(() => {
		if (data) {
			setVideo(data?.data?.video);
		}
	}, [data]);

	const [patchVideo, { isLoading: isUpdatingVideo }] = usePostRequestMutation();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const formValue = { video };
			const isValidForm = validateForm(formValue);
			if (!isValidForm) return;

			const formData = convertToFormData(formValue);
			const res = await patchVideo({
				url: ENDPOINT.POST_VIDEO,
				body: formData,
			}).unwrap();

			toast.success(res?.message);
			invalidateRequestTag(ENDPOINT.GET_SETTINGS);
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) return <Loading />;

	return (
		<div className="space-y-5">
			<div>
				<h1 className="text-2xl font-semibold text-[#333333]">Hero Video</h1>
				<p className="text-sm text-[#333333]/60">
					Upload and manage the current platform intro video.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="rounded-2xl border border-[#EC6345]/20 bg-white p-4 md:p-6"
			>
				<label className="text-sm font-medium text-[#333333]/80">Video File</label>

				{video && (
					<div className="mt-3 overflow-hidden rounded-xl border border-[#EC6345]/20 bg-[#F7F6F0]">
						<video
							src={video instanceof File ? URL.createObjectURL(video) : video}
							controls
							className="max-h-[420px] w-full object-contain"
						>
							Your browser does not support the video tag.
						</video>
					</div>
				)}

				<input
					type="file"
					accept="video/*"
					className="mt-4 block h-[48px] w-full cursor-pointer rounded-xl border border-[#EC6345]/20 bg-white px-3 text-[16px] text-[#333333] file:mr-4 file:rounded-lg file:border-0 file:bg-[#EC6345] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
					onChange={(e) => setVideo(e.target.files?.[0] || null)}
				/>

				<div className="mt-6 flex justify-end">
					<button
						type="submit"
						disabled={isUpdatingVideo}
						className="inline-flex items-center gap-2 rounded-xl border border-[#EC6345]/45 bg-[#EC6345] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isUpdatingVideo && <AiOutlineLoading className="animate-spin" />}
						Save Video
					</button>
				</div>
			</form>
		</div>
	);
};

export default Video;
