import Link from "next/link"
import NavInput from "./NavInput"

export default function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-neutral-900 antialiased">
            <div className="flex flex-col items-center px-4 py-8 md:py-12">
                <NavInput />
                {children}
            </div>
        </div>
    )
}
