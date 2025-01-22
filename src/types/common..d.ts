interface CustomSliderProps {
    min: number
    max: number
    step: number
    value: number
    onChange: (value: number) => void
    description: ReactNode
}
