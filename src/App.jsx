import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	homepage,
	home,
	allusers,
	userpasswords,
	trainingaccounts,
	negusers,
	deposits,
	withdrawals,
	bonuses,
	hold,
	packs,
	events,
	logs,
	settings,
	video,
	profile,
	notifications,
	products,
} from "./constants/app.routes";

import LoginLayout from "./pages/authentication/LoginLayout";
import HomeLayout from "./pages/dashboard/HomeLayout";
import Login from "./pages/authentication/Login";
import Home from "./pages/dashboard/Home";
import AllUsers from "./pages/dashboard/AllUsers";
import UserPasswords from "./pages/dashboard/UserPasswords";
import TrainingAccounts from "./pages/dashboard/TrainingAccounts";
import NegUsers from "./pages/dashboard/NegativeUsers";
import Deposits from "./pages/dashboard/Deposits";
import Withdrawals from "./pages/dashboard/Withdrawals";
import Bonuses from "./pages/dashboard/Bonuses";
import Hold from "./pages/dashboard/Hold";
import Packs from "./pages/dashboard/Packs";
import Events from "./pages/dashboard/Events";
import Logs from "./pages/dashboard/Logs";
import Settings from "./pages/dashboard/Settings";
import Video from "./pages/dashboard/Video";
import Profile from "./pages/dashboard/Profile";
import Notification from "./pages/dashboard/Notifications";
import { AuthRoute } from "./middleware/auth-route";
import { GuestRoute } from "./middleware/guest-route";
import { NotFound } from "./pages/dashboard/not-found";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./services/store";
import Products from "./pages/dashboard/Products";

function App() {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<Router>
					<Routes>
						{/* Authentication Layout */}
						<Route
							path={homepage}
							element={
								<GuestRoute>
									<LoginLayout />
								</GuestRoute>
							}
						>
							<Route index element={<Login />} />
						</Route>

						{/* Dashboard Layout */}
						<Route
							path={home}
							element={
								<AuthRoute>
									<HomeLayout />
								</AuthRoute>
							}
						>
							<Route index element={<Home />} />
							<Route path={products} element={<Products />} />
							<Route path={profile} element={<Profile />} />
							<Route path={allusers} element={<AllUsers />} />
							<Route path={trainingaccounts} element={<TrainingAccounts />} />
							<Route path={userpasswords} element={<UserPasswords />} />
							<Route path={negusers} element={<NegUsers />} />
							<Route path={deposits} element={<Deposits />} />
							<Route path={withdrawals} element={<Withdrawals />} />
							<Route path={bonuses} element={<Bonuses />} />
							<Route path={hold} element={<Hold />} />
							<Route path={packs} element={<Packs />} />
							<Route path={events} element={<Events />} />
							<Route path={logs} element={<Logs />} />
							<Route path={settings} element={<Settings />} />
							<Route path={video} element={<Video />} />
							<Route path={notifications} element={<Notification />} />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Router>
			</PersistGate>
		</Provider>
	);
}

export default App;
