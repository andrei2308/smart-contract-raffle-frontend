import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Raffle from "./components/Raffle";
import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import Home from "./components/Home.js";
import theme from "./themes/theme.js"

function App() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #121212, #1e1e1e);',
        pt: 2,
        pb: 2
      }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home account={account} setAccount={setAccount} />} />
            <Route path="/raffle" element={account ? <Raffle account={account} /> : <Navigate to="/" />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
