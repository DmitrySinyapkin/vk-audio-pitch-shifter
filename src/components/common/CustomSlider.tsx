import { Flex, Slider } from "@vkontakte/vkui";
import { FC } from "react";

const CustomSlider: FC<{ slider: CustomSliderProps }> = ({ slider }) => {
    return (
        <Flex.Item flex="grow" style={{ width: '320px' }}>
            <Slider
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={slider.value}
                onChange={slider.onChange}
            />
            {slider.description}
        </Flex.Item>
    )
}

export default CustomSlider
