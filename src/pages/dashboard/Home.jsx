import Chart from "react-apexcharts";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	TableSortLabel,
	TablePagination,
} from "@mui/material";
import { useHome } from "../../hooks/use-home";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";

const Home = () => {
	const { analyticsCount } = useHome();
	const cardDataCounts = analyticsCount.data;

	const [search, setSearch] = useState("");
	const [hiddenColumns] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [page, setPage] = useState(0);
	const [sortConfig, setSortConfig] = useState({
		key: "id",
		direction: "asc",
	});

	useEffect(() => {
		if (cardDataCounts?.total_users_login_today?.users) {
			setTableData(
				cardDataCounts.total_users_login_today.users.map((item, index) => ({
					...item,
					id: index + 1,
					username: item?.username,
					submitted: item?.total_negative_product_submitted,
					balance: item?.wallet?.balance,
					submissionTotal: `${item?.total_play}/${item?.total_available_play}`,
					profit: item?.wallet?.commission,
					connection: moment(item?.last_connection).format(
						"DD MM YYYY h:mmA",
					),
					onHold: item?.wallet?.on_hold,
				})),
			);
		}
	}, [cardDataCounts?.total_users_login_today?.users]);

	const filteredData = useMemo(
		() =>
			tableData.filter((row) =>
				(row.username || "").toLowerCase().includes(search.toLowerCase()),
			),
		[search, tableData],
	);

	const sortedData = useMemo(() => {
		const sorted = [...filteredData];
		if (sortConfig.key) {
			sorted.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? 1 : -1;
				}
				return 0;
			});
		}
		return sorted;
	}, [filteredData, sortConfig]);

	const displayedData = sortedData.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage,
	);

	const columns = useMemo(
		() => [
			{ Header: "#", accessorKey: "id" },
			{ Header: "Username", accessorKey: "username" },
			{ Header: "Negative Products Submitted", accessorKey: "submitted" },
			{ Header: "Balance", accessorKey: "balance" },
			{ Header: "Today Submission Total", accessorKey: "submissionTotal" },
			{ Header: "Today Profit", accessorKey: "profit" },
			{ Header: "Last Connection", accessorKey: "connection" },
			{ Header: "On Hold", accessorKey: "onHold" },
		],
		[],
	);

	const cardData = [
		{ title: "Total Users", value: cardDataCounts?.total_users, icon: "👤" },
		{
			title: "Active Products",
			value: cardDataCounts?.active_products,
			icon: "📦",
		},
		{
			title: "Submissions Today",
			value: cardDataCounts?.total_submissions,
			icon: "🛒",
		},
		{
			title: "Logins Today",
			value: cardDataCounts?.total_users_login_today?.count,
			icon: "🔑",
		},
	];

	const categories = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const userChartOptions = {
		chart: { id: "users-chart-static", toolbar: { show: false } },
		colors: ["#EC6345"],
		xaxis: { categories, labels: { style: { colors: "#333333" } } },
		yaxis: { labels: { style: { colors: "#333333" } } },
		theme: { mode: "light" },
		grid: { borderColor: "rgba(236,99,69,0.08)" },
		tooltip: { theme: "light", style: { fontSize: "12px" } },
	};

	const submissionChartOptions = {
		chart: { id: "submission-chart-static", toolbar: { show: false } },
		colors: ["#EC6345"],
		xaxis: { categories, labels: { style: { colors: "#333333" } } },
		yaxis: { labels: { style: { colors: "#333333" } } },
		theme: { mode: "light" },
		grid: { borderColor: "rgba(236,99,69,0.08)" },
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			bar: {
				borderRadius: 4,
				columnWidth: "52%",
			},
		},
		tooltip: {
			theme: "light",
			style: { fontSize: "12px" },
			y: {
				formatter: (value) => `${value ?? 0} submissions`,
			},
		},
	};

	const userData = analyticsCount?.data?.user_registrations_per_month || {};
	const userChartData = useMemo(
		() => [{ name: "Users", data: Object.values(userData) }],
		[userData],
	);

	const submissionData =
		analyticsCount?.data?.total_submissions_per_month || {};
	const submissionChartData = useMemo(
		() => [{ name: "Submissions", data: Object.values(submissionData) }],
		[submissionData],
	);

	if (analyticsCount.isLoading) return <Loading />;
	if (analyticsCount.isError) return <Error />;

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-[#333333]">
						Admin Dashboard
					</h1>
					<p className="text-sm text-[#333333]/60">
						Overview of user activity, growth, and submissions.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{cardData.map((card) => (
					<div
						key={card.title}
						className="rounded-2xl border border-[#EC6345]/20 bg-white p-5 shadow-[0_20px_60px_-35px_rgba(236,99,69,0.15)]"
					>
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-[#333333]/65">
									{card.title}
								</p>
								<p className="mt-2 text-3xl font-semibold text-[#EC6345]">
									{card.value ?? 0}
								</p>
							</div>
							<span className="text-3xl">{card.icon}</span>
						</div>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
				<div className="rounded-2xl border border-[#EC6345]/20 bg-white p-4">
					<h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#333333]/70">
						Total Registered Users
					</h3>
					<Chart
						key={userChartData[0].data.join(",")}
						options={userChartOptions}
						series={userChartData}
						type="radar"
						height={320}
					/>
				</div>

				<div className="rounded-2xl border border-[#EC6345]/20 bg-white p-4">
					<h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#333333]/70">
						Total Submissions
					</h3>
					<Chart
						key={submissionChartData[0].data.join(",")}
						options={submissionChartOptions}
						series={submissionChartData}
						type="bar"
						height={320}
					/>
				</div>
			</div>

			<div className="space-y-3 rounded-2xl border border-[#EC6345]/20 bg-white p-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-lg font-semibold text-[#333333]">
						Today Login Users
					</h2>
					<TextField
						size="small"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search by username"
						sx={{ width: { xs: "100%", sm: 260 } }}
					/>
				</div>

				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								{columns.map(
									(column) =>
										!hiddenColumns.includes(column.accessorKey) && (
											<TableCell key={column.accessorKey}>
												<TableSortLabel
													active={
														sortConfig.key === column.accessorKey
													}
													direction={
														sortConfig.key === column.accessorKey
															? sortConfig.direction
															: "asc"
													}
													onClick={() =>
														setSortConfig((prev) => ({
															key: column.accessorKey,
															direction:
																prev.key ===
																	column.accessorKey &&
																prev.direction === "asc"
																	? "desc"
																	: "asc",
														}))
													}
												>
													{column.Header}
												</TableSortLabel>
											</TableCell>
										),
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{displayedData.map((row) => (
								<TableRow key={`${row.id}-${row.username}`}>
									{columns.map(
										(column) =>
											!hiddenColumns.includes(
												column.accessorKey,
											) && (
												<TableCell key={column.accessorKey}>
													{row[column.accessorKey] ?? "-"}
												</TableCell>
											),
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>

					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={sortedData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={(event, newPage) => setPage(newPage)}
						onRowsPerPageChange={(event) => {
							setRowsPerPage(Number(event.target.value));
							setPage(0);
						}}
					/>
				</TableContainer>
			</div>
		</div>
	);
};

export default Home;
