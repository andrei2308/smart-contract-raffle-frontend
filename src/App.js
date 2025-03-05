import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Raffle from "./components/Raffle";
import { Container, Button, Typography, Card, Box, CircularProgress, Snackbar, Alert, ThemeProvider, CssBaseline, Chip } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import { AccountBalanceWallet, Casino } from "@mui/icons-material";
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
    <Container maxWidth="sm" sx={{
      mt: 10,
      mb: 10,
      position: 'relative',
      zIndex: 1
    }}>
      {/* Background decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: '-50%',
        left: '-100%',
        right: '-100%',
        bottom: '-50%',
        background: 'radial-gradient(circle at 30% 50%, rgba(0, 209, 255, 0.1) 0%, transparent 60%), radial-gradient(circle at 70% 20%, rgba(98, 0, 234, 0.08) 0%, transparent 60%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <Box sx={{
        position: 'relative',
        mb: 6,
        textAlign: 'center'
      }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #00ffcc 0%, #00d1ff 50%, #6200ea 100%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          DApp Raffle
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: '80%',
            margin: '0 auto'
          }}
        >
          Win Ethereum & NFTs in our decentralized lottery
        </Typography>
      </Box>

      <Card sx={{
        p: 0,
        borderRadius: '20px',
        background: 'rgba(20, 20, 30, 0.7)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(0, 209, 255, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 209, 255, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 209, 255, 0.2)',
          transform: 'translateY(-5px)'
        }
      }}>
        {/* Card header with gradient */}
        <Box sx={{
          p: 5,
          pb: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background glow */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(0, 209, 255, 0.15) 0%, transparent 70%)',
            animation: 'pulse 8s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': { opacity: 0.5, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.5)' },
              '100%': { opacity: 0.5, transform: 'scale(1)' },
            },
            zIndex: 0
          }} />

          <Box sx={{
            position: 'relative',
            zIndex: 1,
            mb: 3,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Box sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 209, 255, 0.3)',
              boxShadow: '0 0 30px rgba(0, 209, 255, 0.3)'
            }}>
              <Casino sx={{
                fontSize: 60,
                color: '#00d1ff',
                animation: 'spin 10s infinite linear, pulse 3s infinite ease-in-out',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
                '@keyframes pulse': {
                  '0%': { opacity: 0.7, transform: 'scale(0.95) rotate(0deg)' },
                  '50%': { opacity: 1, transform: 'scale(1.05) rotate(180deg)' },
                  '100%': { opacity: 0.7, transform: 'scale(0.95) rotate(360deg)' },
                },
              }} />
            </Box>
          </Box>

          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '0 0 10px rgba(0, 209, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <span role="img" aria-label="ticket">🎟️</span>
            Welcome to the Raffle
            <span role="img" aria-label="ticket">🎟️</span>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '90%',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Connect your wallet to enter exciting raffles and win amazing prizes!
          </Typography>
        </Box>

        {/* Raffle stats */}
        <Box sx={{
          px: 4,
          py: 3,
          display: 'flex',
          justifyContent: 'space-around',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(10, 10, 20, 0.5)'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              TOTAL PRIZE
            </Typography>
            <Typography variant="h6" sx={{ color: '#39ff14', fontWeight: 'bold' }}>
              42.5 ETH
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              CURRENT RAFFLE
            </Typography>
            <Typography variant="h6" sx={{ color: '#00d1ff', fontWeight: 'bold' }}>
              #25
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              PARTICIPANTS
            </Typography>
            <Typography variant="h6" sx={{ color: '#ff8c00', fontWeight: 'bold' }}>
              847
            </Typography>
          </Box>
        </Box>

        {/* Connect button section */}
        <Box sx={{ p: 5, pt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={connectWallet}
            disabled={loading}
            startIcon={loading ? null : <AccountBalanceWallet />}
            sx={{
              height: 60,
              position: 'relative',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #00ffcc 0%, #00d1ff 100%)',
              color: '#000000',
              textTransform: 'none',
              boxShadow: '0 10px 20px rgba(0, 209, 255, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 15px 30px rgba(0, 209, 255, 0.4)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={28} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            ) : (
              "Connect Wallet"
            )}
          </Button>

          <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 1.5 }}>
            <Chip
              label="Ethereum"
              size="small"
              sx={{
                backgroundColor: 'rgba(114, 137, 218, 0.15)',
                border: '1px solid rgba(114, 137, 218, 0.3)',
                color: '#7289da',
                fontWeight: 'medium'
              }}
            />
            <Chip
              label="Chainlink VRF"
              size="small"
              sx={{
                backgroundColor: 'rgba(0, 209, 255, 0.15)',
                border: '1px solid rgba(0, 209, 255, 0.3)',
                color: '#00d1ff',
                fontWeight: 'medium'
              }}
            />
            <Chip
              label="Decentralized"
              size="small"
              sx={{
                backgroundColor: 'rgba(57, 255, 20, 0.15)',
                border: '1px solid rgba(57, 255, 20, 0.3)',
                color: '#39ff14',
                fontWeight: 'medium'
              }}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 3,
              color: 'rgba(255, 255, 255, 0.4)',
              textAlign: 'center'
            }}
          >
            Powered by Ethereum blockchain technology • Secure & Transparent
          </Typography>
        </Box>
      </Card>

      {/* Safety badge */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 3,
        alignItems: 'center',
        gap: 1,
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.8rem'
      }}>
        <LockIcon sx={{ fontSize: '0.9rem' }} /> Your connection is secure and private
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
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
