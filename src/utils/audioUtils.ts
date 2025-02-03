import * as Tone from 'tone'

function splitBuffer(buffer: AudioBuffer, chunkDuration: number): AudioBuffer[] {
    const chunks: AudioBuffer[] = []
    const numChunks = Math.ceil(buffer.duration / chunkDuration)

    for (let i = 0; i < numChunks; i++) {
        const start = i * chunkDuration * buffer.sampleRate;
        const end = Math.min((i + 1) * chunkDuration * buffer.sampleRate, buffer.length)

        const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, end - start, buffer.sampleRate)
        const chunkBuffer = offlineCtx.createBuffer(buffer.numberOfChannels, end - start, buffer.sampleRate)

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            chunkBuffer.copyToChannel(buffer.getChannelData(channel).subarray(start, end), channel)
        }

        chunks.push(chunkBuffer)
    }

    return chunks
}

async function processChunk(chunk: AudioBuffer, playbackRate: number, pitchOffset: number) {
    const processedChunk = await Tone.Offline(() => {
        const grainPlayer = new Tone.GrainPlayer({ url: chunk }).toDestination()
        grainPlayer.playbackRate = playbackRate
        grainPlayer.detune = pitchOffset * 100
        grainPlayer.start(0)
    }, chunk.duration / playbackRate)

    const buffer = processedChunk.get()
    return buffer
}

function getFinalBuffer(processedChunks: AudioBuffer[]) {
    const totalLength = processedChunks.reduce((sum, buf) => sum + buf.length, 0)
    const finalBuffer = new OfflineAudioContext(processedChunks[0].numberOfChannels, totalLength, processedChunks[0].sampleRate).createBuffer(
        processedChunks[0].numberOfChannels,
        totalLength,
        processedChunks[0].sampleRate
    )

    let offset = 0
    for (const buf of processedChunks) {
        for (let channel = 0; channel < buf.numberOfChannels; channel++) {
            finalBuffer.copyToChannel(buf.getChannelData(channel), channel, offset)
        }
        offset += buf.length
    }

    return finalBuffer
}

export async function processAudioBuffer(
    buffer: AudioBuffer,
    playbackRate: number,
    pitchOffset: number,
    chunkDuration: number = 5 
) {
    const chunks = splitBuffer(buffer, chunkDuration)
    const processedChunks: AudioBuffer[] = []

    for (const chunk of chunks) {
        const outputBuffer = await processChunk(chunk, playbackRate, pitchOffset)

        if (outputBuffer) {
            processedChunks.push(outputBuffer)
        }
    }

    const finalBuffer = getFinalBuffer(processedChunks)

    const channels: Float32Array[] = []
    for (let i = 0; i < finalBuffer.numberOfChannels; i++) {
        channels.push(finalBuffer.getChannelData(i))
    }

    return {
        channels,
        sampleRate: finalBuffer.sampleRate
    }
}
