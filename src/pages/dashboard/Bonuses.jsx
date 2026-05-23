import { useMemo, useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
} from "@mui/material";
import { AiOutlineLoading } from "react-icons/ai";
import moment from "moment";
import { toast } from "sonner";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";
import { ENDPOINT } from "../../constants/endpoint";
import { invalidateRequestTag } from "../../services/api/invalidate-request-tag";
import {
	usePatchRequestMutation,
	usePostRequestMutation,
} from "../../services/api/request";
import { useBonuses } from "../../hooks/use-bonuses";

const statusClass = {
	Pending: "bg-amber-50 text-amber-700 border-amber-200",
	Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
	Rejected: "bg-slate-50 text-slate-600 border-slate-200",
	Revoked: "bg-red-50 text-red-700 border-red-200",
};

const Bonuses = () => {
	const { bonuses, refetchBonuses } = useBonuses();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [selectedBonus, setSelectedBonus] = useState(null);
	const [editAmount, setEditAmount] = useState("");
	const [editReason, setEditReason] = useState("");
	const [adminPassword, setAdminPassword] = useState("");
	const [revokeReason, setRevokeReason] = useState("");
	const [modal, setModal] = useState("");

	const rows = useMemo(() => {
		const searchTerm = search.toLowerCase();
		return (bonuses.data || [])
			.filter((item) => statusFilter === "All" || item.status === statusFilter)
			.filter((item) => {
				const haystack = [
					item?.user?.username,
					item?.user?.email,
					item?.amount,
					item?.status,
					item?.reason,
				]
					.filter(Boolean)
					.join(" ")
					.toLowerCase();
				return haystack.includes(searchTerm);
			});
	}, [bonuses.data, search, statusFilter]);

	const displayedRows = rows.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage,
	);

	const openEditModal = (bonus) => {
		setSelectedBonus(bonus);
		setEditAmount(bonus?.amount || "");
		setEditReason(bonus?.reason || "");
		setAdminPassword("");
		setModal("edit");
	};

	const openRevokeModal = (bonus) => {
		setSelectedBonus(bonus);
		setAdminPassword("");
		setRevokeReason("");
		setModal("revoke");
	};

	const closeModal = () => {
		setSelectedBonus(null);
		setEditAmount("");
		setEditReason("");
		setAdminPassword("");
		setRevokeReason("");
		setModal("");
	};

	const [patchBonus, { isLoading: editingBonus }] = usePatchRequestMutation();
	const handleEditBonus = async () => {
		if (!editAmount || !adminPassword) {
			toast.error("Amount and admin transactional password are required.");
			return;
		}

		try {
			const res = await patchBonus({
				url: ENDPOINT.PATCH_BONUS.replace(":id", selectedBonus.id),
				body: {
					amount: editAmount,
					reason: editReason,
					admin_password: adminPassword,
				},
			}).unwrap();

			toast.success(res?.message);
			invalidateRequestTag(ENDPOINT.GET_BONUSES);
			refetchBonuses();
			closeModal();
		} catch (err) {
			console.error(err);
		}
	};

	const [postRevoke, { isLoading: revokingBonus }] = usePostRequestMutation();
	const handleRevokeBonus = async () => {
		if (!adminPassword) {
			toast.error("Admin transactional password is required.");
			return;
		}

		try {
			const res = await postRevoke({
				url: ENDPOINT.REVOKE_BONUS.replace(":id", selectedBonus.id),
				body: {
					admin_password: adminPassword,
					reason: revokeReason,
				},
			}).unwrap();

			toast.success(res?.message);
			invalidateRequestTag(ENDPOINT.GET_BONUSES);
			refetchBonuses();
			closeModal();
		} catch (err) {
			console.error(err);
		}
	};

	if (bonuses.isLoading) return <Loading />;
	if (bonuses.isError) return <Error retry={refetchBonuses} />;

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-semibold text-[#333333]">Bonus Requests</h1>
				<p className="text-sm text-[#333333]/60">
					Track pending, accepted, rejected, and revoked user bonuses.
				</p>
			</div>

			<div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#EC6345]/20 bg-white p-3">
				<TextField
					size="small"
					placeholder="Search user, email, amount, reason"
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					sx={{ width: { xs: "100%", md: 320 } }}
				/>
				<TextField
					select
					size="small"
					label="Status"
					value={statusFilter}
					onChange={(event) => {
						setStatusFilter(event.target.value);
						setPage(0);
					}}
					sx={{ minWidth: 160 }}
				>
					{["All", "Pending", "Accepted", "Rejected", "Revoked"].map((status) => (
						<MenuItem key={status} value={status}>
							{status}
						</MenuItem>
					))}
				</TextField>
			</div>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>#</TableCell>
							<TableCell>User</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Reason</TableCell>
							<TableCell>Created By</TableCell>
							<TableCell>Created</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedRows.map((bonus, index) => (
							<TableRow key={bonus.id}>
								<TableCell>{page * rowsPerPage + index + 1}</TableCell>
								<TableCell>
									<div className="font-semibold text-[#333333]">
										{bonus?.user?.username}
									</div>
									<div className="text-xs text-[#333333]/55">
										{bonus?.user?.email}
									</div>
								</TableCell>
								<TableCell>${bonus.amount}</TableCell>
								<TableCell>
									<span
										className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[bonus.status] || statusClass.Pending}`}
									>
										{bonus.status}
									</span>
								</TableCell>
								<TableCell>{bonus.reason || "-"}</TableCell>
								<TableCell>{bonus?.created_by?.username || "System"}</TableCell>
								<TableCell>{moment(bonus.created_at).format("DD MMM YYYY h:mm A")}</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-2">
										<Button
											size="small"
											variant="outlined"
											disabled={bonus.status !== "Pending"}
											onClick={() => openEditModal(bonus)}
										>
											Edit
										</Button>
										<Button
											size="small"
											variant="contained"
											color="error"
											disabled={bonus.status === "Revoked" || bonus.status === "Rejected"}
											onClick={() => openRevokeModal(bonus)}
										>
											Revoke
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
						{displayedRows.length === 0 && (
							<TableRow>
								<TableCell colSpan={8} align="center">
									No bonus requests found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[10, 25, 50]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(_, nextPage) => setPage(nextPage)}
					onRowsPerPageChange={(event) => {
						setRowsPerPage(+event.target.value);
						setPage(0);
					}}
				/>
			</TableContainer>

			<Dialog open={modal === "edit"} onClose={closeModal} fullWidth maxWidth="sm">
				<DialogTitle>Edit Pending Bonus</DialogTitle>
				<DialogContent>
					<div className="mt-3 grid gap-4">
						<TextField label="User" disabled value={selectedBonus?.user?.username || ""} />
						<TextField
							label="Amount"
							type="number"
							value={editAmount}
							onChange={(event) => setEditAmount(event.target.value)}
						/>
						<TextField
							label="Reason"
							multiline
							minRows={3}
							value={editReason}
							onChange={(event) => setEditReason(event.target.value)}
						/>
						<TextField
							label="Admin transactional password"
							type="password"
							value={adminPassword}
							onChange={(event) => setAdminPassword(event.target.value)}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeModal} variant="outlined" color="warning">
						Close
					</Button>
					<Button onClick={handleEditBonus} variant="contained" disabled={editingBonus}>
						{editingBonus && <AiOutlineLoading className="mr-2 animate-spin" />}
						Save
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={modal === "revoke"} onClose={closeModal} fullWidth maxWidth="sm">
				<DialogTitle>Revoke Bonus</DialogTitle>
				<DialogContent>
					<div className="mt-3 grid gap-4">
						<p className="text-sm text-[#333333]/70">
							Revoking an accepted bonus removes the credited amount from the user's wallet.
						</p>
						<TextField label="User" disabled value={selectedBonus?.user?.username || ""} />
						<TextField label="Amount" disabled value={selectedBonus?.amount || ""} />
						<TextField
							label="Revoke reason"
							multiline
							minRows={3}
							value={revokeReason}
							onChange={(event) => setRevokeReason(event.target.value)}
						/>
						<TextField
							label="Admin transactional password"
							type="password"
							value={adminPassword}
							onChange={(event) => setAdminPassword(event.target.value)}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeModal} variant="outlined" color="warning">
						Close
					</Button>
					<Button
						onClick={handleRevokeBonus}
						variant="contained"
						color="error"
						disabled={revokingBonus}
					>
						{revokingBonus && <AiOutlineLoading className="mr-2 animate-spin" />}
						Revoke
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Bonuses;
