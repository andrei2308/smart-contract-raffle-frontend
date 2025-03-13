import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            light: '#33d6ff', // Lighter cyan
            main: '#00d1ff', // Cyan blue - main brand color
            dark: '#00a0c2', // Darker cyan
            contrastText: '#000000'
        },
        secondary: {
            light: '#5bff3c', // Lighter neon green
            main: '#39ff14', // Neon green
            dark: '#2dcc10', // Darker neon green
            contrastText: '#000000'
        },
        tertiary: { // Custom palette for purple accents
            light: '#7e3ff9',
            main: '#6200ea', // Purple
            dark: '#4b00b3',
            contrastText: '#ffffff'
        },
        error: {
            light: '#ff5f52',
            main: '#ff3a30', // Red from your component
            dark: '#c62828',
            contrastText: '#ffffff'
        },
        warning: {
            light: '#ffac33',
            main: '#FF8C00', // Orange from your component
            dark: '#cc7000',
            contrastText: '#000000'
        },
        background: {
            default: '#0a0a14', // Very dark blue/black from your component
            paper: '#14141e', // Slightly lighter dark blue
            card: 'rgba(20, 20, 30, 0.5)', // Transparent card background
            elevated: '#1a1a24' // Even lighter for elevated surfaces
        },
        text: {
            primary: '#ffffff',
            secondary: '#aaaaaa', // Gray text used in your component
            disabled: '#666666', // Used for the version number in your component
            hint: 'rgba(255, 255, 255, 0.5)'
        },
        action: {
            active: '#00d1ff',
            hover: 'rgba(0, 209, 255, 0.08)',
            selected: 'rgba(0, 209, 255, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)'
        },
        divider: 'rgba(255, 255, 255, 0.05)' // Border color from your component
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.01562em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.00833em',
        },
        h3: {
            fontWeight: 700,
            fontSize: '1.75rem',
            letterSpacing: '0em',
        },
        h4: {
            fontWeight: 700,
            fontSize: '1.5rem',
            letterSpacing: '0.00735em',
            color: '#00d1ff', // Default heading color
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            letterSpacing: '0em',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.125rem',
            letterSpacing: '0.0075em',
        },
        subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
            letterSpacing: '0.00938em',
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
            letterSpacing: '0.00714em',
            textTransform: 'uppercase',
        },
        body1: {
            fontWeight: 400,
            fontSize: '1rem',
        },
        body2: {
            fontWeight: 400,
            fontSize: '0.875rem',
        },
        caption: {
            fontWeight: 400,
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)', // Default caption text color
        },
        overline: {
            fontWeight: 600,
            fontSize: '0.7rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
        },
        monospace: { // Custom typography variant for addresses
            fontFamily: '"Roboto Mono", monospace',
            fontSize: '0.85rem',
            fontWeight: 500,
        }
    },
    shape: {
        borderRadius: 12
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');
                body {
                    scrollbar-width: thin;
                    scrollbar-color: #00d1ff #0a0a14;
                    background-color: #0a0a14;
                    background-image: 
                      radial-gradient(circle at 25% 25%, rgba(0, 209, 255, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(57, 255, 20, 0.05) 0%, transparent 50%);
                    background-attachment: fixed;
                }
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #0a0a14;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #00d1ff;
                    border-radius: 20px;
                }
            `
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50, // Rounded buttons
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0, 209, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0, 209, 255, 0.3)',
                    }
                },
                containedPrimary: {
                    background: 'linear-gradient(90deg, #00ffcc 0%, #00E5FF 100%)',
                    color: '#000000',
                    '&:hover': {
                        background: 'linear-gradient(90deg, #00ffcc 20%, #00E5FF 100%)',
                    }
                },
                containedSecondary: {
                    background: 'linear-gradient(90deg, #39ff14 0%, #00E676 100%)',
                    color: '#000000',
                    boxShadow: '0 4px 12px rgba(57, 255, 20, 0.2)',
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(57, 255, 20, 0.3)',
                    }
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px'
                    }
                },
                outlinedPrimary: {
                    borderColor: 'rgba(0, 209, 255, 0.5)',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 209, 255, 0.04)',
                        borderColor: '#00d1ff',
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    background: 'rgba(20, 20, 30, 0.5)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0, 209, 255, 0.15)',
                    '&:hover': {
                        boxShadow: '0 12px 32px rgba(0, 209, 255, 0.1)',
                    }
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: '#0a0a14',
                    borderRight: '1px solid rgba(0, 209, 255, 0.15)',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'rgba(10, 10, 20, 0.8)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderBottom: '1px solid rgba(0, 209, 255, 0.15)',
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: '0.8rem'
                },
                colorPrimary: {
                    backgroundColor: 'rgba(0, 209, 255, 0.15)',
                    color: '#00d1ff',
                    border: '1px solid rgba(0, 209, 255, 0.3)'
                },
                colorSecondary: {
                    backgroundColor: 'rgba(57, 255, 20, 0.15)',
                    color: '#ffffff',
                    border: '1px solid #39ff14'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '0.75rem 1rem'
                },
                head: {
                    fontWeight: 700,
                    backgroundColor: '#0a0a14',
                    color: '#00d1ff',
                    borderBottom: '1px solid rgba(0, 209, 255, 0.2)'
                }
            }
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(20, 20, 30, 0.5)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 209, 255, 0.1)'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 209, 255, 0.1)',
                        borderLeft: '3px solid #00d1ff',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 209, 255, 0.15)',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: '40px',
                    color: '#aaaaaa'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    fontSize: '0.9rem'
                },
                secondary: {
                    fontSize: '0.8rem'
                }
            }
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: '#ffffff'
                }
            }
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920
        }
    },
    spacing: 6,

    gradients: {
        primary: 'linear-gradient(90deg, #00ffcc 0%, #00E5FF 100%)',
        secondary: 'linear-gradient(90deg, #39ff14 0%, #00E676 100%)',
        tertiary: 'linear-gradient(90deg, #6200ea 0%, #9e67ff 100%)'
    }
});

export default theme;