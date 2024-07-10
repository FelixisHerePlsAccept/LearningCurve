import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
// import { FormHelperText, Typography } from '@mui/material';
//
import UploadBox from '../upload/UploadBox'
// import { UploadAvatar, Upload, UploadBox,UploadSquare} from '../upload';

// ----------------------------------------------------------------------

// RHFUploadAvatar.propTypes = {
//   name: PropTypes.string,
// };

// ----------------------------------------------------------------------

// export function RHFUploadAvatar({ name, ...other }) {
//   const { control } = useFormContext();

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => (
//         <div>
//           <UploadAvatar
//             accept={{
//               'image/*': [],
//             }}
//             error={!!error}
//             file={field.value}
//             {...other}
//           />

//           {!!error && (
//             <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
//               {error.message}
//             </FormHelperText>
//           )}
//         </div>
//       )}
//     />
//   );
// }

// ----------------------------------------------------------------------

RHFUploadBox.propTypes = {
  name: PropTypes.string,
};

export function RHFUploadBox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (

        <UploadBox files={field.value} error={!!error} {...other} />
        
      )}
    />
  );
}

// ----------------------------------------------------------------------

// RHFUpload.propTypes = {
//   name: PropTypes.string,
//   multiple: PropTypes.bool,
//   helperText: PropTypes.node,
// };

// export function RHFUpload({ name, multiple, helperText, ...other }) {
//   const { control } = useFormContext();

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) =>
//         multiple ? (
//             <Upload
//             multiple
//             accept={{ 'image/*': [] }}
//             files={field.value}
//             error={!!error}
//             helperText={
//               (!!error || helperText) && (
//                 <FormHelperText error={!!error} sx={{ px: 2 }}>
//                   {error ? error?.message : helperText}
//                 </FormHelperText>
//               )
//             }
//             {...other}
//           />
        

//         ) : (
//           <Upload
//             accept={{ 'image/*': [] }}
//             file={field.value}
//             error={!!error}
//             helperText={
//               (!!error || helperText) && (
//                 <FormHelperText error={!!error} sx={{ px: 2 }}>
//                   {error ? error?.message : helperText}
//                 </FormHelperText>
//               )
//             }
//             {...other}
//           />
//         )
//       }
//     />
//   );
// }


// RHFUploadSquare.propTypes = {
//   name: PropTypes.string,
//   multiple: PropTypes.bool,
//   helperText: PropTypes.node,
// };

// export function RHFUploadSquare({ name, multiple, helperText, ...other }) {
//   const { control } = useFormContext();

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) =>
//         multiple ? (
//             <UploadSquare
//             multiple
//             accept={{ 'image/*': [] }}
//             files={field.value}
//             error={!!error}
//             helperText={
//               (!!error || helperText) && (
//                 <FormHelperText error={!!error} sx={{ px: 2 }}>
//                   {error ? error?.message : helperText}
//                 </FormHelperText>
//               )
//             }
//             {...other}
//           />
        

//         ) : (
//           <UploadSquare
//             accept={{ 'image/*': [] }}
//             file={field.value}
//             error={!!error}
//             helperText={
//               (!!error || helperText) && (
//                 <FormHelperText error={!!error} sx={{ px: 2 }}>
//                   {error ? error?.message : helperText}
//                 </FormHelperText>
//               )
//             }
//             {...other}
//           />
//         )
//       }
//     />
//   );
// }

