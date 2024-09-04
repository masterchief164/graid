import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {
  Avatar,
  createTheme,
  Fab,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  ThemeProvider,
  Typography
} from '@mui/material';
import SearchBar from '../SearchBar/SearchBar';
import GDriveIcon from '../../assets/GdriveIcon.svg';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import StarIcon from '@mui/icons-material/StarBorderOutlined';
import TrashIcon from '@mui/icons-material/DeleteOutline';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import GoogleIcon from '../../assets/Google.svg';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../slices/userSlice';
import { useAppSelector } from '../../hooks';
import AccountMenu from '../AccountMenu/AccountMenu';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { useAppDispatch } from '../../hooks';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
import { switchTheme } from '../../slices/settingsSlice';

const drawerWidth = 240;
type PermanentDrawerProps = {
  children: React.ReactElement;
};

const PermanentDrawer: React.FC<PermanentDrawerProps> = (permanentDrawerProps) => {
  const [, setSearchQuery] = React.useState<string>('');
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLogged } = useAppSelector((state: RootState) => state.users);
  const { darkMode } = useAppSelector((state: RootState) => state.settings);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light'
    }
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElement(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log('PermanentDrawer.tsx: handleOpenUserMenu');
    setAnchorElUser(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorElement(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
  };

  const settings = [
    { name: 'Profile', action: handleCloseUserMenu },
    { name: 'Logout', action: handleLogout },
    { name: 'Settings', action: () => navigate('/settings') }
  ];

  useEffect(() => {
    window.electronAPI.navigate((path) => {
      navigate(path);
    });
  }, []);

  const startGoogleLogin = async (): Promise<void> => {
    console.log('Google login started');
    const csrfToken = await window.electronAPI.generateEntropy(32);
    window.sessionStorage.setItem('csrfToken', csrfToken);
    window.electronAPI.startGoogleLogin(csrfToken);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          color={'transparent'}
          sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
          <Toolbar>
            <SearchBar setSearchQuery={setSearchQuery} />
            <ThemeSwitch
              checked={darkMode}
              onChange={() => dispatch(switchTheme())}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            {isLogged ? (
              <AccountMenu
                anchorElUser={anchorElUser}
                handleOpenUserMenu={handleOpenUserMenu}
                handleCloseUserMenu={handleCloseUserMenu}
                settings={settings}
              />
            ) : (
              <IconButton onClick={startGoogleLogin} sx={{ p: 0 }}>
                <Avatar src={GoogleIcon} alt={'Google Icon'} sx={{ ml: '10px' }} />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box'
            }
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <img style={{ marginRight: '10px' }} src={GDriveIcon} alt="Gdrive Icon" />
            <Typography variant="h6" noWrap component="div">
              GRaid
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem disablePadding>
              <Fab variant="extended" sx={{ ml: 2 }} onClick={handleClick}>
                <AddIcon sx={{ mr: 1 }} />
                New
              </Fab>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorElement}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </ListItem>
            <ListItem disablePadding component={RouterLink} to={'/'}>
              <ListItemButton>
                {/*<Link component={RouterLink} to={'/'}>*/}
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                {/*</Link>*/}
                <ListItemText primary={'Home'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary={'Starred'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TrashIcon />
                </ListItemIcon>
                <ListItemText primary={'Trash'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={RouterLink} to={'/settings'}>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={'Settings'} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <Toolbar />
          {permanentDrawerProps.children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PermanentDrawer;
