import React from 'react';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Avatar,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    alpha
} from '@mui/material';
import { People } from '@mui/icons-material';

const Participants = ({ players, theme }) => {
    return (
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
                position: 'relative',
                '&:hover': {
                    boxShadow: `0 12px 28px ${alpha(theme.palette.secondary.main, 0.15)}`,
                    transform: 'translateY(-4px)',
                },
            }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.2),
                            color: theme.palette.secondary.main,
                        }}>
                            <People />
                        </Avatar>
                    }
                    title="Participants"
                    titleTypographyProps={{
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
                    {/* Participants Table with enhanced styling */}
                    <TableContainer sx={{ flexGrow: 1, maxHeight: "400px" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        width="15%"
                                        sx={{
                                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                            color: theme.palette.secondary.main,
                                            fontWeight: "bold",
                                            borderBottom: `2px solid ${theme.palette.secondary.main}`
                                        }}
                                    >
                                        #
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                            color: theme.palette.secondary.main,
                                            fontWeight: "bold",
                                            borderBottom: `2px solid ${theme.palette.secondary.main}`
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
                                                    backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                                                    cursor: 'pointer',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: theme.palette.secondary.main,
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem',
                                                }}>
                                                    {index + 1}
                                                </Box>
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    wordBreak: "break-word",
                                                    fontFamily: "monospace",
                                                    fontSize: "0.8rem",
                                                    position: 'relative',
                                                    '&:hover::after': {
                                                        content: '"Copy"',
                                                        position: 'absolute',
                                                        right: '8px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        fontSize: '0.7rem',
                                                        color: theme.palette.secondary.main,
                                                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                    }
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
                                                py: 8,
                                                position: 'relative',
                                            }}
                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <Box sx={{
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                                                    mb: 2,
                                                }}>
                                                    <People sx={{
                                                        fontSize: '2.5rem',
                                                        color: alpha(theme.palette.text.secondary, 0.5),
                                                        opacity: 0.7,
                                                    }} />
                                                </Box>
                                                <Typography
                                                    color={theme.palette.text.secondary}
                                                    sx={{
                                                        fontStyle: "italic",
                                                        mb: 1,
                                                    }}
                                                >
                                                    No participants yet.
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color={theme.palette.secondary.main}
                                                    sx={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Be the first to join!
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default Participants;