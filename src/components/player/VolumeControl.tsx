import { useContext, useState } from 'react'
import { PlayerContext } from '../../context/PlayerContext'
import { Flex, IconButton, Slider } from '@vkontakte/vkui'
import { Icon20Volume, Icon20Mute } from '@vkontakte/icons'

const VolumeControl = () => {
    const { player } = useContext(PlayerContext)

    const [volume, setVolume] = useState<number>(localStorage.getItem('vk-ps-vol') ? Number(localStorage.getItem('vk-ps-vol')) : 0)
    const [muted, setMuted] = useState<boolean>(false)

    const changeVolume = (value: number) => {
        player?.set({ volume: value })
        localStorage.setItem('vk-ps-vol', value.toString())
        setVolume(value)
        if (muted) {
            toggleMute()
        }
    }

    const toggleMute = () => {
        player?.set({ mute: !muted })
        setMuted(prev => !prev)
    }

    return (
        <Flex gap="xs" margin='auto' align='center' style={{ marginLeft: '20px' }}>
            {
                muted
                ? <IconButton aria-label="mute" onClick={toggleMute}>
                    <Icon20Mute fill="var(--vkui--color_icon_accent)" />
                </IconButton>
                : <IconButton aria-label="volume" onClick={toggleMute}>
                    <Icon20Volume fill="var(--vkui--color_icon_accent)" />
                </IconButton>
            }
            <div style={{ width: '70px' }}>
                <Slider
                    min={-20}
                    max={20}
                    step={0.2}
                    value={volume}
                    onChange={changeVolume}
                    size="s"
                />
            </div>
        </Flex>
    )
}

export default VolumeControl
