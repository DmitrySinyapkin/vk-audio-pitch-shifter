import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { PanelContext } from "../context/PanelContext";
import { PanelHeader, PanelHeaderButton, Group, Flex, Spacing } from "@vkontakte/vkui";
import { Icon24BrowserBack } from '@vkontakte/icons'
import AudioPlayer from "../components/player/AudioPlayer";
import PitchShifter from "../components/pitchShifter/PitchShifter";
import SaveButton from "../components/pitchShifter/SaveButton";

const PlayerPanel = () => {
    const { sourceTitle, resetPlayer } = useContext(PlayerContext)
    const { setActivePanel } = useContext(PanelContext)

    const onBackButtonClick = () => {
        if (setActivePanel && resetPlayer) {
            resetPlayer()
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
                {sourceTitle || 'Player'}
            </PanelHeader>
            <Group>
                <Flex direction='column' align="center">
                    <AudioPlayer />
                    <Spacing size='4xl' />
                    <PitchShifter />
                    <Spacing size='4xl' />
                    <Spacing size='4xl' />
                    <SaveButton />
                </Flex>
                <Spacing size='4xl' />
            </Group>
        </>
    )
}

export default PlayerPanel
