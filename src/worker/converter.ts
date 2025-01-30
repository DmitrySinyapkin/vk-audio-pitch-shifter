import * as lame from 'lamejs'
import { encode } from 'wav-encoder'

interface IncomingMessage {
    channels: Float32Array[]
    sampleRate: number
    format: OutputFormat
}

function float32ToInt16(buffer: Float32Array): Int16Array {
    const l = buffer.length;
    const buf = new Int16Array(l)
    for (let i = 0; i < l; i++) {
        buf[i] = Math.min(1, Math.max(-1, buffer[i])) * 0x7FFF
    }
    return buf
}

function audioDataToMp3Blob(channels: Float32Array[], sampleRate: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        try {
            const numChannels = channels.length
            let leftChannel: Int16Array
            let rightChannel: Int16Array | null

            // Interleave stereo channels if needed
            if (numChannels === 2) {
                leftChannel = float32ToInt16(channels[0])
                rightChannel = float32ToInt16(channels[1])
            } else {
                leftChannel = float32ToInt16(channels[0])
                rightChannel = null
            }

            // Create MP3 encoder
            const mp3Encoder = new lame.Mp3Encoder(numChannels, sampleRate, 128)
            const mp3Data: Int8Array[] = [];

            // Encode chunks of data
            const chunkSize = 1152
            for (let i = 0; i < leftChannel.length; i += chunkSize) {
                let mp3Chunk
                if (rightChannel) {
                    const leftChunk = leftChannel.subarray(i, i + chunkSize)
                    const rightChunk = rightChannel.subarray(i, i + chunkSize)
                    mp3Chunk = mp3Encoder.encodeBuffer(leftChunk, rightChunk)
                } else {
                    const chunk = leftChannel.subarray(i, i + chunkSize)
                    mp3Chunk = mp3Encoder.encodeBuffer(chunk)
                    
                }
                if (mp3Chunk.length > 0) {
                    mp3Data.push(new Int8Array(mp3Chunk))
                }
                
            }

            // Finalize MP3 file
            const mp3Final = mp3Encoder.flush();
            if (mp3Final.length > 0) {
                mp3Data.push(new Int8Array(mp3Final))
            }

            // Concatenate all MP3 chunks into a single ArrayBuffer
            const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' })
            resolve(mp3Blob);

        } catch (error) {
            reject(error)
        }
    });
}

function audioDataToWavBlob(channels: Float32Array[], sampleRate: number): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
        try {
            // Encode to WAV format
            const wav = await encode({
                sampleRate: sampleRate,
                channelData: channels,
                float: false,
                interleaved: channels.length === 1 // If mono, set interleaved to true
            });

            // Create a Blob from the encoded WAV data
            const wavBlob = new Blob([wav], { type: 'audio/wav' })
            resolve(wavBlob);

        } catch (error) {
            reject(error)
        }
    });
}

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent<IncomingMessage>) => {
    const { channels, sampleRate, format } = event.data

    try {
        let blob: Blob
        if (format === 'mp3') {
            blob = await audioDataToMp3Blob(channels, sampleRate)
        } else  {
            blob = await audioDataToWavBlob(channels, sampleRate)
        }
    
        if (blob) {
            const url = URL.createObjectURL(blob)
            postMessage({
                status: 'success',
                url
            })
        } else {
            postMessage({ status: 'error' })
        }
    } catch(err) {
        console.log(err)
        postMessage({ status: 'error' })
    }
}
