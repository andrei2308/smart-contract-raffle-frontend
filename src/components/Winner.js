import React, { useState, useEffect, useRef } from "react";
import { keyframes } from '@emotion/react';
import { EmojiEvents } from '@mui/icons-material';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Avatar
} from '@mui/material';
import { alpha } from "@mui/material/styles";
import "../App.css";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const WinnerCard = ({ winner, theme }) => {
    return (
        <Grid item xs={12}>
            <Card sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                borderRadius: "16px",
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                overflow: "hidden",
                backdropFilter: 'blur(10px)',
                boxShadow: `0 8px 20px ${alpha(theme.palette.warning.main, 0.1)}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': {
                    boxShadow: `0 12px 28px ${alpha(theme.palette.warning.main, 0.15)}`,
                    transform: 'translateY(-4px)',
                },
            }}>
                {/* Decorative stars in background */}
                <Box sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '5%',
                    fontSize: '1.2rem',
                    color: alpha(theme.palette.warning.main, 0.1),
                    animation: `${float} 4s ease-in-out infinite`,
                }}>
                    ✨
                </Box>
                <Box sx={{
                    position: 'absolute',
                    top: '30%',
                    right: '8%',
                    fontSize: '1rem',
                    color: alpha(theme.palette.warning.main, 0.1),
                    animation: `${float} 5s ease-in-out infinite 1s`,
                }}>
                    ✨
                </Box>
                <Box sx={{
                    position: 'absolute',
                    bottom: '25%',
                    right: '15%',
                    fontSize: '0.8rem',
                    color: alpha(theme.palette.warning.main, 0.1),
                    animation: `${float} 3.5s ease-in-out infinite 0.5s`,
                }}>
                    ✨
                </Box>

                <CardHeader
                    avatar={
                        <Avatar sx={{
                            bgcolor: alpha(theme.palette.warning.main, 0.2),
                            color: theme.palette.warning.main,
                        }}>
                            <EmojiEvents />
                        </Avatar>
                    }
                    title="Last Winner"
                    titleTypographyProps={{
                        variant: "h6",
                        color: theme.palette.warning.main,
                        fontWeight: "bold"
                    }}
                    sx={{
                        borderBottom: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                        pb: 1,
                    }}
                />
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                    <Box
                        sx={{
                            backgroundColor: alpha(theme.palette.background.default, 0.5),
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                            borderRadius: theme.shape.borderRadius,
                            p: 2,
                            maxWidth: "600px",
                            width: '100%',
                            overflowWrap: "break-word",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                        }}
                    >
                        {/* Trophy decoration */}
                        {winner && (
                            <Box sx={{
                                position: 'absolute',
                                left: '16px',
                                color: alpha(theme.palette.warning.light, 0.2),
                                fontSize: '2rem',
                            }}>
                                🏆
                            </Box>
                        )}

                        {winner ? (
                            <Typography
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontFamily: "monospace",
                                    fontSize: "0.85rem",
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    backgroundColor: alpha(theme.palette.warning.main, 0.05),
                                }}
                            >
                                {winner}
                            </Typography>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <Box sx={{
                                    color: alpha(theme.palette.warning.main, 0.3),
                                    fontSize: '2rem',
                                    mb: 1,
                                    animation: `${float} 2s ease-in-out infinite`,
                                }}>
                                    🏆
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        fontStyle: "italic"
                                    }}
                                >
                                    No winner yet
                                </Typography>
                            </Box>
                        )}

                        {/* Trophy decoration */}
                        {winner && (
                            <Box sx={{
                                position: 'absolute',
                                right: '16px',
                                color: alpha(theme.palette.warning.light, 0.2),
                                fontSize: '2rem',
                            }}>
                                🏆
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default WinnerCard;