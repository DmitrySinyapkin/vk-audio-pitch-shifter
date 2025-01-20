import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { PanelHeader, Group } from "@vkontakte/vkui";

const PlayerPanel = () => {
    const { source } = useContext(PlayerContext)

    return (
        <>
            <PanelHeader>Player</PanelHeader>
            <Group>
                <audio src={source} controls />
            </Group>
        </>
    )
}

export default PlayerPanel
