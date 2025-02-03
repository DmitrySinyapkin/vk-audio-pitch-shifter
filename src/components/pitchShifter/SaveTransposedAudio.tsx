import { useContext, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Button, Flex, SegmentedControl, FormItem, SegmentedControlValue, SegmentedControlOptionInterface, Spinner, Text, Popover, Div } from "@vkontakte/vkui";
import CustomSnackbar from "../common/CustomSnackbar";
import { OUTPUT_TYPES } from "../../constants/file";
import useConverter from "../../hooks/useConverter";
import { downloadOutputFile } from "../../utils/fileUtils";

const formats: SegmentedControlOptionInterface[] = [
    {
        label: 'WAV',
        value: 'wav',
        'aria-label': 'WAV'
    },
    {
        label: 'MP3',
        value: 'mp3',
        'aria-label': 'MP3'
    }
]

function isOutputFormat(value: SegmentedControlValue): value is OutputFormat {
    return typeof value === 'string' && OUTPUT_TYPES.includes(value)
}

const SaveTransposedAudio = () => {
    const { player, sourceTitle, pitchOffset, playbackRate } = useContext(PlayerContext)

    const [format, setFormat] = useState<OutputFormat>('wav')

    const onFinish = (url: string) => {
        downloadOutputFile(url, sourceTitle, format)
    }

    const { processing, message, clearMessage, createFile } = useConverter(onFinish)

    const onFormatChange = (value: SegmentedControlValue) => {
        if (isOutputFormat(value)) {
            setFormat(value)
        }   
    }

    const onSaveButtonClick = async () => {
        if (player?.buffer && playbackRate && pitchOffset !== undefined) {
            const buffer = player.buffer.get()

            if (buffer) {
                await createFile(buffer, playbackRate, pitchOffset, format)
            }
        }
    }

    return (
        <>
            <Flex direction="column" gap='2xl' align="center">
                <div style={{ width: '200px' }}>
                    <FormItem top='Сохранить в:'>
                        <SegmentedControl options={formats} value={format} onChange={onFormatChange} />
                    </FormItem>
                </div>
                <Popover
                    shown={processing !== ''}
                    placement="bottom"
                    content={
                        <Flex align="center" style={{ marginTop: 10 }}>
                            <Div>
                                <Spinner size="regular" />
                            </Div>
                            <Div>
                                <Text weight="3">{ processing }</Text>
                            </Div>
                        </Flex>
                    }
                >
                    <Button size="l" onClick={onSaveButtonClick} disabled={processing !== ''}>Сохранить</Button>
                </Popover>
            </Flex>
            {message && <CustomSnackbar type={message.type} text={message.text} onClose={clearMessage} />}
        </>
    )
}

export default SaveTransposedAudio
