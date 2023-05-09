import { AllRoutes } from "./routes";
import { AppContext } from "./store";

function App() {
  const { auth } = AppContext();
  return <AllRoutes token={auth?.accessToken} />;
}

export default App;
