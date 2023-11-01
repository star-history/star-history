import React, { useState } from 'react';

interface State {
  token: string;
}

function TokenSettingDialog() {
  const [state, setState] = useState<State>({ token: '' });

  // Replace store and storage with your own implementations
  const store = {}; // Replace with your store
  const storage = {}; // Replace with your storage implementation




  return (
<div></div>
  );
}

export default TokenSettingDialog;
