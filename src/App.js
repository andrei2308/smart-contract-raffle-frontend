import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Raffle from "./components/Raffle";
import { Container, Button, Typography, Card, Box, CircularProgress, Snackbar, Alert, ThemeProvider, CssBaseline } from "@mui/material";
import { AccountBalanceWallet, Casino } from "@mui/icons-material";
import "./App.css";
import theme from "./themes/theme.js"
function Home({ account, setAccount }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (account) {
      navigate("/raffle");
    }
  }, [account, navigate]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const accounts = await window.ethereum.request({ method: "eth_accounts" });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          navigate("/raffle");
        } else {
          setError("Please connect MetaMask.");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setError("Failed to connect. Please try again.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    } else {
      setError("MetaMask is required!");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Card sx={{ p: 5, textAlign: 'center', backgroundColor: 'rgba(239, 210, 246, 0.9)' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Casino sx={{
            fontSize: 60,
            color: 'primary.main',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.7, transform: 'scale(0.95)' },
              '50%': { opacity: 1, transform: 'scale(1.05)' },
              '100%': { opacity: 0.7, transform: 'scale(0.95)' },
            },
          }} />
        </Box>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          🎟️ Welcome to the Raffle 🎟️
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Connect your wallet to enter exciting raffles and win amazing prizes!
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={connectWallet}
          disabled={loading}
          startIcon={loading ? null : <AccountBalanceWallet />}
          sx={{
            height: 56,
            position: 'relative',
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            "Connect Wallet"
          )}
        </Button>

        <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary' }}>
          Powered by Ethereum blockchain technology
        </Typography>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

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
