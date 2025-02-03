import { SUPPORTED_TYPES } from "../constants/file"

export const isFileFormatSupported = (file: File) => SUPPORTED_TYPES.includes(file.type)

export const downloadOutputFile = (url: string, name: string | undefined, format: OutputFormat) =>  {
    const link = document.createElement('a');
    link.href = url;
    link.download = name ? name.split('.')[0] + ' (transposed).' + format : 'output.' + format;
    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link)
}
