export type NumberUnitType = 1 | 1000 | 1000000

export const getNumberFormatUnit = (n: number): NumberUnitType => {
    if (n >= 1000000) {
        return 1000000
    }
    if (n >= 300) {
        return 1000
    }

    return 1
}

const getFormatNumber = (n: number, type: NumberUnitType = 1) => {
    if (type === 1) {
        return `${n}`
    }

    if (type === 1000000) {
        if (n >= 1000000 && n % 1000000 === 0) {
            return `${n / 1000000}M`
        }
        return `${(n / 1000000).toFixed(1)}M`
    }

    if (n >= 1000 && n % 1000 === 0) {
        return `${n / 1000}K`
    }
    return `${(n / 1000).toFixed(1)}K`
}

export default getFormatNumber
