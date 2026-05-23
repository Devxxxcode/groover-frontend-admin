import { useRef, useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineLoading } from "react-icons/ai";
import { useDispatch } from "react-redux";
import logo from "../../assets/LogoWithText.svg";
import { usePostRequestMutation } from "../../services/api/request";
import { ENDPOINT } from "../../constants/endpoint";
import { setUser } from "../../services/slices/user-slice";
import { validateForm } from "../../helpers/validate-form";

const Login = () => {
	const dispatch = useDispatch();
	const [showPopup, setShowPopup] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const emailInputRef = useRef(null);
	const passwordInputRef = useRef(null);

	const [postLoginForm, { isLoading }] = usePostRequestMutation();

	useEffect(() => {
		const savedRememberMe = localStorage.getItem("rememberMe");
		const savedUsername = localStorage.getItem("savedUsername");

		if (savedRememberMe === "true" && savedUsername) {
			setRememberMe(true);
			if (emailInputRef.current) {
				emailInputRef.current.value = savedUsername;
			}
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const formValues = {
				username_or_email: emailInputRef.current.value,
				password: passwordInputRef.current.value,
			};

			const isValidForm = validateForm(formValues);
			if (!isValidForm) return;

			if (rememberMe) {
				localStorage.setItem("rememberMe", "true");
				localStorage.setItem("savedUsername", formValues.username_or_email);
			} else {
				localStorage.removeItem("rememberMe");
				localStorage.removeItem("savedUsername");
			}

			const res = await postLoginForm({
				url: ENDPOINT.ADMIN_LOGIN,
				body: formValues,
			}).unwrap();

			setShowPopup(true);
			setTimeout(() => {
				setShowPopup(false);
				dispatch(
					setUser({
						access_token: res?.data?.access,
						refresh_token: res?.data?.refresh,
					}),
				);
			}, 1400);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-[#F7F6F0]">
			<header className="bg-[#2d2d2d] px-5 py-4 sm:px-8">
				<div className="mx-auto flex max-w-[1150px] items-center">
					<a href="/" className="flex items-center transition-opacity hover:opacity-80">
						<img src={logo} alt="Groover" className="h-auto w-[145px]" />
					</a>
				</div>
			</header>

			<main className="mx-auto grid w-full max-w-[1250px] flex-1 grid-cols-1 gap-8 px-5 py-6 md:px-8 md:py-1 lg:grid-cols-2">
				<section className="flex items-center">
					<div className="max-w-[560px] py-8">
						<p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff6b56]">
							Groover Admin
						</p>
						<h1 className="mt-3 text-4xl font-black leading-[1.08] text-[#2d2d2d] sm:text-5xl">
							Control the platform
							<br />
							with confidence.
						</h1>
						<p className="mt-5 text-lg leading-8 text-[#333333]/75">
							Manage users, packs, deposits, withdrawals and settings from one
							unified control center.
						</p>
					</div>
				</section>

				<section className="relative flex flex-col justify-center p-5 sm:p-8 lg:p-12">
					<div className="absolute right-12 top-12 h-24 w-24 rounded-full border-4 border-[#8fa3d9] opacity-40" />
					<div className="absolute right-32 top-20 h-8 w-8 rounded-full bg-[#e8a89d] opacity-50" />
					<div className="absolute right-20 top-32 h-12 w-12 rounded-full border-4 border-[#8fa3d9] opacity-40" />
					<div className="absolute bottom-32 left-8 h-16 w-16 rounded-full bg-[#e8a89d] opacity-40" />
					<div className="absolute bottom-20 right-20 h-12 w-12 rounded-full border-4 border-[#d4a5a0] opacity-40" />

					<motion.div
						initial={{ opacity: 0, y: 22 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, ease: "easeOut" }}
						className="relative z-10 mx-auto w-full max-w-md"
					>
						<h1 className="mb-2 text-3xl font-black text-[#2d2d2d]">
							Welcome Back
						</h1>
						<p className="mb-8 text-sm text-gray-600">
							Please enter your details to sign in.
						</p>

						<form className="space-y-5" onSubmit={handleSubmit}>
							<div>
								<label
									htmlFor="email"
									className="mb-2 block text-sm font-semibold text-[#2d2d2d]"
								>
									Username or Email
								</label>
								<div className="relative">
									<FiUser className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
									<input
										ref={emailInputRef}
										type="text"
										id="email"
										placeholder="Enter your username or email"
										className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#ff6b56] focus:ring-1 focus:ring-[#ff6b56]"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="password"
									className="mb-2 block text-sm font-semibold text-[#2d2d2d]"
								>
									Password
								</label>
								<div className="relative">
									<FiLock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
									<input
										ref={passwordInputRef}
										type={showPassword ? "text" : "password"}
										id="password"
										placeholder="Enter password"
										className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-12 text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#ff6b56] focus:ring-1 focus:ring-[#ff6b56]"
									/>
									<button
										type="button"
										onClick={() => setShowPassword((prev) => !prev)}
										className="absolute right-4 top-3.5 text-gray-400 transition-colors hover:text-[#ff6b56]"
									>
										{showPassword ? (
											<FiEyeOff className="h-5 w-5" />
										) : (
											<FiEye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>

							<div className="flex items-center justify-between pt-2">
								<label className="flex cursor-pointer items-center gap-2">
									<input
										id="remember-me"
										name="remember-me"
										type="checkbox"
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
										className="h-4 w-4 rounded border border-gray-300 accent-[#ff6b56]"
									/>
									<span className="text-sm text-gray-700">Remember me</span>
								</label>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff6b56] py-3 font-bold text-white transition-colors hover:bg-[#ff5544] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isLoading && (
									<AiOutlineLoading className="animate-spin" />
								)}
								Log in
							</button>
						</form>
					</motion.div>
				</section>
			</main>

			<AnimatePresence>
				{showPopup && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="mx-4 max-w-sm rounded-xl bg-white p-8 text-center"
						>
							<FaCheckCircle className="mx-auto mb-4 h-16 w-16 text-[#ff6b56]" />
							<h2 className="mb-2 text-2xl font-bold text-[#2d2d2d]">
								Login Successful!
							</h2>
							<p className="text-gray-600">Redirecting to dashboard...</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Login;
