import { SUPPORTED_TYPES } from "../constants/file"

export const isFileFormatSupported = (file: File) => SUPPORTED_TYPES.includes(file.type)
