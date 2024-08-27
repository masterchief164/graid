import { ReactElement, useEffect } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import GDriveIcon from '../../assets/GdriveIcon.svg';
import { useNavigate } from 'react-router-dom';

export const LoadingPage = (): ReactElement => {
  const navigate = useNavigate();
  useEffect(() => {
    const code = window.location.href.split('code=')[1];
    window.electronAPI.getAccessTokens(code).then((status: number) => {
      console.log(status);
      if (status === 1) navigate('/');
    });
  }, []);

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
