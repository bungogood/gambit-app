import { useState, useEffect } from "react";
import {
    BleClient,
    BleDevice,
    textToDataView,
} from "@capacitor-community/bluetooth-le";

const SERVICE_UUID = "f88918be-312c-4a9b-a7a2-97db83b2e3a9";
const FEN_CHAR_UUID = "82ca99da-f6c3-4eb7-ac2d-ea12cac9af5c";
const MAGNET_CHAR_UUID = "3f7ebdc2-6d63-426f-a2ad-8d10c450743f";
const STATE_CHAR_UUID = "1a100eac-62c1-4c73-955c-55c97f4c57be";
const MOVE_CHAR_UUID = "27dc4447-33d4-4e8a-88fa-c683d4545d47";

interface BluetoothServiceProps {
    onFenUpdate: (fen: string) => void;
    onMagnetUpdate: (magnetState: bigint) => void;
    onStateUpdate: (state: FSMState) => void;
    onMoveUpdate: (move: string) => void;
}

export enum FSMState {
    Idle = "Idle",
    FriendlyPU = "FriendlyPU",
    EnemyPU = "EnemyPU",
}

export const useBluetoothService = ({
    onFenUpdate,
    onMagnetUpdate,
    onStateUpdate,
    onMoveUpdate,
}: BluetoothServiceProps) => {
    const [device, setDevice] = useState<BleDevice | null>(null);

    useEffect(() => {
        BleClient.initialize().then(() => console.log("Bluetooth initialized"));
    }, []);

    const readInitialValues = async (deviceId: string) => {
        try {
            const fenView = await BleClient.read(
                deviceId,
                SERVICE_UUID,
                FEN_CHAR_UUID
            );
            processFen(fenView);

            const magnetView = await BleClient.read(
                deviceId,
                SERVICE_UUID,
                MAGNET_CHAR_UUID
            );
            processMagnet(magnetView);

            const stateView = await BleClient.read(
                deviceId,
                SERVICE_UUID,
                STATE_CHAR_UUID
            );

            processState(stateView);

            const moveView = await BleClient.read(
                deviceId,
                SERVICE_UUID,
                MOVE_CHAR_UUID
            );

            processMove(moveView);
        } catch (error) {
            console.error("Failed to read initial values:", error);
        }
    };

    const connectDevice = async () => {
        const device = await BleClient.requestDevice({
            name: "Gambit",
            optionalServices: ["f88918be-312c-4a9b-a7a2-97db83b2e3a9"],
        });
        setDevice(device);
        await BleClient.connect(device.deviceId);
        console.log("Device connected");

        await readInitialValues(device.deviceId);

        // Setup notifications after initial read to ensure synchronization
        await BleClient.startNotifications(
            device.deviceId,
            SERVICE_UUID,
            FEN_CHAR_UUID,
            processFen
        );

        await BleClient.startNotifications(
            device.deviceId,
            SERVICE_UUID,
            MAGNET_CHAR_UUID,
            processMagnet
        );

        await BleClient.startNotifications(
            device.deviceId,
            SERVICE_UUID,
            STATE_CHAR_UUID,
            processState
        );

        await BleClient.startNotifications(
            device.deviceId,
            SERVICE_UUID,
            MOVE_CHAR_UUID,
            processMove
        );
    };

    const processFen = (value: DataView) => {
        const decoder = new TextDecoder();
        onFenUpdate(decoder.decode(value.buffer));
    };

    const processMagnet = (value: DataView) => {
        onMagnetUpdate(value.getBigUint64(0, false));
    };

    const processState = (value: DataView) => {
        const decoder = new TextDecoder();
        const stateStr = decoder.decode(value.buffer);
        onStateUpdate(stateStr as FSMState);
    };

    const processMove = (value: DataView) => {
        const decoder = new TextDecoder();
        onMoveUpdate(decoder.decode(value.buffer));
    };

    const disconnectDevice = async () => {
        if (device) {
            await BleClient.disconnect(device.deviceId);
            setDevice(null);
            console.log("Device disconnected");
        }
    };

    const sendMove = async (move: string) => {
        if (device) {
            await BleClient.write(
                device.deviceId,
                SERVICE_UUID,
                MOVE_CHAR_UUID,
                textToDataView(move)
            );
        }
    };

    return {
        connect: connectDevice,
        disconnect: disconnectDevice,
        isConnected: device !== null,
        sendMove: sendMove,
    };
};
