import { useContext, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { PanelContext } from "../context/PanelContext";
import { PanelHeader, Group } from "@vkontakte/vkui";
import { Icon24MusicOutline } from '@vkontakte/icons';
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
            <PanelHeader
                before={<Icon24MusicOutline fill="var(--vkui--color_icon_accent)" style={{ marginLeft: '16px' }} />}
            >
                Audio Pitch Shifter
            </PanelHeader>
            <Group>
                <AudioUpload />
            </Group>
        </>
    )
}

export default MainPanel
