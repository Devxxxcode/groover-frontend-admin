import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { BsBank, BsCartDash } from "react-icons/bs";
import {
	AiFillBook,
	AiOutlineCaretDown,
	AiOutlineLogout,
} from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { BiUser, BiCog, BiBookOpen } from "react-icons/bi";
import { FaRegCalendarAlt, FaRegEye } from "react-icons/fa";
import logoFull from "../../../assets/logo.svg";
import { handleLogout } from "../../../helpers/handle-logout";

const navItemClass = ({ isActive }) =>
	`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
		isActive
			? "bg-[#EC6345]/15 text-[#EC6345] ring-1 ring-[#EC6345]/35"
			: "text-[#333333]/75 hover:bg-[#EC6345]/[0.06] hover:text-[#333333]"
	}`;

const iconClass = "text-lg shrink-0";

function SideBarWeb({ isCollapsed, closeSidebar = () => {} }) {
	const [isUsersDropdownOpen, setUsersDropdownOpen] = useState(false);
	const [isFinancialDropdownOpen, setFinancialDropdownOpen] = useState(false);

	const mainLinks = useMemo(
		() => [
			{
				to: "/home",
				label: "Dashboard",
				icon: MdOutlineDashboard,
				end: true,
			},
			{ to: "/home/hold", label: "On Hold Management", icon: AiFillBook },
			{ to: "/home/products", label: "Products", icon: BsCartDash },
			{ to: "/home/packs", label: "Packs Management", icon: BiBookOpen },
			{
				to: "/home/events",
				label: "Events Management",
				icon: FaRegCalendarAlt,
			},
			{ to: "/home/logs", label: "View Logs", icon: FaRegEye },
			{ to: "/home/settings", label: "Settings Management", icon: BiCog },
		],
		[],
	);

	const userLinks = useMemo(
		() => [
			{ to: "/home/allusers", label: "All Users" },
			{ to: "/home/trainingaccounts", label: "Training Accounts" },
			{ to: "/home/userpasswords", label: "User Password" },
			{ to: "/home/negusers", label: "Negative Users" },
		],
		[],
	);

	const financialLinks = useMemo(
		() => [
			{ to: "/home/deposits", label: "Deposits List" },
			{ to: "/home/withdrawals", label: "Withdrawals List" },
			{ to: "/home/bonuses", label: "Bonus Requests" },
		],
		[],
	);

	return (
		<aside className="flex h-full flex-col border-r border-[#EC6345]/20 bg-white">
			<div className="flex h-[68px] items-center justify-center border-b border-[#EC6345]/20 px-4">
				<img
					src={logoFull}
					alt="Groover"
					className={isCollapsed ? "w-8" : "w-36"}
				/>
			</div>

			<nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
				{mainLinks.slice(0, 2).map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						end={item.end}
						className={navItemClass}
						onClick={closeSidebar}
					>
						<item.icon className={iconClass} />
						{!isCollapsed && <span>{item.label}</span>}
					</NavLink>
				))}

				<div className="relative">
					<button
						type="button"
						className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
							isUsersDropdownOpen
								? "bg-[#EC6345]/[0.06] text-[#333333]"
								: "text-[#333333]/75 hover:bg-[#EC6345]/[0.06] hover:text-[#333333]"
						}`}
						onClick={() => setUsersDropdownOpen((prev) => !prev)}
					>
						<BiUser className={iconClass} />
						{!isCollapsed && (
							<>
								<span>Users Management</span>
								<AiOutlineCaretDown
									className={`ml-auto transition-transform ${isUsersDropdownOpen ? "rotate-180" : ""}`}
								/>
							</>
						)}
					</button>
					{!isCollapsed && isUsersDropdownOpen && (
						<div className="mt-1 space-y-1 pl-8">
							{userLinks.map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									className={navItemClass}
									onClick={closeSidebar}
								>
									<span>{link.label}</span>
								</NavLink>
							))}
						</div>
					)}
					{isCollapsed && isUsersDropdownOpen && (
						<div className="absolute left-[78px] z-30 mt-1 w-52 rounded-xl border border-[#EC6345]/20 bg-white p-2 shadow-xl">
							{userLinks.map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									className={navItemClass}
									onClick={closeSidebar}
								>
									<span>{link.label}</span>
								</NavLink>
							))}
						</div>
					)}
				</div>

				{mainLinks.slice(2, 4).map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={navItemClass}
						onClick={closeSidebar}
					>
						<item.icon className={iconClass} />
						{!isCollapsed && <span>{item.label}</span>}
					</NavLink>
				))}

				<div className="relative">
					<button
						type="button"
						className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
							isFinancialDropdownOpen
								? "bg-[#EC6345]/[0.06] text-[#333333]"
								: "text-[#333333]/75 hover:bg-[#EC6345]/[0.06] hover:text-[#333333]"
						}`}
						onClick={() => setFinancialDropdownOpen((prev) => !prev)}
					>
						<BsBank className={iconClass} />
						{!isCollapsed && (
							<>
								<span>Financial Operations</span>
								<AiOutlineCaretDown
									className={`ml-auto transition-transform ${isFinancialDropdownOpen ? "rotate-180" : ""}`}
								/>
							</>
						)}
					</button>
					{!isCollapsed && isFinancialDropdownOpen && (
						<div className="mt-1 space-y-1 pl-8">
							{financialLinks.map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									className={navItemClass}
									onClick={closeSidebar}
								>
									<span>{link.label}</span>
								</NavLink>
							))}
						</div>
					)}
					{isCollapsed && isFinancialDropdownOpen && (
						<div className="absolute left-[78px] z-30 mt-1 w-56 rounded-xl border border-[#EC6345]/20 bg-white p-2 shadow-xl">
							{financialLinks.map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									className={navItemClass}
									onClick={closeSidebar}
								>
									<span>{link.label}</span>
								</NavLink>
							))}
						</div>
					)}
				</div>

				{mainLinks.slice(4).map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={navItemClass}
						onClick={closeSidebar}
					>
						<item.icon className={iconClass} />
						{!isCollapsed && <span>{item.label}</span>}
					</NavLink>
				))}
			</nav>

			<div className="border-t border-[#EC6345]/20 p-3">
				<button
					type="button"
					onClick={handleLogout}
					className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
				>
					<AiOutlineLogout className={iconClass} />
					{!isCollapsed && <span>Logout</span>}
				</button>
			</div>
		</aside>
	);
}

SideBarWeb.propTypes = {
	isCollapsed: PropTypes.bool.isRequired,
	closeSidebar: PropTypes.func,
};

export default SideBarWeb;
