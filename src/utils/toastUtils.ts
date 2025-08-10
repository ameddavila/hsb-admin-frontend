// src/utils/toastUtils.ts
import { toast } from "react-toastify";

export const showSuccess = (message: string, toastId = "auth-success") =>
  toast.success(message, { position: "top-right", autoClose: 3000, toastId });

export const showError = (message: string, toastId = "auth-error") =>
  toast.error(message, { position: "top-right", autoClose: 4000, toastId });

export const showInfo = (message: string, toastId = "auth-info") =>
  toast.info(message, { position: "top-right", autoClose: 3000, toastId });

export const showWarning = (message: string, toastId = "auth-warn") =>
  toast.warn(message, { position: "top-right", autoClose: 3000, toastId });
