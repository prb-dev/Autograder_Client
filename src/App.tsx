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
import EnglishAutograder from "./pages/english-autograder/englishAutograder";
import ViewAnswersStudent from "./pages/diagram-autograder/student/ViewAnswers";

// 1) Import your new side menus:
import SideMenuTechnicalLecturer from "./components/technical/lecturer/SideMenuTechnicalLecturer";
import SideMenuTechnicalStudent from "./components/technical/student/SideMenuTechnicalStudent";
import CreateTechnicalQuestion from "./pages/technical/lecturer/CreateTechnicalQuestion";
import ViewTechnicalExams from "./pages/technical/lecturer/ViewTechnicalExams";
import ViewTechnicalExamDetails from "./pages/technical/lecturer/ViewTechnicalExamDetails";
import LaunchTechnicalExams from "./pages/technical/lecturer/LaunchTechnicalExams";
import ViewTechnicalAnswers from "./pages/technical/lecturer/ViewTechnicalAnswers";
import ViewTechnicalAnswerDetails from "./pages/technical/lecturer/ViewTechnicalAnswerDetails";
import FindTechnicalAssignments from "./pages/technical/student/FindTechnicalAssignments";
import StartTechnicalExam from "./pages/technical/student/StartTechnicalExam";
import StudentMarksList from "./pages/technical/student/StudentMarksList";
import ViewStudentExamMarks from "./pages/technical/student/ViewStudentExamMarks";
import SideMenuPro from "./components/diagram-autograder/lecturer/SideMenuPro";
import SideMenuStu from "./components/programming-autograder/student/SideMenuStu";
import CreateProgrammingQ from "./pages/program-auotgrader/lecturer/CreateProgrammingQ";
import ViewProAssignments from "./pages/program-auotgrader/lecturer/ViewProAssignments";
import ViewSubmissions from "./pages/program-auotgrader/lecturer/ViewSubmissions";
import ViewSubmissionDetails from "./pages/program-auotgrader/lecturer/ViewSubmissionDetails";
import ViewStudentAssignments from "./pages/program-auotgrader/Student/ViewStudentAssignments";
import ViewSingleAssignment from "./pages/program-auotgrader/Student/ViewSingleAssignment";

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
      {autograder === "d" ? (
        <>
          <SidebarProvider>
            <DiagramSidebar lecturer={lecturer} />
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
                      <Route path="/view/q/:qid?" element={<ViewQuestions />} />
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
                      <Route
                        path="/view/a/:aid?"
                        element={<ViewAnswersStudent />}
                      />
                    </>
                  )}
                </Routes>
              </div>
            </main>
          </SidebarProvider>
          <Toaster />
        </>
      ) : autograder === "t" ? (
        <>
          <main className="flex">
            {/* 2) Conditionally show side menu for lecturer or student */}
            {lecturer ? (
              <SideMenuTechnicalLecturer />
            ) : (
              <SideMenuTechnicalStudent />
            )}

            <div className="h-[100vh] flex-1">
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

              {/* 3) Add "technical" Routes below */}
              <Routes>
                {lecturer ? (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/create/t"
                      element={<CreateTechnicalQuestion />}
                    />
                    <Route path="/view/t" element={<ViewTechnicalExams />} />
                    <Route
                      path="/launch/t"
                      element={<LaunchTechnicalExams />}
                    />
                    <Route
                      path="/view/t/:examId"
                      element={<ViewTechnicalExamDetails />}
                    />
                    <Route
                      path="/view-answers/t/"
                      element={<ViewTechnicalAnswers />}
                    />
                    <Route
                      path="/view-answers/t/:subId"
                      element={<ViewTechnicalAnswerDetails />}
                    />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/find-assignment/t"
                      element={<FindTechnicalAssignments />}
                    />
                    <Route
                      path="/find-assignment/t/:examId"
                      element={<StartTechnicalExam />}
                    />
                    <Route path="/marks/t" element={<StudentMarksList />} />
                    <Route
                      path="/marks/t/:subId"
                      element={<ViewStudentExamMarks />}
                    />
                  </>
                )}
              </Routes>
            </div>
          </main>
          <Toaster />
        </>
      ) : autograder == "p" ? (
        <>
          <main className="flex">
            {lecturer ? <SideMenuPro /> : <SideMenuStu />}

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
                    <Route
                      path="/procreate/q"
                      element={<CreateProgrammingQ />}
                    />
                    <Route
                      path="/pro/View/q"
                      element={<ViewProAssignments />}
                    />
                    <Route
                      path="/submissions/:assignmentId"
                      element={<ViewSubmissions />}
                    />
                    <Route
                      path="/submissions/details/:submissionId"
                      element={<ViewSubmissionDetails />}
                    />
                    {/* <Route path="/view/a" element={<ViewAnswers />} /> */}
                  </>
                ) : (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/findAssignment"
                      element={<ViewStudentAssignments />}
                    />
                    <Route
                      path="stu/assignment/:assignmentId"
                      element={<ViewSingleAssignment />}
                    />
                  </>
                )}
              </Routes>
            </div>
          </main>
          <Toaster />
        </>
      ) : autograder === "e" ? (
        <>
          <main className="flex">
            {/* 2) Conditionally show side menu for lecturer or student */}

            <div className="h-[100vh] flex-1">
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

              <EnglishAutograder />
            </div>
          </main>
          <Toaster />
        </>
      ) : (
        // If you want a fallback for other autograders or none selected
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
