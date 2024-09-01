import { UserData } from '../../../../shared';
import React from 'react';
import { Avatar, Card, IconButton, Typography, Box } from '@mui/material';

interface AccountCardProps {
  account: UserData;
  onAccountClick: (() => void) | undefined;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onAccountClick }) => {
  return (
    <Card
      variant={'outlined'}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '8px',
        mx: '5px',
        width: '100%',
        alignItems: 'center'
      }}
      onClick={onAccountClick}
    >
      <IconButton>
        <Avatar src={account.picture} alt={'User Icon'} sx={{ mr: '10px' }} />
      </IconButton>
      <Box sx={{ display: 'flex', flexDirection: 'column', pr: '10px', py: 'px' }}>
        <Typography>{account.name}</Typography>
        <Typography variant={'body2'}>{account.email}</Typography>
      </Box>
    </Card>
  );
};

export default AccountCard;
