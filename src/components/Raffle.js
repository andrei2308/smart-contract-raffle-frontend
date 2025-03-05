import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi, address } from "../constants/constants.js";
import {
    Container,
    Button,
    Typography,
    CircularProgress,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Chip,
    Grid
} from "@mui/material";
import "../App.css";
import { useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Link
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HistoryIcon from '@mui/icons-material/History';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// Define drawer width
const drawerWidth = 240;
function Raffle({ account }) {
    const [entranceFee, setEntranceFee] = useState(null);
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        background: "#0a0a14",
                        borderRight: "1px solid rgba(0, 209, 255, 0.15)",
                    },
                }}
            >
                {/* Drawer Header */}
                <Box
                    sx={{
                        padding: "1rem",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                >
                    <CasinoIcon sx={{ color: "#00d1ff", marginRight: "0.5rem", fontSize: "1.8rem" }} />
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#00d1ff",
                                fontWeight: "bold",
                                lineHeight: 1.2,
                                fontSize: "1.2rem",
                            }}
                        >
                            DApp Raffle
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgba(255, 255, 255, 0.6)",
                                display: "block",
                                fontSize: "0.7rem",
                            }}
                        >
                            Decentralized lottery system
                        </Typography>
                    </Box>
                </Box>

                {/* Navigation Menu */}
                <List sx={{ padding: "0" }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={true}
                            sx={{
                                "&.Mui-selected": {
                                    backgroundColor: "rgba(0, 209, 255, 0.1)",
                                    borderLeft: "3px solid #00d1ff",
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 209, 255, 0.15)",
                                    },
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: "#00d1ff", minWidth: "40px" }}>
                                <CardGiftcardIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Current Raffle"
                                primaryTypographyProps={{
                                    color: "#ffffff",
                                    fontSize: "0.9rem",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            sx={{
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: "#aaaaaa", minWidth: "40px" }}>
                                <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Past Raffles"
                                primaryTypographyProps={{
                                    color: "#aaaaaa",
                                    fontSize: "0.9rem",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            sx={{
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: "#aaaaaa", minWidth: "40px" }}>
                                <InfoOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="How It Works"
                                primaryTypographyProps={{
                                    color: "#aaaaaa",
                                    fontSize: "0.9rem",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Box sx={{ flexGrow: 1 }} />

                {/* Stats Section */}
                <Box sx={{ padding: "0.75rem 1rem" }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: "#aaaaaa",
                            marginBottom: "0.5rem",
                            fontSize: "0.7rem",
                            letterSpacing: "1px",
                        }}
                    >
                        STATISTICS
                    </Typography>
                    <List dense sx={{ padding: 0 }}>
                        <ListItem sx={{ padding: "0.25rem 0" }}>
                            <ListItemText
                                primary="Total Value Locked"
                                primaryTypographyProps={{
                                    color: "#ffffff",
                                    variant: "body2",
                                    fontSize: "0.8rem",
                                }}
                                secondary="42.5 ETH"
                                secondaryTypographyProps={{
                                    color: "#39ff14",
                                    fontWeight: "bold",
                                    fontSize: "0.85rem"
                                }}
                            />
                        </ListItem>
                        <ListItem sx={{ padding: "0.25rem 0" }}>
                            <ListItemText
                                primary="Total Raffles Completed"
                                primaryTypographyProps={{
                                    color: "#ffffff",
                                    variant: "body2",
                                    fontSize: "0.8rem",
                                }}
                                secondary="24"
                                secondaryTypographyProps={{
                                    color: "#00d1ff",
                                    fontWeight: "bold",
                                    fontSize: "0.85rem"
                                }}
                            />
                        </ListItem>
                        <ListItem sx={{ padding: "0.25rem 0" }}>
                            <ListItemText
                                primary="Total Unique Winners"
                                primaryTypographyProps={{
                                    color: "#ffffff",
                                    variant: "body2",
                                    fontSize: "0.8rem",
                                }}
                                secondary="18"
                                secondaryTypographyProps={{
                                    color: "#FF8C00",
                                    fontWeight: "bold",
                                    fontSize: "0.85rem"
                                }}
                            />
                        </ListItem>
                    </List>
                </Box>

                {/* Version & Link */}
                <Box
                    sx={{
                        padding: "0.5rem 1rem",
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="caption" sx={{ color: "#666666" }}>
                        v1.0.0
                    </Typography>
                    <Link
                        href="#"
                        underline="hover"
                        sx={{ color: "#00d1ff", fontSize: "0.75rem" }}
                    >
                        View Contract
                    </Link>
                </Box>
            </Drawer>

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
                        top: "12px",
                        right: "12px",
                        zIndex: 1000,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0.5rem 1rem",
                            borderRadius: "10px",
                            border: "1px solid rgba(0, 209, 255, 0.3)",
                            boxShadow: "0 2px 10px rgba(0, 209, 255, 0.15)",
                        }}
                    >
                        <Typography sx={{
                            color: "#00d1ff",
                            marginRight: "0.75rem",
                            fontSize: "0.85rem",
                            fontWeight: "medium",
                        }}>
                            Connected:
                        </Typography>
                        {account ? (
                            <Chip
                                label={truncateAddress(account)}
                                size="small"
                                sx={{
                                    backgroundColor: "rgba(57, 255, 20, 0.15)",
                                    color: "#ffffff",
                                    border: "1px solid #39ff14",
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
                                    border: "1px solid #ff3a30",
                                    height: "28px",
                                    fontSize: "0.8rem",
                                    padding: "0 0.5rem",
                                }}
                            />
                        )}
                    </Box>
                </Box>

                <Container maxWidth="lg" sx={{
                    pt: 3,
                    pb: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    {/* Main Title - Centered */}
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#00d1ff",
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
                            variant="subtitle2"
                            sx={{
                                color: "rgba(255, 255, 255, 0.7)",
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
                                backgroundColor: "rgba(20, 20, 30, 0.5)",
                                borderRadius: "8px",
                                border: "1px solid rgba(98, 0, 234, 0.2)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                minWidth: "300px",
                            }}>
                                {/* Title */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "#6200ea",
                                        textAlign: "center",
                                        py: 1.5,
                                        borderBottom: "1px solid rgba(98, 0, 234, 0.3)",
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
                                        <Typography variant="subtitle1" sx={{ color: "#ffffff", mb: 1 }}>
                                            Entrance fee:
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: "#39ff14",
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
                                            onClick={enterRaffle}
                                            disabled={isLoading || !account}
                                            sx={{
                                                fontSize: "1rem",
                                                padding: "0.6rem 1.5rem",
                                                height: "48px",
                                                lineHeight: "1.1",
                                                background: "linear-gradient(90deg, #00ffcc 0%, #00E5FF 100%)",
                                                color: "#000000",
                                                fontWeight: "bold",
                                                borderRadius: "50px",
                                                width: "80%",
                                                "&:hover": {
                                                    background: "linear-gradient(90deg, #00ffcc 20%, #00E5FF 100%)",
                                                },
                                            }}
                                        >
                                            {isLoading ? (
                                                <CircularProgress size={24} sx={{ color: "#ffffff" }} />
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
                                                color: "#FF8C00",
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
                                                backgroundColor: "rgba(20, 20, 30, 0.7)",
                                                border: "1px solid rgba(255, 140, 0, 0.3)",
                                                borderRadius: "4px",
                                                p: 1.5,
                                                textAlign: "center"
                                            }}
                                        >
                                            {winner ? (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#ffffff",
                                                        wordBreak: "break-word",
                                                        fontFamily: "monospace"
                                                    }}
                                                >
                                                    {winner}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#aaaaaa",
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
                                backgroundColor: "rgba(20, 20, 30, 0.5)",
                                borderRadius: "8px",
                                border: "1px solid rgba(57, 255, 20, 0.2)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                minWidth: "400px",
                            }}>
                                {/* Title */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "#39ff14",
                                        textAlign: "center",
                                        py: 1.5,
                                        borderBottom: "1px solid rgba(57, 255, 20, 0.3)",
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
                                    <TableContainer
                                        sx={{
                                            backgroundColor: "rgba(20, 20, 30, 0.5)",
                                            borderRadius: "4px",
                                            border: "1px solid rgba(57, 255, 20, 0.1)",
                                            mb: 3,
                                            maxHeight: "200px",
                                        }}
                                    >
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            backgroundColor: "#0a0a14",
                                                            color: "#00d1ff",
                                                            fontWeight: "bold",
                                                            width: "15%",
                                                            borderBottom: "1px solid rgba(0, 209, 255, 0.2)",
                                                            py: 1,
                                                        }}
                                                    >
                                                        #
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            backgroundColor: "#0a0a14",
                                                            color: "#00d1ff",
                                                            fontWeight: "bold",
                                                            borderBottom: "1px solid rgba(0, 209, 255, 0.2)",
                                                            py: 1,
                                                        }}
                                                    >
                                                        Address
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {players.length > 0 ? (
                                                    players.map((player, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{
                                                                color: "#ffffff",
                                                                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                                                py: 0.75,
                                                            }}>
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    color: "#ffffff",
                                                                    wordBreak: "break-word",
                                                                    fontFamily: "monospace",
                                                                    fontSize: "0.8rem",
                                                                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                                                    py: 0.75,
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
                                                                color: "#aaaaaa",
                                                                fontStyle: "italic",
                                                                backgroundColor: "rgba(50, 50, 60, 0.3)",
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
                                                backgroundColor: "rgba(20, 20, 30, 0.7)",
                                                border: "1px solid #39ff14",
                                                color: "#ffffff",
                                                fontWeight: "bold",
                                                borderRadius: "50px",
                                                padding: "0.5rem 1.5rem",
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
                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 0.5 }}>
                                            Current Prize Pool
                                        </Typography>
                                        <Typography variant="h5" sx={{
                                            color: "#39ff14",
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
        </>
    );
}

export default Raffle;