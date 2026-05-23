import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { motion } from "framer-motion";
import { AiOutlineLoading } from "react-icons/ai";
import moment from "moment";
import { useNotification } from "../../hooks/use-notification";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";

const Notification = () => {
	const { notifications, handleMarkAsRead, markingAsRead } = useNotification();
	const [active, setActive] = useState(null);

	if (notifications.isLoading) return <Loading />;
	if (notifications.isError) return <Error />;

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<button
					onClick={() => window.history.back()}
					className="inline-flex items-center gap-2 rounded-xl border border-[#EC6345]/20 bg-white px-3 py-2 text-sm font-medium text-[#333333]/80 transition hover:border-[#EC6345]/45 hover:text-[#EC6345]"
				>
					<GoArrowLeft className="text-lg" />
					Back
				</button>
				<p className="text-sm text-[#333333]/60">
					{notifications?.data?.length || 0} Notification(s)
				</p>
			</div>

			<div className="rounded-2xl border border-[#EC6345]/20 bg-white p-4">
				<h2 className="text-lg font-semibold text-[#333333]">Notifications</h2>
				<p className="text-sm text-[#333333]/55">
					Track unread alerts and updates.
				</p>

				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35 }}
					className="mt-4 space-y-3"
				>
					{notifications?.data?.length > 0 &&
						notifications.data.map((notif) => (
							<div
								key={notif.id}
								className={`rounded-xl border p-4 transition ${
									notif.is_read
										? "border-[#EC6345]/15 bg-white"
										: "border-[#EC6345]/35 bg-[#EC6345]/[0.08]"
								}`}
							>
								<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div>
										<p className="text-sm text-[#333333]/90">{notif.message}</p>
										<p className="mt-1 text-xs text-[#333333]/50">
											{moment(notif?.created_at).fromNow()}
										</p>
										{!notif.is_read && (
											<p className="mt-1 text-xs font-semibold text-[#EC6345]">
												Unread
											</p>
										)}
									</div>

									{!notif.is_read && (
										<button
											disabled={markingAsRead && active === notif.id}
											onClick={() => {
												setActive(notif.id);
												handleMarkAsRead(notif.id);
											}}
											className="inline-flex items-center gap-2 rounded-lg border border-[#EC6345]/45 bg-[#EC6345] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
										>
											{markingAsRead && active === notif.id && (
												<AiOutlineLoading className="animate-spin" />
											)}
											Mark as read
										</button>
									)}
								</div>
							</div>
						))}

					{notifications?.data?.length === 0 && (
						<div className="grid min-h-40 place-items-center">
							<p className="max-w-sm text-center text-sm text-[#333333]/50">
								You don&apos;t have any notifications at the moment. Stay tuned
								for updates.
							</p>
						</div>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default Notification;
