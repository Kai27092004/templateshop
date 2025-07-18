import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <Box sx={style}>
        <Typography id="confirm-modal-title" variant="h6" component="h2">
          {title || 'Xác nhận hành động'}
        </Typography>
        <Typography id="confirm-modal-description" sx={{ mt: 2 }}>
          {message || 'Bạn có chắc chắn muốn thực hiện hành động này?'}
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>Hủy</Button>
          <Button variant="contained" color="error" onClick={onConfirm}>Xác nhận</Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default ConfirmModal;