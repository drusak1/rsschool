import { useState } from 'react';

export function ErrorTrigger(): React.JSX.Element {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Manual error triggered for ErrorBoundary test.');
  }

  return (
    <button type="button" onClick={() => setShouldThrow(true)}>
      Throw error
    </button>
  );
}
