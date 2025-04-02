import "@ionic/react/css/core.css";
import "./index.css";
import { setupIonicReact } from "@ionic/react";
import DebugBoard from "./components/debug";
import DebugBoardUI from "./components/debugUI";

setupIonicReact();

const App = () => {
    return (
        <>
            {/* <h1>Gambit</h1>
            <DebugBoard /> */}
            <DebugBoardUI />
        </>
    );
};

export default App;
