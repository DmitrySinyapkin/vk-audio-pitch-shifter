import { useContext, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Slider, Flex, Text } from "@vkontakte/vkui";

const PitchShifter = () => {
    const { player } = useContext(PlayerContext)

    const [pitchOffset, setPitchOffset] = useState<number>(0)
    const [playbackRate, setPlaybackRate] = useState<number>(1)

    const changePitch = (value: number) => {
        player?.set({ detune: value * 100 })
        setPitchOffset(value)
    }

    const changePlaybackRate = (value: number) => {
        player?.set({ playbackRate: value })
        setPlaybackRate(value)
    }

    return (
        <Flex direction="column" align="center" margin="auto" gap='4xl'>
            <Flex.Item flex="grow" style={{ width: '320px' }}>
                <Slider
                    min={-12}
                    max={12}
                    step={1}
                    value={pitchOffset}
                    onChange={changePitch}
                />
                <Text>Изменение в полутонах: {pitchOffset > 0 ? `+${pitchOffset}` : pitchOffset}</Text>
            </Flex.Item>
            <Flex.Item flex="grow" style={{ width: '320px' }}>
                <Slider
                    min={0.5}
                    max={1.5}
                    step={0.05}
                    value={playbackRate}
                    onChange={changePlaybackRate}
                />
                <Text>Темп: {Math.trunc(playbackRate * 100)}%</Text>
            </Flex.Item>
        </Flex>
    )
}

export default PitchShifter
