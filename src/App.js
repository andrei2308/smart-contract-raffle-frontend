import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Raffle from "./components/Raffle";
import { Container, Button, Typography, Card } from "@mui/material";

function Home({ account, setAccount }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      navigate("/raffle");
    }
  }, [account, navigate]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const accounts = await window.ethereum.request({ method: "eth_accounts" });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          navigate("/raffle");
        } else {
          alert("Please connect MetaMask.");
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is required!");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem", textAlign: "center" }}>
      <Card style={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          🎰 Welcome to the Raffle 🎰
        </Typography>
        <Button variant="contained" color="primary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      </Card>
    </Container>
  );
}

function App() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home account={account} setAccount={setAccount} />} />
        <Route path="/raffle" element={account ? <Raffle account={account} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
