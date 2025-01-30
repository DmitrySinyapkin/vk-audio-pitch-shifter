import { useContext, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Button, Flex, SegmentedControl, FormItem, SegmentedControlValue, SegmentedControlOptionInterface } from "@vkontakte/vkui";
import CustomSnackbar from "../common/CustomSnackbar";
import { OUTPUT_TYPES } from "../../constants/file";

interface WorkerMessage {
    status: string
    url: string
}

const formats: SegmentedControlOptionInterface[] = [
    {
        label: 'MP3',
        value: 'mp3',
        'aria-label': 'MP3'
    },
    {
        label: 'WAV',
        value: 'wav',
        'aria-label': 'WAV'
    }
]

function isOutputFormat(value: SegmentedControlValue): value is OutputFormat {
    return typeof value === 'string' && OUTPUT_TYPES.includes(value)
}

const SaveButton = () => {
    const { player, sourceTitle, pitchOffset, playbackRate } = useContext(PlayerContext)

    const [format, setFormat] = useState<OutputFormat>('mp3')
    const [processing, setProcessing] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const worker: Worker = new Worker(new URL('../../worker/converter.ts', import.meta.url), {
        type: 'module'
      })

    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        if (e.data.status === 'success') {
            const link = document.createElement('a');
            link.href = e.data.url;
            link.download = sourceTitle ? sourceTitle.split('.')[0] + ' (transposed).' + format : 'output.' + format;
            document.body.appendChild(link);
            link.click()
            document.body.removeChild(link)
        } else {
            setError('Ошибка при сохранении')
        }
        setProcessing(false)
    }

    const onFormatChange = (value: SegmentedControlValue) => {
        if (isOutputFormat(value)) {
            setFormat(value)
        }   
    }

    const onClick = () => {
        if (player?.buffer && playbackRate && pitchOffset !== undefined) {
            setProcessing(true)
            const buffer = player.buffer.get()

            if (buffer) {
                const sampleRate: number = buffer.sampleRate
                const length: number = buffer.length
                const numberOfChannels: number = buffer?.numberOfChannels

                const offlineCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate) //(channels,length,Sample rate);

                //create source node and load buffer
                const source = offlineCtx.createBufferSource()
                source.connect(offlineCtx.destination)
                source.buffer = buffer

                //speed the playback up
                source.playbackRate.value = playbackRate
                source.detune.value = -12 * Math.log2(playbackRate) + pitchOffset
                console.log(playbackRate, pitchOffset, -12 * Math.log2(playbackRate))

                //lines the audio for rendering
                source.start()

                //renders everything you lined up
                offlineCtx.startRendering()
                offlineCtx.oncomplete = function(e) {
                    //copies the rendered buffer into your variable.
                    const speedUpBuffer = e.renderedBuffer
                    const channels: Float32Array<ArrayBufferLike>[] = []

                    for (let i = 0; i < speedUpBuffer.numberOfChannels; i++) {
                        channels.push(speedUpBuffer.getChannelData(i))
                    }
                    
                    worker.postMessage({ channels, sampleRate: speedUpBuffer.sampleRate, format })
                }
            }
        }
    }

    const onErrorClose = () => {
        setError(null)
    }

    return (
        <>
            <Flex direction="column" gap='2xl' align="center">
                <div style={{ width: '200px' }}>
                    <FormItem top='Сохранить в:'>
                        <SegmentedControl options={formats} value={format} onChange={onFormatChange} />
                    </FormItem>
                </div>
                <Button onClick={onClick} loading={processing}>Сохранить</Button>
            </Flex>
            {error && <CustomSnackbar type="error" text={error} onClose={onErrorClose} />}
        </>
    )
}

export default SaveButton
