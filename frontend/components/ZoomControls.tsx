import React, { useState } from "react"
import { useAppStore } from "../store"

interface ZoomControlsProps {
    onZoomIn: () => void
    onZoomOut: () => void
    onReset: () => void
    canZoomIn: boolean
    canZoomOut: boolean
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ 
    onZoomIn, 
    onZoomOut, 
    onReset, 
    canZoomIn, 
    canZoomOut 
}) => {
    return (
        <div className="flex flex-row items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Zoom:</span>
            <button
                onClick={onZoomIn}
                disabled={!canZoomIn}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                +
            </button>
            <button
                onClick={onZoomOut}
                disabled={!canZoomOut}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                -
            </button>
            <button
                onClick={onReset}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
            >
                Reset
            </button>
        </div>
    )
}

export default ZoomControls 