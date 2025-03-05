import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi, address } from "../constants/constants.js";
import HowItWorksDialog from './HowItWorks';
import AppDrawer from './AppDrawer';
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
} from '@mui/material';
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

    useEffect(() => {
        fetchRaffleData();
        listenForEvents();
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
        try {
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
            const contract = new ethers.Contract(address, abi, provider);

            contract.on("WinnerPicked", (winnerAddress) => {
                console.log("Winner event detected:", winnerAddress);
                setWinner(winnerAddress);
                setPlayers([]);
            });
        } catch (error) {
            console.error("Error listening for events:", error);
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
            />

            {/* Main Content with offset for drawer */}
            <Box
                sx={{
                    flexGrow: 1,
                    ml: `${drawerWidth}px`,
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Connected Account Box - Fixed Position in Top Right */}
                <Box
                    sx={{
                        position: "fixed",
                        top: theme.spacing(1.5),
                        right: theme.spacing(1.5),
                        zIndex: 1000,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
                            borderRadius: theme.shape.borderRadius,
                            border: `1px solid rgba(0, 209, 255, 0.3)`,
                            boxShadow: '0 2px 10px rgba(0, 209, 255, 0.15)',
                            backdropFilter: 'blur(8px)',
                            backgroundColor: 'rgba(10, 10, 20, 0.7)',
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
                                    backgroundColor: "rgba(255, 58, 48, 0.15)",
                                    color: "#ffffff",
                                    border: `1px solid ${theme.palette.error.main}`,
                                    height: "28px",
                                    fontSize: "0.8rem",
                                    padding: "0 0.5rem",
                                }}
                            />
                        )}
                    </Box>
                </Box>

                <Container maxWidth="lg" sx={{
                    pt: 4,
                    pb: 5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    {/* Main Title - Centered */}
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
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
                                mt: 0.5,
                            }}
                        >
                            Try your luck in our decentralized lottery
                        </Typography>
                    </Box>

                    {/* Main Grid */}
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        {/* Left Column - Entry */}
                        <Grid item xs={12} md={5}>
                            <Box sx={{
                                backgroundColor: theme.palette.background.card,
                                borderRadius: "12px",
                                border: `1px solid rgba(98, 0, 234, 0.2)`,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                minWidth: "300px",
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 20px rgba(98, 0, 234, 0.15)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 12px 28px rgba(98, 0, 234, 0.2)',
                                    transform: 'translateY(-4px)',
                                },
                            }}>
                                {/* Title */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: theme.palette.tertiary.main,
                                        textAlign: "center",
                                        py: 1.5,
                                        borderBottom: `1px solid rgba(98, 0, 234, 0.3)`,
                                    }}
                                >
                                    Enter the Raffle
                                </Typography>

                                {/* Content */}
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    p: 3,
                                    flexGrow: 1,
                                    justifyContent: "space-between",
                                }}>
                                    {/* Entrance Fee */}
                                    <Box sx={{ textAlign: "center", mb: 3 }}>
                                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                            Entrance fee:
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: theme.palette.secondary.main,
                                                fontWeight: "bold",
                                                animation: isLoading ? "pulse 1.5s infinite" : "none"
                                            }}
                                        >
                                            {entranceFee ? `${entranceFee} ETH` : "Loading..."}
                                        </Typography>
                                    </Box>

                                    {/* Enter Button */}
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mb: 4,
                                    }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={enterRaffle}
                                            disabled={isLoading || !account}
                                            sx={{
                                                width: "80%",
                                                height: "48px",
                                            }}
                                        >
                                            {isLoading ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                "ENTER RAFFLE"
                                            )}
                                        </Button>
                                    </Box>

                                    {/* Last Winner */}
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: theme.palette.warning.main,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mb: 1,
                                            }}
                                        >
                                            <span role="img" aria-label="trophy" style={{ marginRight: "8px" }}>🏆</span>
                                            Last Winner
                                        </Typography>
                                        <Box
                                            sx={{
                                                backgroundColor: theme.palette.background.elevated,
                                                border: `1px solid rgba(255, 140, 0, 0.3)`,
                                                borderRadius: theme.shape.borderRadius / 2,
                                                p: 1.5,
                                                textAlign: "center"
                                            }}
                                        >
                                            {winner ? (
                                                <Typography
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        wordBreak: "break-word",
                                                        fontFamily: "monospace"
                                                    }}
                                                    variant="body2"
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
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right Column - Participants */}
                        <Grid item xs={12} md={7}>
                            <Box sx={{
                                backgroundColor: theme.palette.background.card,
                                borderRadius: "12px",
                                border: `1px solid rgba(57, 255, 20, 0.2)`,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                minWidth: "400px",
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 20px rgba(57, 255, 20, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 12px 28px rgba(57, 255, 20, 0.15)',
                                    transform: 'translateY(-4px)',
                                },
                            }}>
                                {/* Title */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: theme.palette.secondary.main,
                                        textAlign: "center",
                                        py: 1.5,
                                        borderBottom: `1px solid rgba(57, 255, 20, 0.3)`,
                                    }}
                                >
                                    Current Participants
                                </Typography>

                                {/* Content */}
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    p: 3,
                                    flexGrow: 1,
                                    justifyContent: "space-between",
                                }}>
                                    {/* Participants Table */}
                                    <TableContainer sx={{ maxHeight: "200px", mb: 3 }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width="15%">#</TableCell>
                                                    <TableCell>Address</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {players.length > 0 ? (
                                                    players.map((player, index) => (
                                                        <TableRow key={index}>
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
                                                                backgroundColor: theme.palette.background.elevated,
                                                                py: 3,
                                                            }}
                                                        >
                                                            No participants yet. Be the first to join!
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Total Participants */}
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mb: 3,
                                    }}>
                                        <Box
                                            sx={{
                                                backgroundColor: theme.palette.background.elevated,
                                                border: `1px solid ${theme.palette.secondary.main}`,
                                                color: theme.palette.text.primary,
                                                fontWeight: "bold",
                                                borderRadius: "50px",
                                                padding: `${theme.spacing(0.75)} ${theme.spacing(2)}`,
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            Total Participants: {players.length}
                                        </Box>
                                    </Box>

                                    {/* Prize Pool */}
                                    <Box sx={{
                                        textAlign: "center",
                                        mb: 1,
                                    }}>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                                            Current Prize Pool
                                        </Typography>
                                        <Typography variant="h5" sx={{
                                            color: theme.palette.secondary.main,
                                            fontWeight: "600",
                                        }}>
                                            {entranceFee && players.length ? `${(entranceFee * players.length).toFixed(2)} ETH` : "0 ETH"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* How It Works Dialog */}
            <HowItWorksDialog
                open={howItWorksOpen}
                onClose={handleCloseHowItWorks}
            />
        </>
    );
};

export default Raffle;