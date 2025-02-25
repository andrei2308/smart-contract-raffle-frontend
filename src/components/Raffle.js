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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

    return (
        <Container maxWidth="md" style={{ marginTop: "2rem" }}>
            <Card style={{ padding: "2rem", textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    🎰 Smart Contract Casino 🎰
                </Typography>

                <Typography variant="h6" color="primary">
                    Connected Account: {account}
                </Typography>
                <Typography variant="h6" color="secondary">
                    Entrance Fee: {entranceFee ? `${entranceFee} ETH` : "Loading..."}
                </Typography>
                <Button variant="outlined" color="secondary" onClick={fetchRaffleData}>
                    Refresh Raffle Info
                </Button>

                <Typography variant="h5" style={{ marginTop: "1rem" }}>
                    Enter the Raffle
                </Typography>
                <Button variant="contained" color="success" onClick={enterRaffle} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : "Enter Raffle"}
                </Button>

                <Typography variant="h5" style={{ marginTop: "1rem" }}>
                    Participants
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.length > 0 ? (
                                players.map((p, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{p}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        No participants yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h5" style={{ marginTop: "1rem" }}>
                    Last Winner
                </Typography>
                <Typography variant="body1">{winner || "No winner yet."}</Typography>
            </Card>
        </Container>
    );
}

export default Raffle;
