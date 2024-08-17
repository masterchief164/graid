import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, Button, Fab, ListItem, Menu, MenuItem } from '@mui/material';
import SearchBar from '../SearchBar/SearchBar';
import GDriveIcon from '../../assets/GdriveIcon.svg';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import StarIcon from '@mui/icons-material/StarBorderOutlined';
import TrashIcon from '@mui/icons-material/DeleteOutline';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import GoogleIcon from '../../assets/Google.svg';

const drawerWidth = 240;
type PermanentDrawerProps = {
  children: React.ReactElement;
};

const PermanentDrawer: React.FC<PermanentDrawerProps> = (permanentDrawerProps) => {
  const [, setSearchQuery] = React.useState<string>('');
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorElement(null);
  };

  const navigate = useNavigate();
  useEffect(() => {
    window.electron.ipcRenderer.on('navigate', (_, path) => {
      console.log(path);
      navigate(path);
    });
  }, [navigate]);

  const startGoogleLogin = (): void => {
    console.log('Google login started');
    const csrfToken = window.electronAPI.generateEntropy(32);
    window.sessionStorage.setItem('csrfToken', csrfToken);
    window.electronAPI.startGoogleLogin(csrfToken);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color={'transparent'}
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <SearchBar setSearchQuery={setSearchQuery} />
          <Button onClick={startGoogleLogin}>
            <Avatar src={GoogleIcon} alt={'Google Icon'} sx={{ ml: '10px' }} />
          </Button>
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
          <Typography variant="h6" noWrap component="div" color={'black'}>
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
  );
};

export default PermanentDrawer;
