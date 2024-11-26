import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/diagram-autograder/lecturer/Home";
import SideMenu from "./components/diagram-autograder/lecturer/SideMenu";
import CreateQuestion from "./pages/diagram-autograder/lecturer/CreateQuestion";
import ViewQuestions from "./pages/diagram-autograder/lecturer/ViewQuestions";
import { Toaster } from "./components/ui/toaster";
import ViewQuestion from "./pages/diagram-autograder/student/ViewQuestion";
import ViewAnswers from "./pages/diagram-autograder/lecturer/ViewAnswers";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Header } from "./components/ui/Header";

function App() {
  const [lecturer, setLecturer] = useState(true);
  const [autograder, setAutograder] = useState("d");

  return (
    <BrowserRouter>
      {autograder == "d" ? (
        <>
          <main className="flex">
            <SideMenu />
            <div className="flex-1">
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
        <>
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
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
