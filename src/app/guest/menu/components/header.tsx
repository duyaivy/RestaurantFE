


const Header = () => {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-amber-600/10 blur-3xl rounded-full pointer-events-none" />
            <div className="h-px w-full bg-linear-to-r from-transparent via-amber-600/50 to-transparent" />
            <div className="relative px-6 pt-8 pb-7 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px w-8 bg-linear-to-r from-transparent to-amber-600/70" />
                    <span className="text-amber-500 text-[9px] font-semibold tracking-[0.5em] uppercase">Fine Dining</span>
                    <div className="h-px w-8 bg-linear-to-r from-transparent to-amber-600/70" />
                </div>
                <h1 className="text-4xl font-thin tracking-[0.28em] text-white">THỰC ĐƠN</h1>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="h-px w-12 bg-neutral-800" />
                    <div className="w-1 h-1 rounded-full bg-amber-600/60" />
                    <div className="h-px w-4 bg-neutral-800" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
                    <div className="h-px w-4 bg-neutral-800" />
                    <div className="w-1 h-1 rounded-full bg-amber-600/60" />
                    <div className="h-px w-12 bg-neutral-800" />
                </div>
            </div>
            <div className="h-px w-full bg-linear-to-r from-transparent via-amber-900/40 to-transparent" />
        </div>
    )
}

export default Header