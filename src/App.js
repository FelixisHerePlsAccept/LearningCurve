import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Router from "./routes/route";
import { HelmetProvider } from "react-helmet-async";


export default function App() {

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Navigate to="/customlinktree/" replace />} />
        </Routes>
        <Router />
      </BrowserRouter>
    </HelmetProvider>
  )
}