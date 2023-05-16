import { BleClient, BleDevice } from "@capacitor-community/bluetooth-le";
import { useState } from "react";

const CHESS_SERVICE = "f88918be-312c-4a9b-a7a2-97db83b2e3a9";
const CHESS_DETECTION_CHARACTERISTIC = "82ca99da-f6c3-4eb7-ac2d-ea12cac9af5c";

const BLETest = () => {

  const [counter, setCounter] = useState(0);
  const [device, setDevice] = useState<BleDevice | null>(null);

  const onDisconnect = (_deviceId: string) => {
    setDevice(null);
  };

  const bleInit = async () => {
    await BleClient.initialize();
    console.log("ble initialized");
    const device = await BleClient.requestDevice({
      name: "Gambit",
      // services: [CHESS_SERVICE],
      // optionalServices: [CHESS_SERVICE],
    });
    setDevice(device);
    console.log("ble requested device");
    await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId));
    console.log("ble connected");

    await BleClient.startNotifications(
      device.deviceId,
      CHESS_SERVICE,
      CHESS_DETECTION_CHARACTERISTIC,
      (value) => {
        setCounter(value.getUint8(0));
      }
    );
  }

  const bleBtn = async () => {
    if (device == null) {
      await bleInit();
    } else {
      await BleClient.disconnect(device.deviceId);
    }
  }

  return <>
    <h2>bleTest</h2>
    <p>{counter}</p>
    <button onClick={bleBtn}>{device == null ? "Connect" : "Disconnect"}</button>
  </>
}

export default BLETest;
