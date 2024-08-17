import { ReactElement } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import GDriveIcon from '../../assets/GdriveIcon.svg';

export const LoadingPage = (): ReactElement => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img style={{ marginRight: '10px' }} src={GDriveIcon} alt="Gdrive Icon" />
        <Typography variant="h6" noWrap component="div">
          GRaid
        </Typography>
      </div>
      <h2>Google Login</h2>
      <CircularProgress />
      <p>Login In Progress please wait</p>
    </div>
  );
};
