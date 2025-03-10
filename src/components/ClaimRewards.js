// components/ClaimRewards.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    AlertTitle,
    Divider,
    useTheme,
    Link
} from '@mui/material';
import { ethers } from 'ethers';
import { address, abi } from "../constants/constantsAirdrop.js"
import { BrowserProvider, Contract } from 'ethers';
import RedeemIcon from '@mui/icons-material/Redeem';

// ABI for the MerkleAirdrop contract - You need to replace this with your actual ABI
const CONTRACT_ABI = abi;
const CONTRACT_ADDRESS = address;

const ClaimRewards = ({ open, onClose, account }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [claimData, setClaimData] = useState(null);
    const [error, setError] = useState(null);
    const [alreadyClaimed, setAlreadyClaimed] = useState(false);
    const [claimSuccess, setClaimSuccess] = useState(false);
    const [txHash, setTxHash] = useState(null);

    useEffect(() => {
        if (open && account) {
            checkEligibility();
        }
    }, [open, account]);

    const checkEligibility = async () => {
        try {
            setLoading(true);
            setError(null);
            setClaimData(null);
            setAlreadyClaimed(false);
            console.log(account)
            const response = await fetch(`http://localhost:10001/api/claim/${account}`);

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
            console.log(response);
            const rawText = await response.text();

            let result;
            try {
                result = JSON.parse(rawText);
            } catch (jsonError) {
                console.error("JSON parse error:", jsonError);
                console.log("Raw response:", rawText);
                throw new Error(`Failed to parse server response: ${jsonError.message}`);
            }

            console.log(result);

            if (!result.success) {
                if (result.message === "Address is not eligible") {
                    setError("Your address is not eligible for rewards.");
                } else {
                    setError(result.message || "Unable to generate claim data");
                }
                setLoading(false);
                return;
            }

            setClaimData(result.data || result);
            setLoading(false);
        } catch (error) {
            console.error("Error checking eligibility:", error);
            setError(error.message || "An error occurred while checking eligibility");
            setLoading(false);
        }
    };

    const handleClaim = async () => {
        if (!claimData || !account) return;

        try {
            setClaiming(true);
            setError(null);

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );

            const tx = await contract.claimDefault(
                account.toLowerCase(),
                5,
                claimData.proof
            );

            setTxHash(tx.hash);

            await tx.wait();

            setClaimSuccess(true);
            setClaiming(false);
        } catch (error) {
            console.error("Error claiming rewards:", error);
            if (error.code === 'ACTION_REJECTED') {
                setError("Transaction was rejected by the user.");
            } else if (error.message.includes("AlreadyClaimed")) {
                setAlreadyClaimed(true);
                setError("Rewards already claimed.");
            } else {
                setError(error.message || "Failed to claim rewards.");
            }
            setClaiming(false);
        }
    };

    const handleClose = () => {
        if (!claiming) {
            setClaimData(null);
            setError(null);
            setClaimSuccess(false);
            setTxHash(null);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    background: theme.palette.background.card,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid rgba(0, 209, 255, 0.15)`,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                        boxShadow: '0 12px 32px rgba(0, 209, 255, 0.1)',
                    }
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 2
                }}
            >
                <RedeemIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Claim Rewards
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 2, minHeight: '250px', p: 3 }}>
                {!account ? (
                    <Alert
                        severity="warning"
                        sx={{
                            backgroundColor: 'rgba(255, 140, 0, 0.15)',
                            border: '1px solid rgba(255, 140, 0, 0.3)'
                        }}
                    >
                        <AlertTitle>Wallet Not Connected</AlertTitle>
                        Please connect your wallet to check eligibility for rewards.
                    </Alert>
                ) : loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
                        <CircularProgress sx={{ color: theme.palette.primary.main }} />
                    </Box>
                ) : error ? (
                    <Alert
                        severity="error"
                        sx={{
                            mt: 2,
                            backgroundColor: 'rgba(255, 58, 48, 0.15)',
                            border: '1px solid rgba(255, 58, 48, 0.3)'
                        }}
                    >
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                ) : alreadyClaimed ? (
                    <Alert
                        severity="info"
                        sx={{
                            mt: 2,
                            backgroundColor: 'rgba(0, 209, 255, 0.15)',
                            border: '1px solid rgba(0, 209, 255, 0.3)'
                        }}
                    >
                        <AlertTitle>Already Claimed</AlertTitle>
                        You have already claimed your rewards.
                    </Alert>
                ) : claimSuccess ? (
                    <Box>
                        <Alert
                            severity="success"
                            sx={{
                                mb: 2,
                                backgroundColor: 'rgba(57, 255, 20, 0.15)',
                                border: '1px solid rgba(57, 255, 20, 0.3)',
                                color: theme.palette.text.primary
                            }}
                        >
                            <AlertTitle>Success</AlertTitle>
                            You have successfully claimed your rewards!
                        </Alert>
                        {txHash && (
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Transaction:
                                <Link
                                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener"
                                    sx={{
                                        ml: 1,
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            color: theme.palette.primary.light,
                                            textDecoration: 'none'
                                        }
                                    }}
                                >
                                    View on Etherscan
                                </Link>
                            </Typography>
                        )}
                    </Box>
                ) : claimData ? (
                    <Box>
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                backgroundColor: 'rgba(57, 255, 20, 0.15)',
                                border: '1px solid rgba(57, 255, 20, 0.3)',
                                color: theme.palette.text.primary
                            }}
                        >
                            <AlertTitle>Eligible for Rewards</AlertTitle>
                            You are eligible to claim rewards!
                        </Alert>

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                mb: 2,
                                backgroundColor: 'rgba(20, 20, 30, 0.5)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(0, 209, 255, 0.15)'
                            }}
                        >
                            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main }}>
                                Reward Details
                            </Typography>
                            <Divider sx={{ mb: 2, borderColor: 'rgba(0, 209, 255, 0.15)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography variant="body2" color="text.secondary">Address:</Typography>
                                <Typography
                                    variant="monospace"
                                    sx={{
                                        wordBreak: 'break-all',
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    {account}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Amount:</Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    sx={{ color: theme.palette.secondary.main }}
                                >
                                    {claimData.amount} tokens
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                ) : (
                    <Alert
                        severity="info"
                        sx={{
                            borderRadius: theme.shape.borderRadius,
                            backgroundColor: 'rgba(0, 209, 255, 0.15)',
                            border: '1px solid rgba(0, 209, 255, 0.3)'
                        }}
                    >
                        <AlertTitle>Checking Eligibility</AlertTitle>
                        Connecting to the blockchain...
                    </Alert>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2.5,
                    borderTop: `1px solid ${theme.palette.divider}`
                }}
            >
                <Button
                    onClick={handleClose}
                    disabled={claiming}
                    sx={{
                        borderRadius: 50,
                        fontWeight: 600
                    }}
                >
                    Close
                </Button>
                {claimData && !claimSuccess && !alreadyClaimed && (
                    <Button
                        variant="contained"
                        onClick={handleClaim}
                        disabled={claiming}
                        startIcon={claiming ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{
                            background: theme.gradients.primary,
                            color: '#000000',
                            borderRadius: 50,
                            padding: '10px 24px',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(0, 209, 255, 0.2)',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(0, 209, 255, 0.3)',
                            }
                        }}
                    >
                        {claiming ? 'Claiming...' : 'Claim Rewards'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ClaimRewards;