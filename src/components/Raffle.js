import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { abi, address } from "../constants/constants.js";
import HowItWorksDialog from './HowItWorks';
import AppDrawer from './AppDrawer';
import ClaimRewards from './ClaimRewards';
import {
    Box,
    Typography,
    Container,
    Grid,
    Chip,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress,
    Card,
    CardHeader,
    CardContent,
} from '@mui/material';
import { alpha } from "@mui/material/styles";
import "../App.css";
import theme from "../themes/theme.js"
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
function Raffle({ account }) {
    const [entranceFee, setEntranceFee] = useState(null);
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [howItWorksOpen, setHowItWorksOpen] = useState(false);
    const [openClaimRewards, setOpenClaimRewards] = useState(false);
    const [eligibleAddresses, setEligibleAddresses] = useState(new Set());
    const [selectedMenu, setSelectedMenu] = useState('current');

    const listenersInitialized = useRef(false);
    const allEligibleAddresses = useRef(new Set());
    useEffect(() => {
        fetchRaffleData();
        let cleanupEvents;
        if (!listenersInitialized.current) {
            cleanupEvents = listenForEvents();
        }

        return () => {
            if (cleanupEvents && typeof cleanupEvents === 'function') {
                cleanupEvents();
            }
        };
    }, [account]);


    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    navigate("/raffle");
                } else {
                    navigate("/");
                }
            });
        }
    }, []);

    const handleOpenHowItWorks = () => {
        setHowItWorksOpen(true);
    };

    const handleCloseHowItWorks = () => {
        setHowItWorksOpen(false);
    };

    const fetchRaffleData = async () => {
        try {
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
            const contract = new ethers.Contract(address, abi, provider);

            const entranceFee = await contract.getEntranceFee();
            setEntranceFee(ethers.formatEther(entranceFee));

            let fetchedPlayers = [];
            for (let i = 0; i < 10; i++) {
                try {
                    const player = await contract.getPlayer(i);
                    fetchedPlayers.push(player);
                } catch {
                    break;
                }
            }
            setPlayers(fetchedPlayers);

            const lastWinner = await contract.getWinner();
            setWinner(lastWinner);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const enterRaffle = async () => {
        if (window.ethereum !== "undefined") {
            setIsLoading(true);
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(address, abi, signer);

                console.log("Fetching entrance fee...");
                const entranceFee = await contract.getEntranceFee();

                console.log("Entering the raffle...");
                const tx = await contract.enterRaffle({
                    value: entranceFee,
                    gasLimit: 1000000,
                });
                await tx.wait();

                alert("Successfully entered the raffle!");
                fetchRaffleData();
            } catch (error) {
                console.error("Error entering raffle:", error);
            }
            setIsLoading(false);
        } else {
            alert("Please install MetaMask.");
        }
    };

    const listenForEvents = async () => {
        if (listenersInitialized.current) {
            console.log("Event listeners already initialized, skipping setup");
            return () => console.log("Skipped cleanup for duplicate call");
        }

        try {
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
            const contract = new ethers.Contract(address, abi, provider);

            console.log("Setting up event listeners for the first time...");

            contract.on("WinnerPicked", (winnerAddress) => {
                console.log("Winner event detected:", winnerAddress);
                setWinner(winnerAddress);
                setPlayers([]);
            });

            contract.on("AchievementEarned", (player, achievementID) => {
                const safePlayer = String(player);
                const safeAchievementID = Number(achievementID);

                console.log("Achievement event detected:",
                    "Player:", safePlayer,
                    "AchievementID:", safeAchievementID);

                allEligibleAddresses.current.add(safePlayer.toLowerCase());

                setEligibleAddresses(prevAddresses => {
                    const newSet = new Set([...prevAddresses]);
                    newSet.add(safePlayer);
                    return newSet;
                });

                const achievementData = {
                    player: safePlayer,
                    achievementID: safeAchievementID
                };

                const allAddressesArray = Array.from(allEligibleAddresses.current);
                console.log("Current eligible addresses:", allAddressesArray);

                fetch("http://localhost:10001/api/submit/eligible", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(achievementData)
                })
                    .then(response => {
                        if (response.ok) {
                            console.log("Achievement data successfully sent");

                            return fetch("http://localhost:10001/api/submit/addresses", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    addresses: allAddressesArray,
                                    totalCount: allAddressesArray.length
                                })
                            });
                        } else {
                            return response.text().then(text => {
                                throw new Error(`Server error: ${text}`);
                            });
                        }
                    })
                    .then(response => {
                        if (response && response.ok) {
                            console.log("All addresses successfully sent, count:", allAddressesArray.length);
                        }
                    })
                    .catch(error => {
                        console.error("Error in API request:", error.message);
                    });
            });
            listenersInitialized.current = true;

            const cleanup = () => {
                console.log("Cleaning up event listeners");
                contract.removeAllListeners("WinnerPicked");
                contract.removeAllListeners("AchievementEarned");
                listenersInitialized.current = false;
            };

            return cleanup;
        } catch (error) {
            console.error("Error listening for events:", error);
            listenersInitialized.current = false;
            return () => console.log("No listeners to clean up");
        }
    };

    const truncateAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <>
            {/* Left Drawer */}
            <AppDrawer
                drawerWidth={drawerWidth}
                onOpenHowItWorks={handleOpenHowItWorks}
                onOpenClaimRewards={() => setOpenClaimRewards(true)}
                selectedMenu={selectedMenu}
            />

            {/* Main Content with offset for drawer */}
            <Box
                sx={{
                    flexGrow: 1,
                    ml: `${drawerWidth}px`,
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: theme.palette.background.default,
                }}
            >
                {/* Connected Account Box - Fixed Position in Top Right */}
                <Box
                    sx={{
                        position: "fixed",
                        top: theme.spacing(2),
                        right: theme.spacing(2),
                        zIndex: 1000,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
                            borderRadius: theme.shape.borderRadius,
                            border: `1px solid ${theme.palette.primary.light}`,
                            boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.15)}`,
                            backdropFilter: 'blur(8px)',
                            backgroundColor: alpha(theme.palette.background.paper, 0.7),
                        }}
                    >
                        <Typography sx={{
                            color: theme.palette.primary.main,
                            marginRight: theme.spacing(1),
                            fontSize: "0.85rem",
                            fontWeight: "medium",
                        }}>
                            Connected:
                        </Typography>
                        {account ? (
                            <Chip
                                label={truncateAddress(account)}
                                size="small"
                                color="secondary"
                                sx={{
                                    fontFamily: "monospace",
                                    fontWeight: "bold",
                                    height: "28px",
                                    fontSize: "0.8rem",
                                    padding: "0 0.5rem",
                                }}
                            />
                        ) : (
                            <Chip
                                label="Not connected"
                                size="small"
                                sx={{
                                    backgroundColor: alpha(theme.palette.error.main, 0.15),
                                    color: theme.palette.error.main,
                                    border: `1px solid ${theme.palette.error.main}`,
                                    height: "28px",
                                    fontSize: "0.8rem",
                                    padding: "0 0.5rem",
                                }}
                            />
                        )}
                    </Box>
                </Box>

                {/* Page Header */}
                <Box
                    sx={{
                        pt: 6,
                        pb: 4,
                        px: 4,
                        textAlign: "center",
                        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, transparent 100%)`,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: theme.palette.primary.main,
                        }}
                    >
                        <span role="img" aria-label="ticket" style={{ marginRight: "8px", fontSize: "1.6rem" }}>🎫</span>
                        Current Raffle
                        <span role="img" aria-label="ticket" style={{ marginLeft: "8px", fontSize: "1.6rem" }}>🎫</span>
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: theme.palette.text.secondary,
                            mt: 1,
                        }}
                    >
                        Try your luck in our decentralized lottery
                    </Typography>
                </Box>

                {/* Main Content Container */}
                <Container
                    maxWidth="lg"
                    sx={{
                        py: 4,
                        px: { xs: 2, sm: 3, md: 4 },
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                    }}
                >
                    {/* Main Content Grid */}
                    <Grid container spacing={3} sx={{ height: "100%" }}>
                        {/* Left Column - Raffle Info & Stats */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                            }}>
                                {/* Prize Info Card */}
                                <Card sx={{
                                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                    borderRadius: "16px",
                                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                    overflow: "hidden",
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: `0 8px 20px ${alpha(theme.palette.info.main, 0.15)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 12px 28px ${alpha(theme.palette.info.main, 0.2)}`,
                                        transform: 'translateY(-4px)',
                                    },
                                }}>
                                    <CardHeader
                                        title="Prize Pool"
                                        titleTypographyProps={{
                                            align: "center",
                                            variant: "h6",
                                            color: theme.palette.info.main,
                                            fontWeight: "bold"
                                        }}
                                        sx={{
                                            borderBottom: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                            pb: 1,
                                        }}
                                    />
                                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                                        <Typography variant="h4" sx={{
                                            color: theme.palette.secondary.main,
                                            fontWeight: "600",
                                            mb: 1,
                                        }}>
                                            {entranceFee && players.length ? `${(entranceFee * players.length).toFixed(2)} ETH` : "0 ETH"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total value to be won
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {/* Last Winner Card */}
                                <Card sx={{
                                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                    borderRadius: "16px",
                                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                    overflow: "hidden",
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: `0 8px 20px ${alpha(theme.palette.warning.main, 0.1)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 12px 28px ${alpha(theme.palette.warning.main, 0.15)}`,
                                        transform: 'translateY(-4px)',
                                    },
                                }}>
                                    <CardHeader
                                        title={
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <span role="img" aria-label="trophy" style={{ marginRight: "8px" }}>🏆</span>
                                                Last Winner
                                            </Box>
                                        }
                                        titleTypographyProps={{
                                            align: "center",
                                            variant: "h6",
                                            color: theme.palette.warning.main,
                                            fontWeight: "bold"
                                        }}
                                        sx={{
                                            borderBottom: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                            pb: 1,
                                        }}
                                    />
                                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                                        <Box
                                            sx={{
                                                backgroundColor: alpha(theme.palette.background.default, 0.5),
                                                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                                                borderRadius: theme.shape.borderRadius,
                                                p: 2,
                                                maxWidth: "100%",
                                                overflowWrap: "break-word"
                                            }}
                                        >
                                            {winner ? (
                                                <Typography
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        fontFamily: "monospace",
                                                        fontSize: "0.85rem"
                                                    }}
                                                >
                                                    {winner}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: theme.palette.text.secondary,
                                                        fontStyle: "italic"
                                                    }}
                                                >
                                                    No winner yet
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>

                        {/* Middle Column - Enter Raffle */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                height: "100%",
                                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                borderRadius: "16px",
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                backdropFilter: 'blur(10px)',
                                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    transform: 'translateY(-4px)',
                                },
                            }}>
                                <CardHeader
                                    title="Enter the Raffle"
                                    titleTypographyProps={{
                                        align: "center",
                                        variant: "h6",
                                        color: theme.palette.primary.main,
                                        fontWeight: "bold"
                                    }}
                                    sx={{
                                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                        pb: 1,
                                    }}
                                />
                                <CardContent sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexGrow: 1,
                                    p: 3
                                }}>
                                    {/* Entrance Fee */}
                                    <Box sx={{ textAlign: "center", mb: 4, mt: 2 }}>
                                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                                            Entrance fee:
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: theme.palette.primary.main,
                                                fontWeight: "bold",
                                                animation: isLoading ? "pulse 1.5s infinite" : "none",
                                                '@keyframes pulse': {
                                                    '0%': { opacity: 0.6 },
                                                    '50%': { opacity: 1 },
                                                    '100%': { opacity: 0.6 }
                                                }
                                            }}
                                        >
                                            {entranceFee ? `${entranceFee} ETH` : "Loading..."}
                                        </Typography>
                                    </Box>

                                    {/* Participants Count */}
                                    <Box sx={{
                                        background: alpha(theme.palette.background.default, 0.5),
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                        borderRadius: "12px",
                                        padding: 2,
                                        width: "100%",
                                        textAlign: "center",
                                        mb: 4
                                    }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Current Participants
                                        </Typography>
                                        <Typography variant="h5" color={theme.palette.text.primary} fontWeight="medium">
                                            {players.length}
                                        </Typography>
                                    </Box>

                                    {/* Enter Button */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={enterRaffle}
                                        disabled={isLoading || !account}
                                        fullWidth
                                        sx={{
                                            height: "54px",
                                            borderRadius: "27px",
                                            fontSize: "1rem",
                                            fontWeight: "bold",
                                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            mt: 'auto',
                                            '&:hover': {
                                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            "ENTER RAFFLE"
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Right Column - Participants */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                height: "100%",
                                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                borderRadius: "16px",
                                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                backdropFilter: 'blur(10px)',
                                boxShadow: `0 8px 20px ${alpha(theme.palette.secondary.main, 0.1)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: `0 12px 28px ${alpha(theme.palette.secondary.main, 0.15)}`,
                                    transform: 'translateY(-4px)',
                                },
                            }}>
                                <CardHeader
                                    title="Participants"
                                    titleTypographyProps={{
                                        align: "center",
                                        variant: "h6",
                                        color: theme.palette.secondary.main,
                                        fontWeight: "bold"
                                    }}
                                    sx={{
                                        borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                                        pb: 1,
                                    }}
                                />
                                <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    {/* Participants Table */}
                                    <TableContainer sx={{ flexGrow: 1, maxHeight: "400px" }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        width="15%"
                                                        sx={{
                                                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                                            color: theme.palette.secondary.main,
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        #
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                                            color: theme.palette.secondary.main,
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        Address
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {players.length > 0 ? (
                                                    players.map((player, index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{
                                                                '&:nth-of-type(odd)': {
                                                                    backgroundColor: alpha(theme.palette.background.default, 0.3),
                                                                },
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.action.hover, 0.1),
                                                                }
                                                            }}
                                                        >
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    wordBreak: "break-word",
                                                                    fontFamily: "monospace",
                                                                    fontSize: "0.8rem",
                                                                }}
                                                            >
                                                                {player}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={2}
                                                            align="center"
                                                            sx={{
                                                                color: theme.palette.text.secondary,
                                                                fontStyle: "italic",
                                                                py: 4,
                                                            }}
                                                        >
                                                            No participants yet. Be the first to join!
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* How It Works Dialog */}
            <HowItWorksDialog
                open={howItWorksOpen}
                onClose={handleCloseHowItWorks}
            />
            <ClaimRewards
                open={openClaimRewards}
                onClose={() => setOpenClaimRewards(false)}
                account={account}
            />
        </>
    );
};

export default Raffle;