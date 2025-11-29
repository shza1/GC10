import { Suspense, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { getTheme } from './theme';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { routes } from './routes';
import {createTheme} from "@mui/material/styles";

function App() {
  const [mode, setMode] = useState('light');

    const theme = useMemo(() => {
        const baseTheme = getTheme(mode);
        return createTheme(baseTheme, {
            components: {
                MuiContainer: {
                    defaultProps: {
                        maxWidth: false,
                    },
                },
            },
        });
    }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header onThemeToggle={toggleTheme} mode={mode} />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {routes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Routes>
            </Suspense>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
