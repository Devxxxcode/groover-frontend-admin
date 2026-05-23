export const Error = ({ retry }) => {
	const handleRetry = () => {
		if (retry) {
			retry();
		} else {
			window.location.reload();
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-full text-center">
			<div className="w-full max-w-md p-2 mx-auto">
				<h1 className="text-2xl font-semibold text-red-600">
					{" "}
					Oops! Something went wrong while fetching data.
				</h1>

				<button
					onClick={handleRetry}
					className="px-6 py-2 mt-3 bg-[#EC6345] text-white rounded-md transition hover:bg-[#BA5225]"
				>
					Retry
				</button>
			</div>
		</div>
	);
};
