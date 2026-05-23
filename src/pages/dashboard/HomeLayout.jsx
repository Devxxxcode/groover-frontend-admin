import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useOutlet } from "react-router-dom";
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { FiLogOut, FiUser } from "react-icons/fi";
import { GiEgyptianProfile } from "react-icons/gi";
import { BiBell, BiChevronDown } from "react-icons/bi";
import { AiOutlineLoading } from "react-icons/ai";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import moment from "moment";
import SideBarWeb from "./components/SideBarWeb";
import { fadeIn } from "../../motion";
import { handleLogout } from "../../helpers/handle-logout";
import { useNotification } from "../../hooks/use-notification";

const HomeLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const outlet = useOutlet();
	const { user } = useSelector((state) => state.userSlice);

	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [isNotificationVisible, setIsNotificationVisible] = useState(false);
	const [isProfileImageBroken, setIsProfileImageBroken] = useState(false);

	const { notifications, handleMarkAllAsRead, markingAllAsRead } =
		useNotification();

	const unreadCount = useMemo(
		() => notifications?.data?.filter((item) => !item?.is_read).length || 0,
		[notifications?.data],
	);

	const goToProfile = () => {
		navigate("/home/profile");
		setIsDropdownVisible(false);
	};

	const handleNotificationClick = () => {
		setIsNotificationVisible(false);
		navigate("/home/notifications");
	};

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (!event.target.closest(".admin-dropdown") && isDropdownVisible) {
				setIsDropdownVisible(false);
			}
			if (
				!event.target.closest(".admin-notification") &&
				isNotificationVisible
			) {
				setIsNotificationVisible(false);
			}
		};

		document.addEventListener("click", handleOutsideClick);
		return () => document.removeEventListener("click", handleOutsideClick);
	}, [isDropdownVisible, isNotificationVisible]);

	useEffect(() => {
		// Reset floating UI states whenever route changes.
		setIsDropdownVisible(false);
		setIsNotificationVisible(false);
		setIsSidebarOpenOnMobile(false);
	}, [location.pathname]);

	useEffect(() => {
		setIsProfileImageBroken(false);
	}, [user?.profile_picture]);

	useEffect(() => {
		document.body.classList.add("admin-dashboard-theme");
		return () => {
			document.body.classList.remove("admin-dashboard-theme");
		};
	}, []);

	return (
		<div className="flex h-screen bg-[#F7F6F0] text-[#333333]">
			<div
				className={`hidden md:block transition-[width] duration-300 ease-in-out ${isSidebarCollapsed ? "w-20" : "w-[288px]"}`}
			>
				<SideBarWeb isCollapsed={isSidebarCollapsed} />
			</div>

			<div
				className={`fixed inset-y-0 left-0 z-50 w-[288px] transform transition-transform duration-300 md:hidden ${isSidebarOpenOnMobile ? "translate-x-0" : "-translate-x-full"}`}
			>
				<SideBarWeb
					isCollapsed={false}
					closeSidebar={() => setIsSidebarOpenOnMobile(false)}
				/>
			</div>

			<div className="flex min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[#EC6345]/20 bg-white/95 px-4 backdrop-blur md:px-6">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setIsSidebarOpenOnMobile((prev) => !prev)}
							className="rounded-lg border border-[#EC6345]/20 bg-white/50 p-2.5 text-[#333333]/85 transition hover:border-[#EC6345] hover:text-[#EC6345] md:hidden"
						>
							<RiMenuFoldFill className="text-xl" />
						</button>
						<button
							type="button"
							onClick={() => setIsSidebarCollapsed((prev) => !prev)}
							className="hidden rounded-lg border border-[#EC6345]/20 bg-white/50 p-2.5 text-[#333333]/85 transition hover:border-[#EC6345] hover:text-[#EC6345] md:block"
						>
							{isSidebarCollapsed ? (
								<RiMenuUnfoldFill className="text-xl" />
							) : (
								<RiMenuFoldFill className="text-xl" />
							)}
						</button>
					</div>

					<div className="flex items-center gap-3 md:gap-4">
						<div className="relative admin-notification">
							<button
								type="button"
								onClick={() =>
									setIsNotificationVisible((prev) => !prev)
								}
								className={`relative rounded-full border border-[#EC6345]/20 bg-white/50 p-2.5 text-[#333333]/85 transition hover:border-[#EC6345] hover:text-[#EC6345] ${unreadCount > 0 ? "shake" : ""}`}
							>
								<BiBell className="text-xl" />
								{unreadCount > 0 && (
									<span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#EC6345] px-1 text-[10px] font-semibold text-white">
										{unreadCount}
									</span>
								)}
							</button>

							{isNotificationVisible && (
								<motion.div
									variants={fadeIn}
									initial={fadeIn("right", null).initial}
									animate={fadeIn("right", 0).animate}
									className="absolute right-0 mt-2 w-[320px] overflow-hidden rounded-2xl border border-[#EC6345]/20 bg-white shadow-2xl"
								>
									<div className="flex items-center justify-between border-b border-[#EC6345]/20 px-4 py-3">
										<h3 className="text-sm font-semibold tracking-wide text-[#333333]/90">
											Notifications
										</h3>
										<button
											disabled={markingAllAsRead}
											onClick={handleMarkAllAsRead}
											className="flex items-center gap-1 text-xs font-medium text-[#EC6345] hover:underline disabled:opacity-60"
										>
											{markingAllAsRead && (
												<AiOutlineLoading className="animate-spin" />
											)}
											Mark all
										</button>
									</div>
									<div className="max-h-72 space-y-3 overflow-y-auto px-4 py-3">
										{notifications?.data?.length ? (
											notifications.data.map((notification) => (
												<button
													key={notification.id}
													type="button"
													onClick={handleNotificationClick}
													className="w-full rounded-xl border border-[#EC6345]/20 bg-[#F7F6F0] p-3 text-left transition hover:border-[#EC6345]/40"
												>
													<p className="text-sm font-semibold text-[#333333]/90">
														{notification?.title}
													</p>
													<p className="mt-1 text-xs text-[#333333]/70">
														{notification?.message}
													</p>
													<p className="mt-1 text-[11px] text-[#333333]/45">
														{moment(
															notification.created_at,
														).fromNow()}
													</p>
												</button>
											))
										) : (
											<p className="py-8 text-center text-sm text-[#333333]/50">
												No notifications yet.
											</p>
										)}
									</div>
								</motion.div>
							)}
						</div>

						<div className="relative admin-dropdown">
							<button
								type="button"
								className="flex items-center gap-2 rounded-full border border-[#EC6345]/20 bg-white/50 px-2 py-1.5 text-[#333333]/85 transition hover:border-[#EC6345]"
								onClick={() => setIsDropdownVisible((prev) => !prev)}
							>
								{user?.profile_picture && !isProfileImageBroken ? (
									<img
										src={user?.profile_picture}
										alt="Admin Profile"
										onError={() => setIsProfileImageBroken(true)}
										className="h-8 w-8 rounded-full object-cover ring-1 ring-[#EC6345]/15"
									/>
								) : (
									<span className="grid h-8 w-8 place-items-center rounded-full border border-[#EC6345]/20 bg-white/50 text-[#333333]/70">
										<FiUser className="text-sm" />
									</span>
								)}
								<span className="hidden text-sm font-medium md:block">
									{user?.username || "Admin"}
								</span>
								<BiChevronDown className="text-lg text-[#333333]/70" />
							</button>

							{isDropdownVisible && (
								<div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-[#EC6345]/20 bg-white shadow-xl">
									<button
										onClick={goToProfile}
										className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[#333333]/85 transition hover:bg-[#F7F6F0]"
									>
										<GiEgyptianProfile className="text-base text-[#333333]/70" />
										Update profile
									</button>
									<button
										onClick={handleLogout}
										className="flex w-full items-center gap-2 border-t border-[#EC6345]/20 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
									>
										<FiLogOut className="text-base" />
										Logout
									</button>
								</div>
							)}
						</div>
					</div>
				</header>

				<main className="admin-content flex-1 overflow-auto bg-[#F7F6F0] p-3 md:p-6">
					<div key={location.pathname}>{outlet}</div>
				</main>
			</div>

			{isSidebarOpenOnMobile && (
				<button
					type="button"
					className="fixed inset-0 z-40 bg-black/65 md:hidden"
					onClick={() => setIsSidebarOpenOnMobile(false)}
				/>
			)}
		</div>
	);
};

export default HomeLayout;
