import { FC } from "react";
import { Snackbar } from "@vkontakte/vkui";
import { SnackbarPlacement } from "@vkontakte/vkui/dist/components/Snackbar/types";
import { Icon28ErrorCircleOutline, Icon28CheckCircleOutline } from "@vkontakte/icons";

interface CustomSnackbarProps {
    type :'success' | 'error'
    text: string
    duration?: number
    placement?: SnackbarPlacement
    onClose: () => void
}

const CustomSnackbar: FC<CustomSnackbarProps> = ({ type, text, duration, placement, onClose }) => {
    const icon = () => {
        switch (type) {
            case 'success':
                return <Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />
            case 'error':
                return <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
        }
    }

    return (
        <Snackbar
            onClose={onClose}
            before={icon()}
            duration={duration}
            placement={placement}
        >
            {text}
        </Snackbar>
    )
}

export default CustomSnackbar
