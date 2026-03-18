import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

interface AlertProps {
  message: string;
}

function AlertDismissible({ message }: AlertProps) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <p>{message}</p>
      </Alert>
    );
  }
  return null;
}

export default AlertDismissible;