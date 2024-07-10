import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Router from "./routes/route";
import { HelmetProvider } from "react-helmet-async";
import DarkMode from "./DarkMode";


export default function App() {

  return (
    <HelmetProvider>
      <BrowserRouter>
        <DarkMode />
        <Routes>
          <Route path="" element={<Navigate to="/customlinktree/" replace />} />
        </Routes>
        <Router />
      </BrowserRouter>
    </HelmetProvider>
  )
}