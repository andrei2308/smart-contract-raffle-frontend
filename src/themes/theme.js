import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark', // Enable dark mode by default
        primary: {
            light: '#4CAF50', // Lighter green
            main: '#2E7D32', // Deep green
            dark: '#1B5E20', // Darkest green
            contrastText: '#ffffff'
        },
        secondary: {
            light: '#00E676', // Bright green accent
            main: '#00C853', // Vibrant green
            dark: '#009624', // Dark vibrant green
            contrastText: '#000000'
        },
        error: {
            light: '#ef5350',
            main: '#f44336',
            dark: '#c62828',
            contrastText: '#ffffff'
        },
        background: {
            default: '#121212', // Deep dark background
            paper: '#1E1E1E', // Slightly lighter for paper elements
        },
        text: {
            primary: '#E0E0E0',
            secondary: '#A0A0A0',
            disabled: '#6E6E6E'
        },
        action: {
            active: '#00E676',
            hover: 'rgba(0, 230, 118, 0.08)',
            selected: 'rgba(0, 230, 118, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)'
        }
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontWeight: 600,
            fontSize: '2.5rem',
            letterSpacing: '-0.01562em',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
            letterSpacing: '-0.00833em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            letterSpacing: '0em',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            letterSpacing: '0.00735em',
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
        body1: {
            fontWeight: 400,
            fontSize: '1rem',
        },
        body2: {
            fontWeight: 400,
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 12
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                body {
                    scrollbar-width: thin;
                    scrollbar-color: #2E7D32 #121212;
                }
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #121212;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #2E7D32;
                    border-radius: 20px;
                }
            `
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '12px 24px',
                    fontSize: '1rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 10px rgba(46, 125, 50, 0.3)',
                    }
                },
                contained: {
                    backgroundColor: '#2E7D32',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#1B5E20',
                    }
                },
                outlined: {
                    borderColor: 'rgba(46, 125, 50, 0.5)',
                    color: '#2E7D32',
                    '&:hover': {
                        backgroundColor: 'rgba(46, 125, 50, 0.04)',
                        borderColor: '#2E7D32',
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    background: '#1E1E1E',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                    }
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: '#0D1F0D', // Darker green for drawer
                    borderRight: '1px solid rgba(46, 125, 50, 0.12)',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
                colorPrimary: {
                    backgroundColor: 'rgba(46, 125, 50, 0.2)',
                    color: '#2E7D32'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                },
                head: {
                    fontWeight: 700,
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    color: '#2E7D32'
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
    spacing: 8 // Base spacing unit
});

export default theme;