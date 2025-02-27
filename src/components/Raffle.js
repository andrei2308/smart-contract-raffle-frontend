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

function Raffle({ account }) {
    const [entranceFee, setEntranceFee] = useState(null);
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [eligibleAddresses, setEligibleAddresses] = useState(new Set());
    useEffect(() => {
        fetchRaffleData();
        listenForEvents();
        return () => {
            contract.off("WinnerPicked", handleWinnerPicked);
            contract.off("AchievementEarned", handleAchievementEarned);
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
            contract.on("AchievementEarned", (player, achievementID) => {
                console.log("Achievement event detected:", player, achievementID);
                setEligibleAddresses((prev) => new Set(prev).add(player));
            }
            );
        } catch (error) {
            console.error("Error listening for events:", error);
        }
    };

    const truncateAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: "2rem", position: "relative" }}>
            {/* Connected Account Card - Fixed Position in Top Right */}
            <Box
                sx={{
                    position: "fixed",
                    top: "30px",
                    right: "30px",
                    zIndex: 1000,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        background: "linear-gradient(90deg, rgba(0, 65, 77, 0.8) 0%, rgba(0, 38, 77, 0.9) 100%)",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        boxShadow: "0 0 10px rgba(0, 209, 255, 0.3), 0 0 20px rgba(0, 0, 0, 0.4)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(0, 209, 255, 0.3)"
                    }}
                >
                    <Typography sx={{ color: "#00d1ff", marginRight: "0.5rem", fontSize: "0.9rem" }}>
                        Connected Account:
                    </Typography>
                    {account ? (
                        <Chip
                            label={truncateAddress(account)}
                            size="small"
                            sx={{
                                backgroundColor: "rgba(57, 255, 20, 0.2)",
                                color: "#ffffff",
                                border: "1px solid #39ff14",
                                fontFamily: "monospace",
                                fontWeight: "bold"
                            }}
                        />
                    ) : (
                        <Chip
                            label="Not connected"
                            size="small"
                            sx={{
                                backgroundColor: "rgba(255, 58, 48, 0.2)",
                                color: "#ffffff",
                                border: "1px solid #ff3a30"
                            }}
                        />
                    )}
                </Box>
            </Box>

            {/* Main Title - Centered */}
            <Box sx={{ textAlign: "center", marginBottom: "3rem", marginTop: "2rem" }}>
                <Typography
                    variant="h3"
                    sx={{
                        color: "#00d1ff",
                        fontWeight: "bold",
                        textShadow: "0px 0px 10px rgba(0, 209, 255, 0.3)"
                    }}
                >
                    🎟️ Raffle 🎟️
                </Typography>
            </Box>

            {/* Main Grid */}
            <Grid container spacing={3} justifyContent="center">
                {/* Left Column - Entry */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        backgroundColor: "rgba(30, 30, 30, 0.8)",
                        padding: "1.5rem",
                        borderRadius: "10px",
                        height: "100%"
                    }}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#00d1ff",
                                textAlign: "center",
                                marginBottom: "2rem",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Enter&nbsp;the&nbsp;raffle
                        </Typography>

                        <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
                            <Typography variant="h6" sx={{ color: "#ffffff", marginBottom: "0.5rem" }}>
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

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                variant="contained"
                                onClick={enterRaffle}
                                disabled={isLoading || !account}
                                sx={{
                                    fontSize: "1.2rem",
                                    padding: "0.75rem 2rem",
                                    backgroundColor: "#00E5FF",
                                    fontWeight: "bold",
                                    borderRadius: "50px",
                                    "&:hover": {
                                        backgroundColor: "#00BFFF"
                                    },
                                    minWidth: "200px"
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                                ) : (
                                    "ENTER RAFFLE"
                                )}
                            </Button>
                        </Box>

                        <Box sx={{ marginTop: "3rem" }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: "#FF8C00",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "1rem"
                                }}
                            >
                                🏆 Last winner
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: "rgba(255, 140, 0, 0.1)",
                                    border: "1px solid rgba(255, 140, 0, 0.3)",
                                    borderRadius: "6px",
                                    padding: "1rem",
                                    textAlign: "center"
                                }}
                            >
                                {winner ? (
                                    <Typography
                                        variant="body1"
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
                                        variant="body1"
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
                    </Card>
                </Grid>

                {/* Right Column - Participants */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        backgroundColor: "rgba(30, 30, 30, 0.8)",
                        padding: "1.5rem",
                        borderRadius: "10px",
                        height: "100%"
                    }}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#39ff14",
                                textAlign: "center",
                                marginBottom: "2rem",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Current&nbsp;participants
                        </Typography>

                        <TableContainer
                            component={Paper}
                            sx={{
                                backgroundColor: "rgba(20, 20, 20, 0.9)",
                                maxHeight: "300px",
                                marginBottom: "1rem"
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "rgba(57, 255, 20, 0.1)",
                                                color: "#00d1ff",
                                                fontWeight: "bold",
                                                width: "20%"
                                            }}
                                        >
                                            #
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "rgba(57, 255, 20, 0.1)",
                                                color: "#00d1ff",
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
                                            <TableRow key={index}>
                                                <TableCell sx={{ color: "#ffffff" }}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        color: "#ffffff",
                                                        wordBreak: "break-word",
                                                        fontFamily: "monospace",
                                                        fontSize: "0.9rem"
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
                                                sx={{ color: "#aaaaaa", fontStyle: "italic" }}
                                            >
                                                No participants yet
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Chip
                                label={`Total Participants: ${players.length}`}
                                sx={{
                                    backgroundColor: "rgba(57, 255, 20, 0.2)",
                                    color: "#ffffff",
                                    border: "1px solid #39ff14",
                                    fontWeight: "bold"
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Raffle;