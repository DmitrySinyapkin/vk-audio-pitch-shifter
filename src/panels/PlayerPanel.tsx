import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { PanelContext } from "../context/PanelContext";
import { PanelHeader, PanelHeaderButton, Group, Flex, Spacing } from "@vkontakte/vkui";
import { Icon24BrowserBack } from '@vkontakte/icons'
import AudioPlayer from "../components/player/AudioPlayer";
import PitchShifter from "../components/pitchShifter/PitchShifter";

const PlayerPanel = () => {
    const { setSource, player, isPlaying, setIsPlaying, setTime } = useContext(PlayerContext)
    const { setActivePanel } = useContext(PanelContext)

    const onBackButtonClick = () => {
        if (setActivePanel && setSource && setTime && setIsPlaying) {
            if (isPlaying) {
                player?.stop()
                setIsPlaying(false)
            }
            setTime(0)
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
                <Flex direction='column' align="center">
                    <AudioPlayer />
                    <Spacing size='4xl' />
                    <PitchShifter />
                </Flex>
                <Spacing size='4xl' />
            </Group>
        </>
    )
}

export default PlayerPanel
