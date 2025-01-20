import { useContext, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { PanelContext } from "../context/PanelContext";
import { PanelHeader, Group, Placeholder, DropZone } from "@vkontakte/vkui";
import { Icon56MusicOutline } from '@vkontakte/icons';

const MainPanel = () => {
    const { source, setSource } = useContext(PlayerContext)
    const { setActivePanel } = useContext(PanelContext)

    const Item = ({ active }) => (
        <Placeholder.Container>
          <Placeholder.Icon>
            <Icon56MusicOutline fill={active ? 'var(--vkui--color_icon_accent)' : undefined} />
          </Placeholder.Icon>
          <Placeholder.Header>Загрузить аудио</Placeholder.Header>
          <Placeholder.Text>
            Перенесите аудио-файл сюда, чтобы изменить его тональность
          </Placeholder.Text>
        </Placeholder.Container>
      );
      
    const dragOverHandler = (event) => {
        event.preventDefault()
    };
      
    const dropHandler = (event) => {
        event.preventDefault()

        const fileReader = new FileReader()
        fileReader.onload = function(e) {
            const url = e.target?.result
            if (url && setSource) {
                setSource(url)
            }
        }
        fileReader.readAsDataURL(event.dataTransfer.files[0]) 
    }

    useEffect(() => {
        if (source && setActivePanel) {
            setActivePanel('player')
        }
    }, [source])

    return (
        <>
            <PanelHeader>Audio Pitch Shifter</PanelHeader>
            <Group>
                <DropZone.Grid>
                    <DropZone onDragOver={dragOverHandler} onDrop={dropHandler}>
                        {({ active }) => <Item active={active} />}
                    </DropZone>
                </DropZone.Grid>
            </Group>
        </>
    )
}

export default MainPanel
