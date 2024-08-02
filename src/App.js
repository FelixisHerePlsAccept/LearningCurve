import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import DarkMode from "./DarkMode";
import Router from "./routes";
import { AuthProvider } from "./AuthProvider/AuthGuard";


export default function App() {

  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <DarkMode />
          <Router />
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  )
}