export const formatCurrentTime = (value: number) => {
    const minutes = formattedValue(Math.trunc(value / 60))
    const seconds = formattedValue(Math.round(value % 60))
    return `${minutes}:${seconds}`
}

const formattedValue = (value: number) => value.toString().padStart(2, '0')
