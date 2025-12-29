import { BookOpen } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 border-b border-blue-500 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                BeyondChats Blog Reader
                            </h1>
                            <p className="text-xs text-blue-100">AI-Powered Article Enhancement</p>
                        </div>
                    </div>

                    <a
                        href="https://github.com/himansh025/BeyondChats"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm text-sm font-medium"
                    >
                        View Assignment
                    </a>
                </div>
            </div>
        </nav>
    )
}
