import { useState, useMemo, useEffect } from "react";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	TableSortLabel,
	Menu,
	MenuItem,
	TablePagination,
} from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useLogs } from "../../hooks/use-logs";
import moment from "moment";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";

const Logs = () => {
	const [search, setSearch] = useState("");
	const [sortConfig, setSortConfig] = useState({
		key: "id",
		direction: "asc",
	});
	const [anchorEl, setAnchorEl] = useState(null);
	const [hiddenColumns, setHiddenColumns] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const { logs } = useLogs();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const logsData = logs?.data
		? logs?.data.map((item) => ({
			...item,
			dateTime: moment(item?.created_at).format("DD MMM YYYY h:mm A"),
			user: item?.user?.username,
		}))
		: [];

	const columns = useMemo(
		() => [
			{ Header: "#", accessorKey: "id" },
			{ Header: "User", accessorKey: "user" },
			{ Header: "Description", accessorKey: "description" },
			{ Header: "Reason", accessorKey: "reason" },
			{ Header: "Date time", accessorKey: "dateTime" },
		],
		[],
	);

	const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const handleColumnToggle = (key) => {
		setHiddenColumns((prev) =>
			prev.includes(key)
				? prev.filter((col) => col !== key)
				: [...prev, key],
		);
	};

	const handleSort = (key) => {
		setSortConfig((prev) => ({
			key,
			direction:
				prev.key === key && prev.direction === "asc" ? "desc" : "asc",
		}));
	};

	const handleSearch = (e) => setSearch(e.target.value);

	const handleChangePage = (event, newPage) => setPage(newPage);

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleExportPDF = () => {
		const doc = new jsPDF();
		autoTable(doc, {
			head: [columns.map((col) => col.Header)],
			body: logsData.map((row) =>
				columns.map((col) => row[col.accessorKey]),
			),
		});
		doc.save("logs.pdf");
	};

	const handleExportCSV = () => {
		const csvData = [
			columns.map((col) => col.Header).join(","),
			...logsData.map((row) =>
				columns.map((col) => row[col.accessorKey]).join(","),
			),
		].join("\n");
		const blob = new Blob([csvData], { type: "text/csv" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "logs.csv";
		link.click();
	};

	const filteredData = useMemo(() => {
		return logsData.filter((row) =>
			row.description.toLowerCase().includes(search.toLowerCase()),
		);
	}, [search, logsData]);

	const sortedData = useMemo(() => {
		const sorted = [...filteredData];
		if (sortConfig.key) {
			sorted.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key])
					return sortConfig.direction === "asc" ? -1 : 1;
				if (a[sortConfig.key] > b[sortConfig.key])
					return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}
		return sorted;
	}, [filteredData, sortConfig]);

	const displayedData = sortedData.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage,
	);

	if (logs.isLoading) {
		return <Loading />;
	}

	if (logs.isError) {
		return <Error />;
	}

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-semibold text-[#333333]">Logs</h1>
				<p className="text-sm text-[#333333]/60">
					Audit trail of admin and system actions.
				</p>
			</div>
			<div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#EC6345]/20 bg-white p-3">
				<Button
					variant="contained"
					onClick={handleExportCSV}
					color="warning"
					size="small"
				>
					Export CSV
				</Button>
				<Button
					variant="contained"
					onClick={handleExportPDF}
					color="error"
					size="small"
				>
					Export PDF
				</Button>
				<Button
					variant="contained"
					color="info"
					size="small"
					onClick={handleMenuOpen}
				>
					Column Visibility
				</Button>
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleMenuClose}
				>
					{columns.map((col) => (
						<MenuItem
							key={col.accessorKey}
							onClick={() => handleColumnToggle(col.accessorKey)}
						>
							{hiddenColumns.includes(col.accessorKey)
								? `${col.Header}`
								: `${col.Header}`}
						</MenuItem>
					))}
				</Menu>
				<TextField
					variant="outlined"
					placeholder="Search by description"
					size="small"
					sx={{ ml: "auto", width: { xs: "100%", sm: 260 } }}
					value={search}
					onChange={handleSearch}
				/>
			</div>

			<TableContainer
				component={Paper}
				sx={{
					overflowX: "auto",
				}}
			>
				<Table>
					<TableHead>
						<TableRow>
							{columns.map(
								(col) =>
									!hiddenColumns.includes(col.accessorKey) && (
										<TableCell key={col.accessorKey}>
											<TableSortLabel
												active={sortConfig.key === col.accessorKey}
												direction={
													sortConfig.key === col.accessorKey
														? sortConfig.direction
														: "asc"
												}
												onClick={() => handleSort(col.accessorKey)}
											>
												{col.Header}
											</TableSortLabel>
										</TableCell>
									),
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedData.map((row) => (
							<TableRow key={row.id}>
								{columns.map(
									(col) =>
										!hiddenColumns.includes(col.accessorKey) && (
											<TableCell key={col.accessorKey}>
												{row[col.accessorKey]}
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
					count={logsData?.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</TableContainer>
		</div>
	);
};

export default Logs;
