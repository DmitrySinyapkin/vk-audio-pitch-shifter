import { FC, createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";
import * as Tone from "tone"
import { GrainPlayer } from "tone";

interface PlayerContextType {
    source: string | undefined
    sourceTitle?: string
    setTrack?: (url: string | undefined, title: string) => void
    player?: GrainPlayer | undefined
    initPlayer?: () => void
    time?: number
    setTime?: Dispatch<SetStateAction<number>>
    isPlaying?: boolean
    setIsPlaying?: Dispatch<SetStateAction<boolean>>
    pitchOffset?: number
    setPitchOffset?: Dispatch<SetStateAction<number>>
    playbackRate?: number
    setPlaybackRate?: Dispatch<SetStateAction<number>>
    resetPlayer?: () => void
}

export const PlayerContext = createContext<PlayerContextType>({ source: undefined })

export const PlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [source, setSource] = useState<string | undefined>(undefined)
    const [sourceTitle, setSourceTitle] = useState<string>('')
    const [player, setPlayer] = useState<GrainPlayer | undefined>(undefined)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [time, setTime] = useState<number>(0)
    const [pitchOffset, setPitchOffset] = useState<number>(0)
    const [playbackRate, setPlaybackRate] = useState<number>(1)

    const initPlayer = () => {
        if (source) {
            const pl = new Tone.GrainPlayer(source).toDestination()
            setPlayer(pl)
        }
    }

    const setTrack = (url: string | undefined, title: string) => {
        setSource(url)
        setSourceTitle(title)
    }

    const resetPlayer = () => {
        if (isPlaying) {
            player?.stop()
            setIsPlaying(false)
        }
        setTime(0)
        setPitchOffset(0)
        setPlaybackRate(1)
        setTrack(undefined, '')
    }

    return (
        <PlayerContext.Provider value={{ 
            source, 
            setTrack,
            sourceTitle,
            player, 
            initPlayer,
            time, 
            setTime, 
            isPlaying, 
            setIsPlaying,
            pitchOffset,
            setPitchOffset,
            playbackRate,
            setPlaybackRate,
            resetPlayer 
        }}>
            {children}
        </PlayerContext.Provider>
    )
}
