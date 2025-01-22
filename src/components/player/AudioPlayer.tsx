import { useEffect, useContext } from "react";
import PlayButton from "./PlayButton";
import TrackNavigation from "./TrackNavigation";
import { Flex, Spinner } from "@vkontakte/vkui";
import { Icon48Play, Icon48Pause, Icon48Volume, Icon48Mute } from '@vkontakte/icons'
import { PlayerContext } from "../../context/PlayerContext";

const AudioPlayer = () => {
    const { player, source, initPlayer, time, setTime, isPlaying, setIsPlaying } = useContext(PlayerContext)

    let interval: number | undefined

    useEffect(() => {
        if (source && initPlayer) {
            initPlayer()
        }
    }, [])

    useEffect(() => {
        if (isPlaying && setTime) {
            interval = setInterval(() => {
                setTime((prev => prev + 1))
            }, 1000)
        } else {
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    }, [isPlaying])

    useEffect(() => {
        if (time && setIsPlaying && setTime && player?.buffer.duration && time >= player.buffer.duration) {
            setIsPlaying(false)
            setTime(0)
        }
    }, [time])

    return (
        <>
            <Flex justify="center" gap='4xl'>
                {
                    player
                    ? <>
                        <PlayButton />
                        <TrackNavigation />
                    </>
                    : <Spinner size="large" />
                }
            </Flex>
        </>
    )
}

export default AudioPlayer
