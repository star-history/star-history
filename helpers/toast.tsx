import React from "react"
import ReactDOM from "react-dom"
import Toast from "../components/Toast"

type ToastType = "succeed" | "warn" | "error" | "normal"

interface ToastProps {
    message: string
    type: ToastType
    duration: number
    destroy: () => void
}

interface ToastCallbacks {
    destroy: () => void
}

function show(message: string, type: ToastType, duration: number): ToastCallbacks {
    const tempDiv = document.createElement("div")
    document.body.appendChild(tempDiv)

    const destroy = () => {
        ReactDOM.unmountComponentAtNode(tempDiv)
        tempDiv.remove()
    }

    const toastProps: ToastProps = {
        message,
        type,
        duration,
        destroy
    }

    ReactDOM.render(<Toast {...toastProps} />, tempDiv)

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
