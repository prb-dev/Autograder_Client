import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SideMenu from "./components/SideMenu";

function App() {
  return (
    <BrowserRouter>
      <main className="flex">
        <SideMenu />
        <div className="flex-1">
          <Routes>
            <Route path="/create/q" element={<Home />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
