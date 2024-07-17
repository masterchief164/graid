import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

type SearchBarProps = {
  setSearchQuery: (searchQuery: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ setSearchQuery }) => (
  <>
    <TextField
      id="search-bar"
      className="text"
      onChange={(e) => {
        setSearchQuery(e.target.value);
      }}
      label="Search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton type="submit" aria-label="search">
              <SearchIcon style={{ fill: 'gray' }} />
            </IconButton>
          </InputAdornment>
        )
      }}
      variant="outlined"
      placeholder="Search in Drive"
      size="small"
      color="primary"
      sx={{ width: '100%' }}
    />
  </>
);

export default SearchBar;
