import React, { useState, useEffect, useRef } from "react";
import { keyframes } from '@emotion/react';
import { ethers } from "ethers";
import { abi, address } from "../constants/constants.js";
import HowItWorksDialog from './HowItWorks';
import AppDrawer from './AppDrawer';
import ClaimRewards from './ClaimRewards';
import WinnerCard from './Winner';
import Participants from './Participants';
import EnterRaffle from './Enter';
import PrizePool from './PrizePool';
import {
    Box,
    Typography,
    Container,
    Grid,
    Chip,
} from '@mui/material';
import { alpha } from "@mui/material/styles";
import "../App.css";
import theme from "../themes/theme.js"
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(0, 209, 255, 0.4); }
  70% { opacity: 1; box-shadow: 0 0 0 10px rgba(0, 209, 255, 0); }
  100% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(0, 209, 255, 0); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(57, 255, 20, 0.5); }
  50% { box-shadow: 0 0 20px rgba(57, 255, 20, 0.8); }
  100% { box-shadow: 0 0 5px rgba(57, 255, 20, 0.5); }
`;

const Particles = () => (
    <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
    }}>
        {Array.from({ length: 20 }).map((_, i) => (
            <Box
                key={i}
                sx={{
                    position: 'absolute',
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '50%',
                    opacity: Math.random() * 0.5 + 0.1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `${float} ${Math.random() * 10 + 15}s linear infinite`,
                }}
            />
        ))}
    </Box>
);
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'auto',
                backgroundColor: theme.palette.background.default,
                background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${theme.palette.background.default} 70%)`,
            }}
        >

            <Particles />

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
                    position: "relative",
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
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >

                    {/* Decorative elements */}
                    <Box sx={{
                        position: 'absolute',
                        top: -50,
                        left: '10%',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                        zIndex: 0,
                    }} />

                    <Box sx={{
                        position: 'absolute',
                        bottom: -30,
                        right: '15%',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 70%)`,
                        zIndex: 0,
                    }} />

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
                    {/* Top Row - Three Equal Boxes */}
                    <Grid container spacing={3} sx={{ height: "100%" }}>
                        {/* Left Column - Prize Pool Card */}
                        <PrizePool
                            entranceFee={entranceFee}
                            players={players}
                            theme={theme}
                        />

                        {/* Middle Column - Enter Raffle */}
                        <EnterRaffle
                            entranceFee={entranceFee}
                            players={players}
                            isLoading={isLoading}
                            account={account}
                            enterRaffle={enterRaffle}
                            theme={theme}
                        />

                        {/* Right Column - Participants */}
                        <Participants players={players} theme={theme} />

                        {/* Bottom Row - Last Winner Card (Full Width) */}
                        <WinnerCard winner={winner} theme={theme} />

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
        </Box>
    );
};

export default Raffle;