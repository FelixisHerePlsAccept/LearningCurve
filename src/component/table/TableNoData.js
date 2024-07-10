import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, Box, Stack, Typography } from '@mui/material';

import noContent from '../../page/dashboard/mock/nocontent.png'
//
// import EmptyContent from '../empty-content';

// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
};

export default function TableNoData({ isNotFound, ...others }) {
  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={12}>
          {/* <EmptyContent
            title="No Data"
            sx={{
              '& span.MuiBox-root': { height: 160 },
            }}
          /> */}
          <Box sx={{
              display:'flex',
              '& span.MuiBox-root': { height: 160 },
              justifyContent:'center',
              alignItems:'center'
            }}>
              <Stack direction={'column'} spacing={2}>
                <img src={noContent} alt='Ange' />
                <Typography {...others} textAlign={'center'}>Not Found</Typography>
              </Stack>
          </Box>
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
