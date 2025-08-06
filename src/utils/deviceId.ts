// src/utils/deviceId.ts
import { v4 as uuidv4 } from "uuid";

const DEVICE_KEY = "deviceId";

export function getOrCreateDeviceId(): string {
  // Lee el valor almacenado
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    // Si no existe, genera un UUID y guárdalo
    deviceId = uuidv4();
    localStorage.setItem(DEVICE_KEY, deviceId);
  }
  return deviceId;
}
