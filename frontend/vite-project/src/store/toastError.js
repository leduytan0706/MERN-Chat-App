import toast from 'react-hot-toast';

const toastErrorStyle = {
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
};

const toastError = (message) => {
    return toast.error(message, toastErrorStyle);
};

export default toastError;