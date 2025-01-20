import { FC, createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";

interface PlayerContextType {
    source: string | undefined
    setSource: Dispatch<SetStateAction<string | undefined>> | undefined
}

export const PlayerContext = createContext<PlayerContextType>({ source: undefined, setSource: undefined })

export const PlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [source, setSource] = useState<string | undefined>(undefined)

    return (
        <PlayerContext.Provider value={{ source, setSource }}>
            {children}
        </PlayerContext.Provider>
    )
}
