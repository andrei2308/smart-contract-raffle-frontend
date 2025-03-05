// components/AppDrawer.js
import React from 'react';
import {
    Box,
    Drawer,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Link,
    useTheme
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HistoryIcon from '@mui/icons-material/History';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const AppDrawer = ({
    drawerWidth,
    onOpenHowItWorks,
    selectedMenu = 'current' // Default to current raffle
}) => {
    const theme = useTheme();

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            {/* Drawer Header */}
            <Box
                sx={{
                    padding: theme.spacing(2),
                    display: "flex",
                    alignItems: "center",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <CasinoIcon sx={{ color: theme.palette.primary.main, marginRight: theme.spacing(0.75), fontSize: "1.8rem" }} />
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: "bold",
                            lineHeight: 1.2,
                            fontSize: "1.2rem",
                        }}
                    >
                        DApp Raffle
                    </Typography>
                    <Typography variant="caption">
                        Decentralized lottery system
                    </Typography>
                </Box>
            </Box>

            {/* Navigation Menu */}
            <List sx={{ padding: 0 }}>
                <ListItem disablePadding>
                    <ListItemButton selected={selectedMenu === 'current'}>
                        <ListItemIcon sx={{ color: selectedMenu === 'current' ? theme.palette.primary.main : '' }}>
                            <CardGiftcardIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Current Raffle"
                            primaryTypographyProps={{
                                color: selectedMenu === 'current' ? theme.palette.text.primary : theme.palette.text.secondary,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton selected={selectedMenu === 'past'}>
                        <ListItemIcon sx={{ color: selectedMenu === 'past' ? theme.palette.primary.main : '' }}>
                            <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Past Raffles"
                            primaryTypographyProps={{
                                color: selectedMenu === 'past' ? theme.palette.text.primary : theme.palette.text.secondary,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={onOpenHowItWorks}
                        selected={selectedMenu === 'how'}
                    >
                        <ListItemIcon sx={{ color: selectedMenu === 'how' ? theme.palette.primary.main : '' }}>
                            <InfoOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="How It Works"
                            primaryTypographyProps={{
                                color: selectedMenu === 'how' ? theme.palette.text.primary : theme.palette.text.secondary,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>

            <Box sx={{ flexGrow: 1 }} />

            {/* Stats Section */}
            <Box sx={{ padding: `${theme.spacing(1)} ${theme.spacing(2)}` }}>
                <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                    STATISTICS
                </Typography>
                <List dense sx={{ padding: 0 }}>
                    <ListItem sx={{ padding: `${theme.spacing(0.5)} 0` }}>
                        <ListItemText
                            primary="Total Value Locked"
                            primaryTypographyProps={{
                                color: theme.palette.text.primary,
                                variant: "body2",
                                fontSize: "0.8rem",
                            }}
                            secondary="42.5 ETH"
                            secondaryTypographyProps={{
                                color: theme.palette.secondary.main,
                                fontWeight: "bold",
                                fontSize: "0.85rem"
                            }}
                        />
                    </ListItem>
                    <ListItem sx={{ padding: `${theme.spacing(0.5)} 0` }}>
                        <ListItemText
                            primary="Total Raffles Completed"
                            primaryTypographyProps={{
                                color: theme.palette.text.primary,
                                variant: "body2",
                                fontSize: "0.8rem",
                            }}
                            secondary="24"
                            secondaryTypographyProps={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                fontSize: "0.85rem"
                            }}
                        />
                    </ListItem>
                    <ListItem sx={{ padding: `${theme.spacing(0.5)} 0` }}>
                        <ListItemText
                            primary="Total Unique Winners"
                            primaryTypographyProps={{
                                color: theme.palette.text.primary,
                                variant: "body2",
                                fontSize: "0.8rem",
                            }}
                            secondary="18"
                            secondaryTypographyProps={{
                                color: theme.palette.warning.main,
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
                    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                    v1.0.0
                </Typography>
                <Link
                    href="https://sepolia.etherscan.io/address/0xd4db7a3294b03170f4b53ceff2268442eabe0b34"
                    underline="hover"
                    target="_blank"
                    rel="noopener"
                    sx={{ color: theme.palette.primary.main, fontSize: "0.75rem" }}
                >
                    View Contract
                </Link>
            </Box>
        </Drawer>
    );
};

export default AppDrawer;