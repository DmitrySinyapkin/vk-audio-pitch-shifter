import { useContext, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Button } from "@vkontakte/vkui";
import CustomSnackbar from "../common/CustomSnackbar";

interface WorkerMessage {
    status: string
    url: string
}

const SaveButton = () => {
    const { player, sourceTitle, pitchOffset, playbackRate } = useContext(PlayerContext)

    const [processing, setProcessing] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const worker: Worker = new Worker(new URL('../../worker/converter.ts', import.meta.url), {
        type: 'module'
      })

    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        if (e.data.status === 'success') {
            setProcessing(false)
            const link = document.createElement('a');
            link.href = e.data.url;
            link.download = sourceTitle || 'output.mp3';
            document.body.appendChild(link);
            link.click()
            document.body.removeChild(link)
        } else {
            setError('Ошибка при сохранении')
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
                source.detune.value = pitchOffset

                //lines the audio for rendering
                source.start()

                //renders everything you lined up
                offlineCtx.startRendering()
                offlineCtx.oncomplete = function(e) {
                    //copies the rendered buffer into your variable.
                    const speedUpBuffer = e.renderedBuffer
                    const channelsData: Float32Array<ArrayBufferLike>[] = []

                    for (let i = 0; i < speedUpBuffer.numberOfChannels; i++) {
                        channelsData.push(speedUpBuffer.getChannelData(i))
                    }
                    
                    worker.postMessage({ channelsData, sampleRate: speedUpBuffer.sampleRate, length: speedUpBuffer.length })
                }
            }
        }
    }

    const onErrorClose = () => {
        setError(null)
    }

    return (
        <>
            <Button onClick={onClick} loading={processing}>Сохранить в mp3</Button>
            {error && <CustomSnackbar type="error" text={error} onClose={onErrorClose} />}
        </>
    )
}

export default SaveButton
