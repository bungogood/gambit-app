import '@ionic/react/css/core.css';
import { setupIonicReact } from '@ionic/react';
import Board from './board';
import BLETest from './ble';

setupIonicReact();

function App() {
  return (
    <>
      <BLETest/>
      <Board/>
    </>
  )
}

export default App
