import FileUpload from './components/FileUpload';

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
                        Vocal Separator
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Upload your MP4 video and let AI separate the vocals from the music instantly.
                    </p>
                </div>

                {/* Main Content */}
                <FileUpload />

                {/* Footer */}
                <footer className="mt-20 text-center text-white/30 text-sm">
                    <p>Powered by Demucs AI • Built with Next.js & FastAPI</p>
                </footer>
            </div>
        </main>
    );
}
