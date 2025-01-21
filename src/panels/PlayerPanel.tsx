import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { PanelContext } from "../context/PanelContext";
import { PanelHeader, PanelHeaderButton, Group } from "@vkontakte/vkui";
import { Icon24BrowserBack } from '@vkontakte/icons'
import AudioPlayer from "../components/player/AudioPlayer";

const PlayerPanel = () => {
    const { source, setSource } = useContext(PlayerContext)
    const { setActivePanel } = useContext(PanelContext)

    const onBackButtonClick = () => {
        if (setActivePanel && setSource) {
            setSource(undefined)
            setActivePanel('main')
        }
    }

    return (
        <>
            <PanelHeader
                before={
                    <PanelHeaderButton aria-label="back" onClick={onBackButtonClick}>
                        <Icon24BrowserBack />
                    </PanelHeaderButton>
                }
            >
                Player
            </PanelHeader>
            <Group>
                <AudioPlayer />
            </Group>
        </>
    )
}

export default PlayerPanel
