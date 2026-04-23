const BugIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" /><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" /><path d="M12 20v-9" /><path d="M6.53 9C4.6 8.8 3 7.1 3 5" /><path d="M6 13H2" /><path d="M3 21c0-2.1 1.7-3.9 3.8-4" /><path d="M20.97 5c-2 .2-3.53 1.9-3.53 3.8" /><path d="M22 13h-4" /><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
);

export default function Header() {
    return (
        <header className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-800">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <BugIcon />
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Debug<span className="text-blue-500">AI</span></h1>
                <p className="text-sm text-gray-400 mt-1">Pinpoint accurate error analysis & resolution</p>
            </div>
        </header>
    );
}