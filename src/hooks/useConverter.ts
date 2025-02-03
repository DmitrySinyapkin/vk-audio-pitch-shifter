import { useState } from "react";
import { processAudioBuffer } from "../utils/audioUtils";

function useConverter(onFinish: (url: string) => void) {

    const [processing, setProcessing] = useState<string>('')
    const [message, setMessage] = useState<SnackbarMessage | null>(null)

    const worker: Worker = new Worker(new URL('../worker/converter.ts', import.meta.url), {
        type: 'module'
    })

    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        if (e.data.status === 'success') {
            onFinish(e.data.url)
            setProcessing('')
            setMessage({
                type: 'success',
                text: 'Файл сохранен'
            })
        } else {
            setProcessing('')
            setMessage({
                type: 'error',
                text: 'Ошибка при сохранении'
            })
        }
    }

    const createFile = async (buffer: AudioBuffer, playbackRate: number, pitchOffset: number, format: OutputFormat ) => {
        setProcessing('Обработка аудио...')

        try {
            const { channels, sampleRate } = await processAudioBuffer(buffer, playbackRate, pitchOffset)

            setProcessing(`Создание ${format}-файла...`)
            worker.postMessage({ channels, sampleRate, format })
        } catch(err) {
            console.log(err)
            setProcessing('')
            setMessage({
                type: 'error',
                text: 'Ошибка при обработке аудио'
            })
        }
    }

    const clearMessage = () => {
        setMessage(null)
    }

    return {
        processing,
        message,
        clearMessage,
        createFile
    }
}

export default useConverter
