import { useEffect, useMemo, useState } from "react";
import {
	Autocomplete,
	Button,
	IconButton,
	InputAdornment,
	MenuItem,
	TextField,
} from "@mui/material";
import { AiOutlineLoading } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { ENDPOINT } from "../../constants/endpoint";
import { useGetRequestQuery, usePostRequestMutation } from "../../services/api/request";

const TrainingAccounts = () => {
	const [sponsorUserId, setSponsorUserId] = useState("");
	const [selectedSponsor, setSelectedSponsor] = useState(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [gender, setGender] = useState("M");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [transactionalPassword, setTransactionalPassword] = useState("");
	const [confirmTransactionalPassword, setConfirmTransactionalPassword] =
		useState("");
	const [adminPassword, setAdminPassword] = useState("");
	const [formErrors, setFormErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showTransactionalPassword, setShowTransactionalPassword] =
		useState(false);
	const [showConfirmTransactionalPassword, setShowConfirmTransactionalPassword] =
		useState(false);
	const [showAdminPassword, setShowAdminPassword] = useState(false);
	const [sponsorSearch, setSponsorSearch] = useState("");
	const [debouncedSponsorSearch, setDebouncedSponsorSearch] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSponsorSearch(sponsorSearch.trim());
		}, 300);
		return () => clearTimeout(timer);
	}, [sponsorSearch]);

	const { data, isLoading } = useGetRequestQuery({
		url: ENDPOINT.GET_TRAINING_SPONSOR_OPTIONS,
		params: {
			search: debouncedSponsorSearch || undefined,
			limit: 20,
		},
	});
	const [createTraining, { isLoading: creating }] = usePostRequestMutation();
	const [generateDefaults, { isLoading: generatingDefaults }] = usePostRequestMutation();

	const users = useMemo(() => data?.data || [], [data?.data]);

	const [username, setUsername] = useState("");

	const runGenerateDefaults = async (sponsorId) => {
		if (!sponsorId) return;
		try {
			const response = await generateDefaults({
				url: ENDPOINT.POST_GENERATE_TRAINING_DEFAULTS,
				body: { sponsor_user: Number(sponsorId) },
			}).unwrap();

			const generated = response?.data || {};
			setUsername(generated.username || "");
			setFirstName(generated.first_name || "");
			setLastName(generated.last_name || "");
			setEmail(generated.email || "");
			setPhoneNumber(generated.phone_number || "");
			setGender(generated.gender || "M");
		} catch (error) {
			// global error handling
		}
	};

	useEffect(() => {
		if (!selectedSponsor?.id) return;
		runGenerateDefaults(selectedSponsor.id);
	}, [selectedSponsor?.id]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setFormErrors({});

		if (!sponsorUserId || !password || !transactionalPassword || !adminPassword) {
			toast.error("Please fill all required fields.");
			return;
		}
		if (password !== confirmPassword) {
			setFormErrors((prev) => ({
				...prev,
				confirm_password: ["Passwords do not match."],
			}));
			toast.error("Passwords do not match.");
			return;
		}
		if (!/^\d{4}$/.test(transactionalPassword)) {
			toast.error("Transactional password must be exactly 4 digits.");
			return;
		}
		if (transactionalPassword !== confirmTransactionalPassword) {
			setFormErrors((prev) => ({
				...prev,
				confirm_transactional_password: [
					"Transactional passwords do not match.",
				],
			}));
			toast.error("Transactional passwords do not match.");
			return;
		}

		try {
			const response = await createTraining({
				url: ENDPOINT.POST_CREATE_TRAINING_ACCOUNT,
				body: {
					sponsor_user: Number(sponsorUserId),
					username,
					first_name: firstName,
					last_name: lastName,
					email,
					phone_number: phoneNumber,
					gender,
					password,
					transactional_password: transactionalPassword,
					admin_password: adminPassword,
				},
			}).unwrap();

			toast.success(response?.message || "Training account created.");
			setPassword("");
			setConfirmPassword("");
			setTransactionalPassword("");
			setConfirmTransactionalPassword("");
			setAdminPassword("");
		} catch (error) {
			const apiData = error?.data || {};
			const fieldErrors = apiData?.errors || apiData?.message || {};
			if (typeof fieldErrors === "object" && !Array.isArray(fieldErrors)) {
				setFormErrors(fieldErrors);
			}
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-semibold text-[#333333]">Create Training Account</h1>
				<p className="text-sm text-[#333333]/60">
					Create a training account linked to an existing user via invitation flow.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="rounded-2xl border border-[#EC6345]/20 bg-white p-4 md:p-6"
			>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Autocomplete
						options={users}
						filterOptions={(options) => options}
						loading={isLoading}
						value={selectedSponsor}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						getOptionLabel={(option) =>
							option?.username
								? `${option.username} (${option.email || "no-email"})`
								: ""
						}
						onChange={(_event, value) => {
							setSponsorUserId(value?.id || "");
							setSelectedSponsor(value || null);
						}}
						onInputChange={(_event, value, reason) => {
							if (reason === "input") {
								setSponsorSearch(value || "");
							}
						}}
						noOptionsText={
							debouncedSponsorSearch
								? "No matching users found"
								: "Type to search users"
						}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Sponsor User"
								required
								error={Boolean(formErrors?.sponsor_user?.[0])}
								helperText={
									formErrors?.sponsor_user?.[0] ||
									"Search by username/email/phone/name"
								}
							/>
						)}
					/>

					<TextField
						label="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Select sponsor user first"
						error={Boolean(formErrors?.username?.[0])}
						helperText={formErrors?.username?.[0] || ""}
					/>
					<Button
						variant="outlined"
						color="info"
						onClick={() => runGenerateDefaults(sponsorUserId)}
						disabled={!sponsorUserId || generatingDefaults}
						sx={{ height: "56px" }}
					>
						{generatingDefaults && <AiOutlineLoading className="animate-spin mr-1" />}
						Regenerate
					</Button>

					<TextField
						label="First Name"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
					<TextField
						label="Last Name"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					/>

					<TextField
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						error={Boolean(formErrors?.email?.[0])}
						helperText={formErrors?.email?.[0] || ""}
					/>
					<TextField
						label="Phone Number"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						error={Boolean(formErrors?.phone_number?.[0])}
						helperText={formErrors?.phone_number?.[0] || ""}
					/>

					<TextField
						select
						label="Gender"
						value={gender}
						onChange={(e) => setGender(e.target.value)}
					>
						<MenuItem value="M">Male</MenuItem>
						<MenuItem value="F">Female</MenuItem>
					</TextField>

					<TextField
						label="Account Password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						error={Boolean(formErrors?.password?.[0])}
						helperText={formErrors?.password?.[0] || ""}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										edge="end"
										onClick={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? <FiEyeOff /> : <FiEye />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<TextField
						label="Confirm Account Password"
						type={showConfirmPassword ? "text" : "password"}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						error={Boolean(formErrors?.confirm_password?.[0])}
						helperText={formErrors?.confirm_password?.[0] || ""}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										edge="end"
										onClick={() => setShowConfirmPassword((prev) => !prev)}
									>
										{showConfirmPassword ? <FiEyeOff /> : <FiEye />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<TextField
						label="Transactional Password (4 digits)"
						type={showTransactionalPassword ? "text" : "password"}
						value={transactionalPassword}
						onChange={(e) => setTransactionalPassword(e.target.value)}
						required
						error={Boolean(formErrors?.transactional_password?.[0])}
						helperText={formErrors?.transactional_password?.[0] || ""}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										edge="end"
										onClick={() =>
											setShowTransactionalPassword((prev) => !prev)
										}
									>
										{showTransactionalPassword ? <FiEyeOff /> : <FiEye />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<TextField
						label="Confirm Transactional Password"
						type={showConfirmTransactionalPassword ? "text" : "password"}
						value={confirmTransactionalPassword}
						onChange={(e) => setConfirmTransactionalPassword(e.target.value)}
						required
						error={Boolean(formErrors?.confirm_transactional_password?.[0])}
						helperText={formErrors?.confirm_transactional_password?.[0] || ""}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										edge="end"
										onClick={() =>
											setShowConfirmTransactionalPassword((prev) => !prev)
										}
									>
										{showConfirmTransactionalPassword ? (
											<FiEyeOff />
										) : (
											<FiEye />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<TextField
						label="Admin Transactional Password"
						type={showAdminPassword ? "text" : "password"}
						value={adminPassword}
						onChange={(e) => setAdminPassword(e.target.value)}
						required
						error={Boolean(formErrors?.admin_password?.[0])}
						helperText={formErrors?.admin_password?.[0] || ""}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										edge="end"
										onClick={() => setShowAdminPassword((prev) => !prev)}
									>
										{showAdminPassword ? <FiEyeOff /> : <FiEye />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</div>

				<div className="mt-5">
					<Button
						type="submit"
						variant="contained"
						color="success"
						disabled={creating || isLoading}
						sx={{ minWidth: 220, gap: "8px" }}
					>
						{creating && <AiOutlineLoading className="animate-spin" />}
						Create Training Account
					</Button>
				</div>
			</form>
		</div>
	);
};

export default TrainingAccounts;
