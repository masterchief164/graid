import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { UserData } from '../../../../shared';
import React, { FunctionComponent } from 'react';

interface AccountMenuProps {
  user: UserData;
  anchorElUser: HTMLElement | null;
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseUserMenu: () => void;
  settings: { name: string; action: () => void }[];
}

const AccountMenu: FunctionComponent<AccountMenuProps> = ({
  user,
  handleOpenUserMenu,
  handleCloseUserMenu,
  anchorElUser,
  settings
}) => {
  console.log(settings);
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: '10px' }}>
          <Avatar src={user?.picture} alt={'User Icon'} sx={{ ml: '10px' }} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting.name} onClick={setting.action}>
            <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default AccountMenu;