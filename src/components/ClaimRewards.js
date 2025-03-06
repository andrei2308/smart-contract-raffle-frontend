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
                    borderRadius: '12px'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <RedeemIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">
                    Claim Rewards
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 2, minHeight: '200px' }}>
                {!account ? (
                    <Alert severity="warning">
                        <AlertTitle>Wallet Not Connected</AlertTitle>
                        Please connect your wallet to check eligibility for rewards.
                    </Alert>
                ) : loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                ) : alreadyClaimed ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <AlertTitle>Already Claimed</AlertTitle>
                        You have already claimed your rewards.
                    </Alert>
                ) : claimSuccess ? (
                    <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>
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
                                    sx={{ ml: 1 }}
                                >
                                    View on Etherscan
                                </Link>
                            </Typography>
                        )}
                    </Box>
                ) : claimData ? (
                    <Box>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            <AlertTitle>Eligible for Rewards</AlertTitle>
                            You are eligible to claim rewards!
                        </Alert>

                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Reward Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Address:</Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                    {account}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Amount:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {claimData.amount} tokens
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                ) : (
                    <Alert severity="info">
                        <AlertTitle>Checking Eligibility</AlertTitle>
                        Connecting to the blockchain...
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button onClick={handleClose} disabled={claiming}>
                    Close
                </Button>
                {claimData && !claimSuccess && !alreadyClaimed && (
                    <Button
                        variant="contained"
                        onClick={handleClaim}
                        disabled={claiming}
                        startIcon={claiming ? <CircularProgress size={20} /> : null}
                    >
                        {claiming ? 'Claiming...' : 'Claim Rewards'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ClaimRewards;