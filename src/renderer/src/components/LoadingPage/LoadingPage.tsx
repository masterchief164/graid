import { ReactElement, useEffect } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import GDriveIcon from '../../assets/GdriveIcon.svg';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store';
import { getAccessTokens } from '../../slices/userSlice';
import { useAppDispatch } from '../../hooks';
import { refreshSettings } from '../../slices/settingsSlice';

export const LoadingPage = (): ReactElement => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();

  useEffect(() => {
    const code = window.location.href.split('code=')[1];
    if (code) {
      dispatch(getAccessTokens(code)).then(() => {
        console.log('Login Success');
        navigate('/');
        dispatch(refreshSettings);
      });
    }
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
