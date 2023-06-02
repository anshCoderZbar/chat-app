import { useEffect, useState } from "react";
import { AllRoutes } from "./routes";
import { AppContext } from "./store";

function App() {
  const { auth } = AppContext();
  const [loading, setLoading] = useState(true);
  const spinner = document.getElementById("spinner");
  const root = document.getElementById("root");

  useEffect(() => {
    if (!root) {
      spinner.style.display = "block";
      setLoading(true);
    } else {
      setTimeout(() => {
        spinner.style.display = "none";
        setLoading(false);
      }, 10);
    }
  }, []);

  return <>{!loading && <AllRoutes token={auth?.accessToken} />}</>;
}

export default App;
