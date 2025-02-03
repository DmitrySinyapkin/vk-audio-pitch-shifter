import { useContext, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Button, Flex, SegmentedControl, FormItem, SegmentedControlValue, SegmentedControlOptionInterface, Spinner, Text, Popover, Div } from "@vkontakte/vkui";
import CustomSnackbar from "../common/CustomSnackbar";
import { OUTPUT_TYPES } from "../../constants/file";
import { processAudioBuffer } from "../../utils/audioUtils";
import { downloadOutputFile } from "../../utils/fileUtils";

interface WorkerMessage {
    status: string
    url: string
}

interface SnackbarMessage {
    type: 'success' | 'error'
    text: string
}

const formats: SegmentedControlOptionInterface[] = [
    {
        label: 'WAV',
        value: 'wav',
        'aria-label': 'WAV'
    },
    {
        label: 'MP3',
        value: 'mp3',
        'aria-label': 'MP3'
    }
]

function isOutputFormat(value: SegmentedControlValue): value is OutputFormat {
    return typeof value === 'string' && OUTPUT_TYPES.includes(value)
}

const SaveTransposedAudio = () => {
    const { player, sourceTitle, pitchOffset, playbackRate } = useContext(PlayerContext)

    const [format, setFormat] = useState<OutputFormat>('wav')
    const [processing, setProcessing] = useState<string>('')
    const [message, setMessage] = useState<SnackbarMessage | null>(null)

    const worker: Worker = new Worker(new URL('../../worker/converter.ts', import.meta.url), {
        type: 'module'
      })

    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        if (e.data.status === 'success') {
            downloadOutputFile(e.data.url, sourceTitle, format)
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

    const onFormatChange = (value: SegmentedControlValue) => {
        if (isOutputFormat(value)) {
            setFormat(value)
        }   
    }

    const onClick = async () => {
        if (player?.buffer && playbackRate && pitchOffset !== undefined) {
            setProcessing('Обработка аудио...')
            const buffer = player.buffer.get()

            if (buffer) {
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
        }
    }

    const onErrorClose = () => {
        setMessage(null)
    }

    return (
        <>
            <Flex direction="column" gap='2xl' align="center">
                <div style={{ width: '200px' }}>
                    <FormItem top='Сохранить в:'>
                        <SegmentedControl options={formats} value={format} onChange={onFormatChange} />
                    </FormItem>
                </div>
                <Popover
                    shown={processing !== ''}
                    placement="bottom"
                    content={
                        <Flex align="center" style={{ marginTop: 10 }}>
                            <Div>
                                <Spinner size="regular" />
                            </Div>
                            <Div>
                                <Text weight="3">{ processing }</Text>
                            </Div>
                        </Flex>
                    }
                >
                    <Button size="l" onClick={onClick} disabled={processing !== ''}>Сохранить</Button>
                </Popover>
            </Flex>
            {message && <CustomSnackbar type={message.type} text={message.text} onClose={onErrorClose} />}
        </>
    )
}

export default SaveTransposedAudio
