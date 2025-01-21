import { useState, useEffect, useContext } from "react";
import { Div, Flex, Slider, IconButton, Spinner, Text } from "@vkontakte/vkui";
import { Icon48Play, Icon48Pause, Icon48Volume, Icon48Mute } from '@vkontakte/icons'
import { PlayerContext } from "../../context/PlayerContext";
import { formatCurrentTime } from "../../utils/timeUtils";

const AudioPlayer = () => {
    const { player, source, initPlayer } = useContext(PlayerContext)

    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [time, setTime] = useState<number>(0)

    let interval: number | undefined

    useEffect(() => {
        if (source && initPlayer) {
            initPlayer()
        }
    }, [])

    useEffect(() => {
        if (isPlaying) {
            interval = setInterval(() => {
                setTime((prev => prev + 1))
            }, 1000)
        } else {
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    }, [isPlaying])

    useEffect(() => {
        if (player?.buffer.duration && time >= player.buffer.duration) {
            setIsPlaying(false)
            setTime(0)
        }
    }, [time])

    const play = () => {
        if (player?.buffer?.duration && time < player.buffer.duration) {
            player?.start(0, time)
        } else {
            player?.start()
            setTime(0)
        }
        setIsPlaying(true)
    }

    const pause = () => {
        player?.stop()
        setIsPlaying(false)
    }

    const changePosition = (value: number) => {
        player?.seek(value)
        setTime(value)
    }

    return (
        <>
            <Flex justify="center" gap='4xl'>
                {
                    player
                    ? <>
                        <Div>
                            {
                                isPlaying
                                ? <IconButton aria-label="pause" onClick={pause}>
                                    <Icon48Pause fill="var(--vkui--color_icon_accent)" />
                                </IconButton>
                                : <IconButton aria-label="play" onClick={play}>
                                    <Icon48Play fill="var(--vkui--color_icon_accent)" />
                                </IconButton>
                            }
                        </Div>
                        <Flex direction="column" justify="center" align="end">
                            <Text weight="3">{ formatCurrentTime(time) }</Text>
                            <div style={{ width: '200px' }}>
                                <Slider
                                    min={0}
                                    max={player?.buffer.duration}
                                    value={time}
                                    onChange={changePosition}
                                    size="s"
                                />
                            </div>
                        </Flex>
                    </>
                    : <Spinner size="large" />
                }
            </Flex>
        </>
    )
}

export default AudioPlayer
