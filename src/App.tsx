import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/diagram-autograder/lecturer/Home";
import CreateQuestion from "./pages/diagram-autograder/lecturer/CreateQuestion";
import ViewQuestions from "./pages/diagram-autograder/lecturer/ViewQuestions";
import { Toaster } from "./components/ui/toaster";
import ViewQuestion from "./pages/diagram-autograder/student/ViewQuestion";
import ViewAnswers from "./pages/diagram-autograder/lecturer/ViewAnswers";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { Header } from "./components/ui/Header";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { DiagramSidebar } from "./components/diagram-autograder/lecturer/DiagramSidebar";
import ViewQuestionsStudent from "./pages/diagram-autograder/student/ViewQuestions";

function App() {
  const [lecturer, setLecturer] = useState<boolean>(
    () => localStorage.getItem("lecturer") === "true"
  );

  const [autograder, setAutograder] = useState<string>(
    () => localStorage.getItem("autograder") ?? "d"
  );

  useEffect(() => {
    localStorage.setItem("lecturer", String(lecturer));
  }, [lecturer]);

  useEffect(() => {
    localStorage.setItem("autograder", autograder);
  }, [autograder]);

  return (
    <BrowserRouter>
      {autograder == "d" ? (
        <>
          <SidebarProvider>
            <DiagramSidebar />
            <main className="flex-1">
              <SidebarTrigger />
              <div className="h-[100vh]">
                <div className="flex justify-end items-center p-5 pt-0">
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
                      <Route
                        path="/view/:qid?/a/:aid?"
                        element={<ViewAnswers />}
                      />
                    </>
                  ) : (
                    <>
                      <Route path="/" element={<Home />} />
                      <Route
                        path="/view/q"
                        element={<ViewQuestionsStudent />}
                      />
                      <Route path="/view/q/:qid?" element={<ViewQuestion />} />
                    </>
                  )}
                </Routes>
              </div>
            </main>
          </SidebarProvider>
          <Toaster />
        </>
      ) : (
        <>
          <div className="flex justify-end items-center p-5 pt-0">
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
