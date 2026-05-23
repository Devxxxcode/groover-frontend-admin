import { AiOutlineLoading } from "react-icons/ai";
import {
	MdOutlinePerson,
	MdOutlineEmail,
	MdOutlinePhone,
	MdOutlineSecurity,
	MdOutlineEdit,
	MdOutlineSave,
} from "react-icons/md";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Avatar,
	IconButton,
	Tooltip,
	Alert,
} from "@mui/material";
import { useProfile } from "../../hooks/use-profile";

const fieldClassName =
	"mt-2 block h-[48px] w-full rounded-xl border border-[#EC6345]/20 bg-white px-3 text-[16px] text-[#333333] outline-none transition focus:border-[#EC6345]/55 focus:ring-2 focus:ring-[#EC6345]/30";

const Profile = () => {
	const {
		formData,
		handleChange,
		handleSubmit,
		isPatchProfileLoading,
		credentials,
		setCredentials,
		handleUpdateAcccountPassword,
		patchingAccountPassword,
		handleCloseModal,
		handleOpenModal,
		modal,
	} = useProfile();

	return (
		<div className="space-y-5">
			<div>
				<h1 className="text-2xl font-semibold text-[#333333]">Profile Settings</h1>
				<p className="text-sm text-[#333333]/60">
					Manage your account information and security settings.
				</p>
			</div>

			<div className="rounded-2xl border border-[#EC6345]/20 bg-white p-5">
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
					<div className="relative">
						<Avatar
							src={
								formData.profile_picture &&
								!(formData.profile_picture instanceof File)
									? formData.profile_picture
									: undefined
							}
							alt="Profile"
							sx={{
								width: 92,
								height: 92,
								border: "3px solid #EC6345",
								backgroundColor: "#F7F6F0",
							}}
						>
							{!formData.profile_picture && <MdOutlinePerson size={42} />}
						</Avatar>

						{formData.profile_picture instanceof File && (
							<Avatar
								src={URL.createObjectURL(formData.profile_picture)}
								alt="Preview"
								sx={{
									width: 92,
									height: 92,
									border: "3px solid #EC6345",
									position: "absolute",
									inset: 0,
								}}
							/>
						)}

						<Tooltip title="Change profile picture">
							<IconButton
								component="label"
								sx={{
									position: "absolute",
									bottom: -4,
									right: -4,
									backgroundColor: "#EC6345",
									color: "#ffffff",
									"&:hover": { backgroundColor: "#BA5225" },
								}}
							>
								<MdOutlineEdit />
								<input
									type="file"
									name="profile_picture"
									onChange={handleChange}
									accept="image/*"
									hidden
								/>
							</IconButton>
						</Tooltip>
					</div>

					<div className="text-center sm:text-left">
						<h2 className="text-xl font-semibold text-[#333333]">
							{formData.first_name} {formData.last_name}
						</h2>
						<p className="text-sm text-[#333333]/65">@{formData.username}</p>
					</div>
				</div>
			</div>

			<div className="rounded-2xl border border-[#EC6345]/20 bg-white p-5">
				<div className="mb-4">
					<h3 className="flex items-center gap-2 text-lg font-semibold text-[#333333]">
						<MdOutlinePerson className="text-[#EC6345]" />
						Personal Information
					</h3>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="text-sm font-medium text-[#333333]/80">Username</label>
							<input
								type="text"
								name="username"
								value={formData.username || ""}
								onChange={handleChange}
								className={fieldClassName}
							/>
						</div>
						<div>
							<label className="text-sm font-medium text-[#333333]/80">First Name</label>
							<input
								type="text"
								name="first_name"
								value={formData.first_name || ""}
								onChange={handleChange}
								className={fieldClassName}
							/>
						</div>
						<div>
							<label className="text-sm font-medium text-[#333333]/80">Last Name</label>
							<input
								type="text"
								name="last_name"
								value={formData.last_name || ""}
								onChange={handleChange}
								className={fieldClassName}
							/>
						</div>
						<div>
							<label className="text-sm font-medium text-[#333333]/80">Phone Number</label>
							<input
								type="tel"
								name="phone_number"
								value={formData.phone_number || ""}
								onChange={handleChange}
								className={fieldClassName}
							/>
						</div>
						<div className="md:col-span-2">
							<label className="text-sm font-medium text-[#333333]/80">Email Address</label>
							<input
								type="email"
								name="email"
								value={formData.email || ""}
								onChange={handleChange}
								className={fieldClassName}
							/>
						</div>
					</div>

					<div className="pt-2">
						<Button
							type="submit"
							variant="contained"
							disabled={isPatchProfileLoading}
							startIcon={
								isPatchProfileLoading ? (
									<AiOutlineLoading className="animate-spin" />
								) : (
									<MdOutlineSave />
								)
							}
						>
							{isPatchProfileLoading ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</div>

			<div className="rounded-2xl border border-[#EC6345]/20 bg-white p-5">
				<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#333333]">
					<MdOutlineSecurity className="text-[#EC6345]" />
					Security Settings
				</h3>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="rounded-xl border border-[#EC6345]/15 bg-[#F7F6F0] p-4">
						<h4 className="text-base font-semibold text-[#333333]">Account Password</h4>
						<p className="mt-1 text-sm text-[#333333]/60">
							Update your main account password.
						</p>
						<Button
							variant="contained"
							onClick={() => handleOpenModal("account")}
							sx={{ mt: 2 }}
						>
							Update Password
						</Button>
					</div>
					<div className="rounded-xl border border-[#EC6345]/15 bg-[#F7F6F0] p-4">
						<h4 className="text-base font-semibold text-[#333333]">Withdrawal Password</h4>
						<p className="mt-1 text-sm text-[#333333]/60">
							Update your withdrawal password.
						</p>
						<Button
							variant="contained"
							onClick={() => handleOpenModal("withdrawal")}
							sx={{ mt: 2 }}
						>
							Update Password
						</Button>
					</div>
				</div>
			</div>

			<Dialog open={modal.open} onClose={handleCloseModal} fullWidth maxWidth="sm">
				<DialogTitle>
					<div className="flex items-center gap-2 text-[#333333]">
						<MdOutlineSecurity />
						{modal.type === "account"
							? "Update Account Password"
							: "Update Withdrawal Password"}
					</div>
				</DialogTitle>

				<DialogContent>
					<Alert severity="info" sx={{ mb: 2 }}>
						Enter your current password and a new password.
					</Alert>

					<TextField
						label="Current Password"
						type="password"
						fullWidth
						margin="normal"
						variant="outlined"
						value={credentials.current_password}
						onChange={(e) =>
							setCredentials({
								...credentials,
								current_password: e.target.value,
							})
						}
					/>

					<TextField
						label="New Password"
						type="password"
						fullWidth
						margin="normal"
						variant="outlined"
						value={credentials.new_password}
						onChange={(e) =>
							setCredentials({
								...credentials,
								new_password: e.target.value,
							})
						}
					/>
				</DialogContent>

				<DialogActions>
					<Button disabled={patchingAccountPassword} onClick={handleCloseModal}>
						Cancel
					</Button>

					<Button
						disabled={patchingAccountPassword}
						onClick={handleUpdateAcccountPassword}
						variant="contained"
						startIcon={
							patchingAccountPassword ? (
								<AiOutlineLoading className="animate-spin" />
							) : (
								<MdOutlineSave />
							)
						}
					>
						{patchingAccountPassword ? "Updating..." : "Update Password"}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Profile;
