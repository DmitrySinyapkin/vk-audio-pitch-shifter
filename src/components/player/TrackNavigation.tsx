import { useContext } from "react"
import { PlayerContext } from "../../context/PlayerContext"
import { Flex, Slider, Text } from "@vkontakte/vkui"
import { formatCurrentTime } from "../../utils/timeUtils"

const TrackNavigation  = () => {
    const { player, time, setTime, playbackRate } = useContext(PlayerContext)

    const changePosition = (value: number) => {
        if (player?.state === 'started') {
            player?.stop()
            player?.start(0, value / playbackRate!)
        }
        if (setTime) setTime(value)
    }

    return (
        <Flex direction="column" justify="center" align="end">
            <Text weight="3">{ formatCurrentTime(time! / playbackRate!) } {/* / { formatCurrentTime(player?.buffer?.duration! / playbackRate!) } */}</Text>
            <div style={{ width: '200px' }}>
                <Slider
                    min={0}
                    max={player?.buffer?.duration}
                    value={time}
                    onChange={changePosition}
                    size="s"
                />
            </div>
        </Flex>
    )
}

export default TrackNavigation
