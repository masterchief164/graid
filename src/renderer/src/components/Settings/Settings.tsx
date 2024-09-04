import { useAppDispatch, useAppSelector } from '../../hooks';
import Box from '@mui/material/Box';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';
import { raidVersions, RaidVersionTypes, updateRaidConfig } from '../../slices/settingsSlice';
import { updateRootUser } from '../../slices/userSlice';

const Settings = () => {
  const users = useAppSelector((state) => state.users.accounts);
  const settings = useAppSelector((state) => state.settings);
  const [rootUser, setRootUser] = React.useState(settings.rootUser);
  const raidConfig = settings.raidConfig;
  const [blockSize, setBlockSize] = React.useState(raidConfig.blockSize);
  const [raidVersion, setRaidVersion] = React.useState(raidConfig.raidVersion);
  const dispatcher = useAppDispatch();

  const handleSave = () => {
    dispatcher(updateRaidConfig({ raidVersion, blockSize }));
    dispatcher(updateRootUser(rootUser));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'min(3vh, 35px)',
        p: '25px'
      }}
    >
      <Typography variant={'h3'} sx={{ mb: '5vh' }}>
        Settings
      </Typography>

      <FormControl sx={{ width: '25vw', minWidth: '350px' }}>
        <InputLabel id="demo-simple-select-label">Root User</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={rootUser}
          label="Age"
          onChange={(event) => setRootUser(event.target.value as string)}
          variant={'standard'}
        >
          {users.map((user) => (
            <MenuItem key={user.email} value={user.email}>
              {user.email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: '25vw', minWidth: '350px' }}>
        <InputLabel id={'raidConfig'}>Raid Configuration</InputLabel>
        <Select
          labelId="raidConfig"
          id="raidConfig"
          value={raidVersion}
          label="Raid Configuration"
          onChange={(event) => setRaidVersion(event.target.value as RaidVersionTypes)}
          variant={'standard'}
        >
          {Object.keys(raidVersions).map((raid) => (
            <MenuItem key={raid} value={raid}>
              {raid}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: '25vw', minWidth: '350px' }}>
        <InputLabel id={'blockSize'}>Block Size</InputLabel>
        <Select
          labelId="blockSize"
          id="blockSize"
          value={blockSize}
          label="Block Size"
          onChange={(event) => setBlockSize(event.target.value as number)}
          variant={'standard'}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button sx={{ mr: 'auto' }} onClick={handleSave} variant={'contained'}>
        Save
      </Button>
    </Box>
  );
};

export default Settings;
