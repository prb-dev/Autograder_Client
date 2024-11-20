import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/lecturer/Home";
import SideMenu from "./components/lecturer/SideMenu";
import CreateQuestion from "./pages/lecturer/CreateQuestion";
import ViewQuestions from "./pages/lecturer/ViewQuestions";
import { Toaster } from "./components/ui/toaster";
import ViewQuestion from "./pages/student/ViewQuestion";
import ViewAnswers from "./pages/lecturer/ViewAnswers";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Header } from "./components/ui/Header";

function App() {
  const [lecturer, setLecturer] = useState(true);
  const [autograder, setAutograder] = useState("d");

  return (
    <BrowserRouter>
      <div className="flex justify-end items-center p-5">
        <Header toggler={setAutograder} />
        <div className="flex gap-2 items-center scale-90">
          <Switch
            id="user-type"
            checked={lecturer}
            onClick={() => setLecturer(!lecturer)}
          />
          <Label htmlFor="user-type"> Lecturer </Label>
        </div>
      </div>
      {autograder == "d" ? (
        <>
          <main className="flex">
            <SideMenu />
            <div className="flex-1">
              <Routes>
                {lecturer ? (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/create/q" element={<CreateQuestion />} />
                    <Route path="/view/q" element={<ViewQuestions />} />
                    <Route path="/view/a" element={<ViewAnswers />} />
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
        </>
      ) : (
        <></>
      )}
    </BrowserRouter>
  );
}

export default App;
