import { Icon48Pause, Icon48Play } from "@vkontakte/icons"
import { Div, IconButton } from "@vkontakte/vkui"
import { useContext } from "react"
import { PlayerContext } from "../../context/PlayerContext"

const PlayButton = () => {
    const { player, time, setTime, isPlaying, setIsPlaying, playbackRate } = useContext(PlayerContext)

    const play = () => {
        if (!player?.loaded) return
        if (playbackRate && time && player?.buffer?.duration && time < player.buffer.duration) {
            player?.start(0, time / playbackRate)
        } else {
            player?.start()
            if (setTime) setTime(0)
        }
        if (setIsPlaying) setIsPlaying(true)
    }

    const pause = () => {
        player?.stop()
        if (setIsPlaying) setIsPlaying(false)
    }

    return (
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
    )
}

export default PlayButton
