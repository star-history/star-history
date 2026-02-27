import Link from "next/link"
import NavInput from "./NavInput"

export default function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-neutral-900 antialiased">
            <div className="flex flex-col items-center px-4 py-8 md:py-12">
                <NavInput />
                {children}
                <div className="mt-6 text-sm text-neutral-400 w-full max-w-2xl">
                    <Link href="/" className="inline-flex items-center gap-1 hover:text-neutral-600 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.5 13L5.5 8L10.5 3" />
                        </svg>
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}
