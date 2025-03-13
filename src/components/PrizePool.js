import React from 'react';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Avatar,
    Grid,
    alpha
} from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';
const EthereumIcon = ({ color, size = 48 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 256 417"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
    >
        <path
            fill={color}
            d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
        />
        <path
            fill={color}
            d="M127.962 0L0 212.32l127.962 75.639V154.158z"
        />
        <path
            fill={color}
            d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
        />
        <path
            fill={color}
            d="M127.962 416.905v-104.72L0 236.585z"
        />
        <path
            fill={color}
            d="M127.961 287.958l127.96-75.637-127.96-58.162z"
        />
        <path
            fill={color}
            d="M0 212.32l127.96 75.638v-133.8z"
        />
    </svg>
);
const PrizePool = ({ entranceFee, players, theme }) => {
    return (
        <Grid item xs={12} md={4}>
            <Card sx={{
                height: "100%",
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                borderRadius: "16px",
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                overflow: "hidden",
                backdropFilter: 'blur(10px)',
                boxShadow: `0 8px 20px ${alpha(theme.palette.info.main, 0.15)}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': {
                    boxShadow: `0 12px 28px ${alpha(theme.palette.info.main, 0.2)}`,
                    transform: 'translateY(-4px)',
                },
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Card header with icon */}
                <CardHeader
                    avatar={
                        <Avatar sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.2),
                            color: theme.palette.info.main,
                        }}>
                            <AccountBalanceWallet />
                        </Avatar>
                    }
                    title="Prize Pool"
                    titleTypographyProps={{
                        variant: "h6",
                        color: theme.palette.info.main,
                        fontWeight: "bold"
                    }}
                    sx={{
                        borderBottom: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        pb: 1,
                    }}
                />
                <CardContent sx={{
                    textAlign: "center",
                    py: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1
                }}>
                    {/* Prize pool amount with decorative elements */}
                    <Box sx={{
                        position: 'relative',
                        mb: 3,
                        mt: 2,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        {/* Decorative circles */}
                        <Box sx={{
                            position: 'absolute',
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${alpha(theme.palette.info.main, 0.1)} 0%, transparent 70%)`,
                            zIndex: 0,
                        }} />

                        <Typography variant="h3" sx={{
                            color: theme.palette.secondary.main,
                            fontWeight: "700",
                            textShadow: `0 0 10px ${alpha(theme.palette.secondary.main, 0.3)}`,
                            zIndex: 1,
                            my: 2,
                            fontFamily: "'Roboto Mono', monospace"
                        }}>
                            {entranceFee && players.length ? `${(entranceFee * players.length).toFixed(2)} ETH` : "0 ETH"}
                        </Typography>
                    </Box>

                    <Box sx={{
                        width: '80%',
                        height: '2px',
                        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.info.main, 0.5)}, transparent)`,
                        mb: 3
                    }} />

                    <Typography variant="body1" color="text.secondary" sx={{
                        fontStyle: 'italic'
                    }}>
                        Total value to be won
                    </Typography>

                    {/* Decorative ETH icon at the bottom */}
                    <Box sx={{
                        mt: 'auto',
                        opacity: 0.1,
                        fontSize: '3rem',
                        color: theme.palette.info.main,
                    }}>
                        <EthereumIcon color={theme.palette.info.main} size={60} />
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default PrizePool;