import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Container, Button, Typography, Card, Box, CircularProgress, Snackbar, Alert, Chip } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import { AccountBalanceWallet, Casino } from "@mui/icons-material";

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
        <Container
            maxWidth="sm"
            sx={{
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden'
            }}
        >
            {/* Background gradient */}
            <Box sx={{
                position: 'fixed',
                inset: 0,
                background: 'radial-gradient(circle at 30% 50%, rgba(0, 209, 255, 0.1) 0%, transparent 60%), radial-gradient(circle at 70% 20%, rgba(98, 0, 234, 0.08) 0%, transparent 60%)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            {/* Header */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(90deg, #00ffcc 0%, #00d1ff 50%, #6200ea 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Decentralized Raffle
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Win Ethereum & NFTs in our decentralized lottery
                </Typography>
            </Box>

            {/* Main Card */}
            <Card sx={{
                maxWidth: '600px',
                width: '100%',
                borderRadius: '20px',
                background: 'rgba(20, 20, 30, 0.7)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(0, 209, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 209, 255, 0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                marginX: 'auto',
                '&:hover': {
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 209, 255, 0.2)',
                    transform: 'translateY(-5px)'
                }
            }}>
                {/* Card header */}
                <Box sx={{ p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    {/* Animated background glow */}
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at center, rgba(0, 209, 255, 0.15) 0%, transparent 70%)',
                        animation: 'pulse 8s infinite ease-in-out',
                        '@keyframes pulse': {
                            '0%': { opacity: 0.5, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.5)' },
                            '100%': { opacity: 0.5, transform: 'scale(1)' },
                        },
                        zIndex: 0
                    }} />

                    {/* Casino icon */}
                    <Box sx={{ position: 'relative', zIndex: 1, mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{
                            width: 70,
                            height: 70,
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
                                fontSize: 40,
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

                    <Typography variant="h5" gutterBottom sx={{
                        fontWeight: 'bold',
                        color: '#ffffff',
                        textShadow: '0 0 10px rgba(0, 209, 255, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}>
                        <span role="img" aria-label="ticket">🎟️</span>
                        Welcome to the Raffle
                        <span role="img" aria-label="ticket">🎟️</span>
                    </Typography>

                    <Typography variant="body2" sx={{
                        mb: 3,
                        color: 'rgba(255, 255, 255, 0.7)',
                        maxWidth: '90%',
                        mx: 'auto',
                    }}>
                        Connect your wallet to enter exciting raffles and win amazing prizes!
                    </Typography>
                </Box>

                {/* Raffle stats */}
                <Box sx={{
                    px: 3,
                    py: 2,
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
                <Box sx={{ p: 3 }}>
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
                            borderRadius: '28px',
                            fontSize: '1rem',
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
                            <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        ) : (
                            "Connect Wallet"
                        )}
                    </Button>

                    <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 1 }}>
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

                    <Typography variant="caption" sx={{
                        display: 'block',
                        mt: 2,
                        color: 'rgba(255, 255, 255, 0.4)',
                        textAlign: 'center'
                    }}>
                        Powered by Ethereum blockchain technology • Secure & Transparent
                    </Typography>
                </Box>
            </Card>

            {/* Safety badge */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
                mb: 0,
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
                    sx={{ width: '100%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Home;