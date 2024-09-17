import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SideMenu from "./components/SideMenu";
import CreateQuestion from "./pages/CreateQuestion";
import ViewQuestions from "./pages/ViewQuestions";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <main className="flex">
        <SideMenu />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create/q" element={<CreateQuestion />} />
            <Route path="/view/q" element={<ViewQuestions />} />
          </Routes>
        </div>
      </main>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
