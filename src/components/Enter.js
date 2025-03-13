import React from 'react';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Avatar,
    Button,
    CircularProgress,
    Grid,
    alpha
} from '@mui/material';
import { AccessTime, People } from '@mui/icons-material';

const EnterRaffle = ({
    entranceFee,
    players,
    isLoading,
    account,
    enterRaffle,
    theme
}) => {
    return (
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
                position: 'relative',
                '&:hover': {
                    boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.2)}`,
                    transform: 'translateY(-4px)',
                },
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '30%',
                    background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.dark, 0.05)} 0%, transparent 100%)`,
                    zIndex: 0
                }} />

                <CardHeader
                    avatar={
                        <Avatar sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            color: theme.palette.primary.main,
                        }}>
                            <AccessTime />
                        </Avatar>
                    }
                    title="Enter the Raffle"
                    titleTypographyProps={{
                        variant: "h6",
                        color: theme.palette.primary.main,
                        fontWeight: "bold"
                    }}
                    sx={{
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        pb: 1,
                        zIndex: 1,
                    }}
                />
                <CardContent sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexGrow: 1,
                    p: 3,
                    zIndex: 1,
                }}>
                    {/* Entrance Fee */}
                    <Box sx={{
                        textAlign: "center",
                        mb: 4,
                        mt: 2,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
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
                        mb: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current Participants
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <People sx={{
                                color: theme.palette.primary.main,
                                mr: 1,
                                fontSize: '1.2rem'
                            }} />
                            <Typography variant="h5" color={theme.palette.text.primary} fontWeight="medium">
                                {players.length}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Enter Button with enhanced styling */}
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
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                            position: 'relative',
                            overflow: 'hidden',
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                backgroundColor: alpha(theme.palette.primary.light, 0.3),
                                transition: 'all 0.5s ease',
                                transform: 'rotate(30deg)',
                                opacity: 0,
                            },
                            '&:hover': {
                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                                transform: 'translateY(-2px)',
                                '&:before': {
                                    opacity: 0.3,
                                    transform: 'rotate(30deg) translate(10%, 10%)',
                                }
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
    );
};

export default EnterRaffle;