import { ReactNode, useContext, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Slider, Flex, Text } from "@vkontakte/vkui";

interface SliderItem {
    min: number
    max: number
    step: number
    value: number
    onChange: (value: number) => void
    description: ReactNode
}

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

    const sliders: SliderItem[] = [
        {
            min: -12,
            max: 12,
            step: 1,
            value: pitchOffset,
            onChange: changePitch,
            description: <Text>Изменение в полутонах: {pitchOffset > 0 ? `+${pitchOffset}` : pitchOffset}</Text>
        },
        {
            min: 0.5,
            max: 1.5,
            step: 0.05,
            value: playbackRate,
            onChange: changePlaybackRate,
            description: <Text>Темп: {Math.trunc(playbackRate * 100)}%</Text>
        }
    ]

    return (
        <Flex direction="column" align="center" margin="auto" gap='4xl'>
            {sliders.map((slider: SliderItem, index: number) => 
                <Flex.Item key={index}flex="grow" style={{ width: '320px' }}>
                    <Slider
                        min={slider.min}
                        max={slider.max}
                        step={slider.step}
                        value={slider.value}
                        onChange={slider.onChange}
                    />
                    {slider.description}
                </Flex.Item>
            )}
        </Flex>
    )
}

export default PitchShifter
