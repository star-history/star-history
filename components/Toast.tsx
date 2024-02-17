import React, { useEffect, useState } from "react"
import { ANIMATION_DURATION } from "../helpers/consts"

interface ToastProps {
    message: string
    type?: "normal" | "warn" | "succeed" | "error"
    duration?: number
    destroy?: () => void
}

interface State {
    classname: string
}

const Toast: React.FC<ToastProps> = ({ message, type = "normal", duration = 2000, destroy }) => {
    const [state, setState] = useState<State>({ classname: "" })

    const bgColor = () => {
        switch (type) {
            case "normal":
                return "bg-black"
            case "warn":
                return "bg-orange-400"
            case "succeed":
                return "bg-green-600"
            case "error":
                return "bg-red-600"
            default:
                return "bg-black"
        }
    }

    const textColor = "text-white"

    const destroyToast = React.useCallback(() => {
        if (duration >= 0) {
            setState((prev) => ({ ...prev, classname: "-top-full" }))
            setTimeout(() => destroy?.(), ANIMATION_DURATION)
        }
    }, [destroy, duration])

    useEffect(() => {
        if (duration >= 0) {
            const timeoutId = setTimeout(destroyToast, duration)
            return () => clearTimeout(timeoutId)
        }
    }, [duration, destroyToast])

    return (
        <div
            className={`fixed z-100 top-0 left-0 transition-all duration-1000 w-full py-5 h-auto flex flex-row justify-center items-center drop-shadow-md ${bgColor()} ${state.classname}`}
            onClick={destroyToast}
        >
            <p className={`text-2xl ${textColor}`} dangerouslySetInnerHTML={{ __html: message }} />
        </div>
    )
}

export default Toast
