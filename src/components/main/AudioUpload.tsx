import { FC, useContext, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Placeholder, DropZone } from "@vkontakte/vkui";
import { Icon56MusicOutline } from '@vkontakte/icons';
import CustomSnackbar from "../common/CustomSnackbar";

const AudioUpload = () => {
    const { setTrack } = useContext(PlayerContext)

    const [error, setError] = useState<string | null>(null)

    const Item: FC<{ active: boolean }> = ({ active }) => (
        <Placeholder.Container>
          <Placeholder.Icon>
            <Icon56MusicOutline fill={active ? 'var(--vkui--color_icon_accent)' : undefined} />
          </Placeholder.Icon>
          <Placeholder.Header>Загрузить аудио</Placeholder.Header>
          <Placeholder.Text>
            Перенесите аудио-файл сюда, чтобы изменить его тональность или темп
          </Placeholder.Text>
        </Placeholder.Container>
      );
      
    const dragOverHandler = (event) => {
        event.preventDefault()
    };
      
    const dropHandler = (event) => {
        event.preventDefault()

        if (!event.dataTransfer.files[0]?.type.includes('audio')) {
            setError('Неподдерживаемый формат. Загрузите аудио-файл')
            return
        }

        const title = event.dataTransfer.files[0]?.name || ''
        
        const fileReader = new FileReader()
        fileReader.onload = function(e) {
            const url = e.target?.result
            if (url && setTrack) {
                setTrack(url, title)
            }
        }
        fileReader.readAsDataURL(event.dataTransfer.files[0]) 
    }

    const onErrorClose = () => {
        setError(null)
    }

    return (
        <>
            <DropZone.Grid>
                <DropZone onDragOver={dragOverHandler} onDrop={dropHandler}>
                    {({ active }) => <Item active={active} />}
                </DropZone>
            </DropZone.Grid>
            {error && <CustomSnackbar type="error" text={error} onClose={onErrorClose} />}
        </>
    )
}

export default AudioUpload
