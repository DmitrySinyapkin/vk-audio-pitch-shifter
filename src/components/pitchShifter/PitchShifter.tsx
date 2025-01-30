import { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Flex, Text } from "@vkontakte/vkui";
import CustomSlider from "../common/CustomSlider";

const PitchShifter = () => {
    const { player, pitchOffset, setPitchOffset, playbackRate, setPlaybackRate } = useContext(PlayerContext)

    const changePitch = (value: number) => {
        player?.set({ detune: value * 100 })
        if (setPitchOffset) setPitchOffset(value)
    }

    const changePlaybackRate = (value: number) => {
        player?.set({ playbackRate: value })
        if (setPlaybackRate) setPlaybackRate(value)
    }

    const sliders: CustomSliderProps[] = [
        {
            min: -12,
            max: 12,
            step: 1,
            value: pitchOffset!,
            onChange: changePitch,
            description: <Text>Изменение в полутонах: {pitchOffset! > 0 ? `+${pitchOffset}` : pitchOffset}</Text>
        },
        {
            min: 0.5,
            max: 1.5,
            step: 0.05,
            value: playbackRate!,
            onChange: changePlaybackRate,
            description: <Text>Темп: {Math.trunc(playbackRate! * 100)}%</Text>
        }
    ]

    return (
        <Flex direction="column" align="center" margin="auto" gap='4xl'>
            {sliders.map((slider: CustomSliderProps, index: number) => 
                <CustomSlider slider={slider} key={index} />
            )}
        </Flex>
    )
}

export default PitchShifter
