import { useMemo, useState } from "react";
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
	TablePagination,
	TableSortLabel,
} from "@mui/material";
import moment from "moment";
import { ENDPOINT } from "../../constants/endpoint";
import { useGetRequestQuery } from "../../services/api/request";
import { Loading } from "../../components/loading";

const UserPasswords = () => {
	const [search, setSearch] = useState("");
	const [adminPasswordInput, setAdminPasswordInput] = useState("");
	const [adminPassword, setAdminPassword] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [sortConfig, setSortConfig] = useState({
		key: "created_at",
		direction: "desc",
	});

	const { data, isLoading, isError, error } = useGetRequestQuery(
		{
			url: ENDPOINT.GET_USER_PASSWORD_HISTORY,
			params: {
				admin_password: adminPassword,
			},
		},
		{
			skip: !adminPassword,
		},
	);

	const rows = data?.data || [];
	const errorMessage = useMemo(() => {
		if (!isError) return "";
		const apiData = error?.data || {};
		return (
			apiData?.errors?.admin_password?.[0] ||
			apiData?.message?.admin_password?.[0] ||
			(typeof apiData?.message === "string" ? apiData.message : "") ||
			"Failed to fetch password history."
		);
	}, [error, isError]);

	const columns = useMemo(
		() => [
			{ Header: "#", accessorKey: "id" },
			{ Header: "Username", accessorKey: "username" },
			{ Header: "Email", accessorKey: "email" },
			{ Header: "Type", accessorKey: "password_kind" },
			{ Header: "Hash", accessorKey: "password_hash" },
			{ Header: "Source", accessorKey: "source" },
			{ Header: "Updated By", accessorKey: "updated_by_username" },
			{ Header: "Created At", accessorKey: "created_at" },
		],
		[],
	);

	const handleSort = (key) => {
		setSortConfig((prev) => ({
			key,
			direction:
				prev.key === key && prev.direction === "asc" ? "desc" : "asc",
		}));
	};

	const filteredRows = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return rows;

		return rows.filter((item) =>
			[
				item?.username,
				item?.email,
				item?.source,
				item?.password_kind,
				item?.updated_by_username,
			]
				.filter(Boolean)
				.some((value) => value.toString().toLowerCase().includes(q)),
		);
	}, [rows, search]);

	const sortedRows = useMemo(() => {
		const arr = [...filteredRows];
		const { key, direction } = sortConfig;
		arr.sort((a, b) => {
			const av = a?.[key] ?? "";
			const bv = b?.[key] ?? "";
			if (av < bv) return direction === "asc" ? -1 : 1;
			if (av > bv) return direction === "asc" ? 1 : -1;
			return 0;
		});
		return arr;
	}, [filteredRows, sortConfig]);

	const displayedRows = sortedRows.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage,
	);

	if (isLoading) return <Loading />;

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-semibold text-[#333333]">User Password Hashes</h1>
				<p className="text-sm text-[#333333]/60">
					History of password hash snapshots for non-admin users.
				</p>
			</div>

			<div className="rounded-2xl border border-[#EC6345]/20 bg-white p-3">
				<div className="flex flex-wrap items-center gap-3">
					<TextField
						size="small"
						type="password"
						label="Admin transactional password"
						value={adminPasswordInput}
						onChange={(event) => setAdminPasswordInput(event.target.value)}
						sx={{ width: { xs: "100%", sm: 300 } }}
					/>
					<Button
						variant="contained"
						color="success"
						onClick={() => {
							setAdminPassword(adminPasswordInput.trim());
							setPage(0);
						}}
						disabled={!adminPasswordInput.trim()}
					>
						Fetch
					</Button>
					{adminPassword && (
						<TextField
							size="small"
							value={search}
							onChange={(event) => {
								setSearch(event.target.value);
								setPage(0);
							}}
							placeholder="Search by username, email, source, type"
							sx={{ width: { xs: "100%", sm: 380 } }}
						/>
					)}
				</div>
				{isError && (
					<p className="mt-2 text-sm text-red-300">
						{errorMessage}
					</p>
				)}
			</div>

			{!adminPassword ? (
				<div className="rounded-2xl border border-[#EC6345]/20 bg-white p-6 text-center text-sm text-[#333333]/65">
					Enter admin transactional password and click Fetch.
				</div>
			) : (
			<TableContainer component={Paper} sx={{ overflowX: "auto" }}>
				<Table>
					<TableHead>
						<TableRow>
							{columns.map((col) => (
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
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedRows.map((row) => (
							<TableRow key={row.id}>
								<TableCell>{row.id}</TableCell>
								<TableCell>{row.username || "-"}</TableCell>
								<TableCell>{row.email || "-"}</TableCell>
								<TableCell className="capitalize">{row.password_kind}</TableCell>
								<TableCell>
									<code className="block max-w-[360px] break-all text-xs text-[#333333]/85">
										{row.password_hash}
									</code>
								</TableCell>
								<TableCell>{row.source || "-"}</TableCell>
								<TableCell>{row.updated_by_username || "-"}</TableCell>
								<TableCell>
									{row.created_at
										? moment(row.created_at).format("DD MMM YYYY h:mm A")
										: "-"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<TablePagination
					component="div"
					rowsPerPageOptions={[10, 25, 50]}
					count={sortedRows.length}
					page={page}
					rowsPerPage={rowsPerPage}
					onPageChange={(_event, newPage) => setPage(newPage)}
					onRowsPerPageChange={(event) => {
						setRowsPerPage(parseInt(event.target.value, 10));
						setPage(0);
					}}
				/>
			</TableContainer>
			)}
		</div>
	);
};

export default UserPasswords;
