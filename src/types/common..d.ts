interface CustomSliderProps {
    min: number
    max: number
    step: number
    value: number
    onChange: (value: number) => void
    description: ReactNode
}

type OutputFormat = 'mp3' | 'wav'


interface WorkerMessage {
    status: string
    url: string
}

interface SnackbarMessage {
    type: 'success' | 'error'
    text: string
}
