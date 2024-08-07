import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Stack, TextField, Typography } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFTextField({ showLabel=false, name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Stack direction='column'>
      {showLabel && <Typography sx={{fontWeight:'light', textTransform:'capitalize'}} variant='caption'>{name}</Typography>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            error={!!error}
            helperText={error ? error?.message : helperText}
            {...other}
          />
        )}
      />
    </Stack>
  );
}
