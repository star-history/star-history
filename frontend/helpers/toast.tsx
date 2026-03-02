import React from "react"
import { createRoot } from "react-dom/client"
import Toast from "../components/Toast"

type ToastType = "succeed" | "warn" | "error" | "normal"

interface ToastCallbacks {
    destroy: () => void
}

function show(message: string, type: ToastType, duration: number): ToastCallbacks {
    const tempDiv = document.createElement("div")
    document.body.appendChild(tempDiv)
    const root = createRoot(tempDiv)

    const destroy = () => {
        root.unmount()
        tempDiv.remove()
    }

    root.render(<Toast message={message} type={type} duration={duration} destroy={destroy} />)

    return { destroy }
}

// NOTE: Just for mocking alert and only for this project.
const toast = {
    succeed(message: string, duration = 2000): ToastCallbacks {
        return show(message, "succeed", duration)
    },
    warn(message: string, duration = 2000): ToastCallbacks {
        return show(message, "warn", duration)
    },
    error(message: string, duration = 2000): ToastCallbacks {
        return show(message, "error", duration)
    }
}

export default toast
