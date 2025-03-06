// components/HowItWorksDialog.js
import React from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    IconButton,
    useTheme
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

const HowItWorksDialog = ({ open, onClose }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: theme.palette.background.card,
                    backgroundImage: 'linear-gradient(rgba(10, 10, 20, 0.8), rgba(10, 10, 20, 0.9))',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: `1px solid ${theme.palette.primary.main}30`,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2,
                pb: 3,
                pt: 3
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: '1.5rem' }} />
                    <Typography
                        variant="h5"
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold'
                        }}
                    >
                        How It Works
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            backgroundColor: `${theme.palette.primary.main}20`,
                            color: theme.palette.primary.main
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    {/* Step 1 */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            mb: 2
                        }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: `${theme.palette.primary.main}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 4,
                                mt: 5,
                                border: `2px solid ${theme.palette.primary.main}40`
                            }}>
                                <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>1</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                Connect Your Wallet
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Connect your Ethereum wallet to the DApp. We support MetaMask, WalletConnect, and other Web3 wallets.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Step 2 */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            mb: 2
                        }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: `${theme.palette.tertiary.main}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 4,
                                mt: 5,
                                border: `2px solid ${theme.palette.tertiary.main}40`
                            }}>
                                <Typography variant="h4" sx={{ color: theme.palette.tertiary.main, fontWeight: 'bold' }}>2</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                Enter the Raffle
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Pay the entrance fee in ETH to receive your raffle ticket. Each entrance gives you one ticket.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Step 3 */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            mb: 2
                        }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: `${theme.palette.secondary.main}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 4,
                                border: `2px solid ${theme.palette.secondary.main}40`
                            }}>
                                <Typography variant="h4" sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>3</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                Random Selection
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                When the raffle ends, Chainlink VRF (Verifiable Random Function) is used to select a winner completely at random.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Step 4 */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            mb: 2
                        }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: `${theme.palette.warning.main}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 4,
                                border: `2px solid ${theme.palette.warning.main}40`
                            }}>
                                <Typography variant="h4" sx={{ color: theme.palette.warning.main, fontWeight: 'bold' }}>4</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                Receive Prize
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                The winner automatically receives the entire prize pool directly to their wallet. No actions needed!
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Technical Details */}
                <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 2, fontWeight: 'bold' }}>
                        Technical Details
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, mb: 0.5, fontWeight: 'bold' }}>
                                    Smart Contract Security
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    Our raffle contracts are fully audited by leading security firms and use OpenZeppelin's battle-tested libraries.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, mb: 0.5, fontWeight: 'bold' }}>
                                    Chainlink VRF
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    We use Chainlink's Verifiable Random Function to ensure provably fair and tamper-proof random number generation.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, mb: 0.5, fontWeight: 'bold' }}>
                                    Automated Execution
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    Chainlink Keepers automate the raffle drawing process, ensuring winners are selected on time without human intervention.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, mb: 0.5, fontWeight: 'bold' }}>
                                    Transparency
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    All transactions are recorded on the Ethereum blockchain, providing complete transparency and verifiability.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                py: 2,
                px: 3
            }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: '50px', px: 3 }}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: '50px', px: 3 }}
                    href="https://sepolia.etherscan.io/address/0xd4db7a3294b03170f4b53ceff2268442eabe0b34"
                    target="_blank"
                >
                    View Smart Contract
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HowItWorksDialog;