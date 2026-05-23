import { motion } from "framer-motion";

export const Loading = ({ className = "", fullPage = true }) => {
	const ballTransition = {
		duration: 0.65,
		repeat: Infinity,
		repeatType: "reverse",
		ease: "easeInOut",
	};

	return (
		<div
			className={`flex w-full flex-col items-center justify-center ${
				fullPage ? "min-h-[60vh]" : ""
			} ${className}`}
		>
			<div className="flex items-end gap-3">
				<motion.span
					animate={{ y: [-6, -24] }}
					transition={{ ...ballTransition, delay: 0 }}
					className="h-5 w-5 rounded-full bg-[#EC6345]"
				/>
				<motion.span
					animate={{ y: [-6, -24] }}
					transition={{ ...ballTransition, delay: 0.12 }}
					className="h-5 w-5 rounded-full bg-[#ff7f55]"
				/>
				<motion.span
					animate={{ y: [-6, -24] }}
					transition={{ ...ballTransition, delay: 0.24 }}
					className="h-5 w-5 rounded-full bg-[#d6b2f5]"
				/>
			</div>
		</div>
	);
};
