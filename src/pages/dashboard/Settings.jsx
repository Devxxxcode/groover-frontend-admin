import { AiOutlineLoading } from "react-icons/ai";
import { Error } from "../../components/error";
import { Loading } from "../../components/loading";
import { useSetting } from "../../hooks/use-setting";

const settingsFields = [
	{
		key: "percentage_of_sponsors",
		label: "Percentage of Sponsors",
		type: "number",
	},
	{
		key: "token_validity_period_hours",
		label: "Token Validity (Hours)",
		type: "number",
	},
	{
		key: "bonus_when_registering",
		label: "Registration Bonus (USD)",
		type: "number",
	},
	{
		key: "service_availability_start_time",
		label: "Service Availability Start",
		type: "time",
	},
	{
		key: "service_availability_end_time",
		label: "Service Availability End",
		type: "time",
	},
	{ key: "whatsapp_contact", label: "WhatsApp Contact", type: "text" },
	{ key: "telegram_contact", label: "Telegram Contact", type: "text" },
	{ key: "timezone", label: "Time Zone", type: "text" },
	{ key: "erc_address", label: "ERC Address", type: "text" },
	{ key: "trc_address", label: "TRC Address", type: "text" },
	{
		key: "minimum_balance_for_submissions",
		label: "Minimum Balance For Submissions",
		type: "number",
	},
	{ key: "telegram_username", label: "Telegram Username", type: "text" },
	{ key: "online_chat_url", label: "Online Chat URL", type: "text" },
	{ key: "online_embed_url", label: "Online Embedded Chat URL", type: "text" },
];

const inputClassName =
	"mt-2 block h-[48px] w-full rounded-xl border border-[#EC6345]/20 bg-white px-3 text-[16px] text-[#333333] outline-none transition focus:border-[#EC6345]/55 focus:ring-2 focus:ring-[#EC6345]/30";

const Settings = () => {
	const {
		handleChange,
		settingsData,
		handleSubmit,
		settings,
		isUpdatingSettings,
	} = useSetting();

	if (settingsData.isLoading) return <Loading />;
	if (settingsData.isError) return <Error />;

	return (
		<div className="space-y-5">
			<div>
				<h1 className="text-2xl font-semibold text-[#333333]">
					Settings Management
				</h1>
				<p className="text-sm text-[#333333]/60">
					Update global platform controls and contact channels.
				</p>
			</div>

			<div className="rounded-2xl border border-[#EC6345]/20 bg-white p-4 md:p-6">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{settingsFields.map((field) => (
						<div key={field.key}>
							<label className="text-sm font-medium text-[#333333]/80">
								{field.label}
							</label>
							<input
								type={field.type}
								className={inputClassName}
								value={settings?.[field.key] ?? ""}
								onChange={(e) =>
									handleChange(field.key, e.target.value)
								}
							/>
						</div>
					))}
				</div>

				<div className="mt-6 flex justify-end">
					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-xl border border-[#EC6345]/45 bg-[#EC6345] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
						onClick={handleSubmit}
						disabled={isUpdatingSettings}
					>
						{isUpdatingSettings && (
							<AiOutlineLoading className="animate-spin" />
						)}
						Save Settings
					</button>
				</div>
			</div>
		</div>
	);
};

export default Settings;
