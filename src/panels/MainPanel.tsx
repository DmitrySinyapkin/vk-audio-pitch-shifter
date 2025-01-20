import { useContext, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { PanelContext } from "../context/PanelContext";
import { PanelHeader, Group } from "@vkontakte/vkui";
import AudioUpload from "../components/main/AudioUpload";

const MainPanel = () => {
    const { source } = useContext(PlayerContext)
    const { setActivePanel } = useContext(PanelContext)

    useEffect(() => {
        if (source && setActivePanel) {
            setActivePanel('player')
        }
    }, [source])

    return (
        <>
            <PanelHeader>Audio Pitch Shifter</PanelHeader>
            <Group>
                <AudioUpload />
            </Group>
        </>
    )
}

export default MainPanel
