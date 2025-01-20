import { FC, createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";

type Panel = 'main' | 'player'

interface PanelContextType {
    activePanel: Panel
    setActivePanel: Dispatch<SetStateAction<Panel>> | undefined
}

export const PanelContext = createContext<PanelContextType>({ activePanel: 'main', setActivePanel: undefined })

export const PanelProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [activePanel, setActivePanel] = useState<Panel>('main')

    return (
        <PanelContext.Provider value={{ activePanel, setActivePanel }}>
            {children}
        </PanelContext.Provider>
    )
}
