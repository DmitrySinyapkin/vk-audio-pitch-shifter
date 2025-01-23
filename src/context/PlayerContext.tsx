import { FC, createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";
import * as Tone from "tone"
import { GrainPlayer } from "tone";

interface PlayerContextType {
    source: string | undefined
    setSource?: Dispatch<SetStateAction<string | undefined>> | undefined
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
}

export const PlayerContext = createContext<PlayerContextType>({ source: undefined })

export const PlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [source, setSource] = useState<string | undefined>(undefined)
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

    return (
        <PlayerContext.Provider value={{ 
            source, 
            setSource, 
            player, 
            initPlayer,
            time, 
            setTime, 
            isPlaying, 
            setIsPlaying,
            pitchOffset,
            setPitchOffset,
            playbackRate,
            setPlaybackRate 
        }}>
            {children}
        </PlayerContext.Provider>
    )
}
