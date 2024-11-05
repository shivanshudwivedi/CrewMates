// src/App.tsx

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import CrewmateManager from './components/CrewmateManager';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingTop: '2rem' }}>
        <CrewmateManager />
      </div>
    </ThemeProvider>
  );
}

export default App;