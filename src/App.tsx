import "@ionic/react/css/core.css";
import { setupIonicReact } from "@ionic/react";
import DebugBoard from "./components/debug";

setupIonicReact();

const App = () => {
    return (
        <>
            <h1>Gambit</h1>
            <DebugBoard />
        </>
    );
};

export default App;
