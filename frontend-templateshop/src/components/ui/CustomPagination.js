import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const CustomPagination = ({ count, page, onChange }) => {
  if (count <= 1) return null;

  return (
    <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', padding: '16px 0', alignItems: 'center' }}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        variant="outlined"
        color="secondary"
      />
    </Stack>
  );
};
export default CustomPagination;