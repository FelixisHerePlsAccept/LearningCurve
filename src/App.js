import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Router from "./routes";
import { AuthProvider } from "./Provider/AuthProvider/AuthGuard";
import { CustomThemeProvider } from "./Provider/ThemeProvider/ThemeProvider";
import { MediaProvider } from "./Provider/MediaProvider/MediaProvider";
import FixedButton from "./page/FixedButton";
import { DataProvider } from "./Provider/DataProvider/DataProvider";


export default function App() {

  return (
    <AuthProvider>
      <CustomThemeProvider>
        <MediaProvider>
          <DataProvider>
            <HelmetProvider>
              <BrowserRouter>
                <Router />
                <FixedButton />
              </BrowserRouter>
            </HelmetProvider>
          </DataProvider>
        </MediaProvider>
      </CustomThemeProvider>
    </AuthProvider>
  )
}