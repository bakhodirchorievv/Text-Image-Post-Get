import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";

const Cases = lazy(() => import("./UserInterface/Cases"));
const DataControl = lazy(() => import("./Components/DataControl"));

const App = () => {
	return (
		<Router>
			<div>
				<Suspense fallback={<div>Loading...</div>}>
					<Routes>
						<Route path="/" element={<Cases />} />
						<Route path="/DataControl" element={<DataControl />} />
					</Routes>
				</Suspense>
			</div>
		</Router>
	);
};

export default App;
