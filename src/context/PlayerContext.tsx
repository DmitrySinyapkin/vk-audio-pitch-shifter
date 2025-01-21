import { FC, createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";
import * as Tone from "tone"
import { Player } from "tone";

interface PlayerContextType {
    source: string | undefined
    setSource?: Dispatch<SetStateAction<string | undefined>> | undefined
    player?: Player | undefined
    initPlayer?: () => void
}

export const PlayerContext = createContext<PlayerContextType>({ source: undefined })

export const PlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [source, setSource] = useState<string | undefined>(undefined)
    const [player, setPlayer] = useState<Player | undefined>(undefined)

    const initPlayer = () => {
        if (source) {
            const pl = new Tone.Player(source).toDestination()
            setPlayer(pl)
        }
    }

    return (
        <PlayerContext.Provider value={{ source, setSource, player, initPlayer }}>
            {children}
        </PlayerContext.Provider>
    )
}
