import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/lecturer/Home";
import SideMenu from "./components/lecturer/SideMenu";
import CreateQuestion from "./pages/lecturer/CreateQuestion";
import ViewQuestions from "./pages/lecturer/ViewQuestions";
import { Toaster } from "./components/ui/toaster";
import ViewQuestion from "./pages/student/ViewQuestion";

function App() {
  const lecturer = false;

  return (
    <BrowserRouter>
      <main className="flex">
        <SideMenu />
        <div className="flex-1">
          <Routes>
            {lecturer ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/create/q" element={<CreateQuestion />} />
                <Route path="/view/q" element={<ViewQuestions />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/view/q" element={<ViewQuestion />} />
              </>
            )}
          </Routes>
        </div>
      </main>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
