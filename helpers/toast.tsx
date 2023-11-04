import React, { useEffect } from 'react';
import Toast from '../components/Toast';
import ReactDOM from 'react-dom';

interface Callbacks {
  destroy: () => void;
}

function show(message: string, type: string, duration: number) {
  const tempDiv = document.createElement('div');
  document.body.appendChild(tempDiv);
  const callbacks: Callbacks = {
    destroy: () => {
      tempDiv.remove();
    },
  };
  const toast = (
    <Toast message={message} type={type} duration={duration} {...callbacks} />
  );
  ReactDOM.render(toast, tempDiv);
  return callbacks;
}

namespace toast {
  export function succeed(message: string, duration = 2000) {
    return show(message, 'succeed', duration);
  }
  export function warn(message: string, duration = 2000) {
    return show(message, 'warn', duration);
  }
  export function error(message: string, duration = 2000) {
    return show(message, 'error', duration);
  }
}

export default toast;