import { ThemeProvider } from "styled-components";
import { BrowserRouter } from 'react-router-dom'
import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";
import { Router } from "./Router";
import { CyclesContextsProvider } from "./contexts/CyclesContexts";

export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <CyclesContextsProvider>
          <Router />
        </CyclesContextsProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}
