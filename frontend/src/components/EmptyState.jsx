import { FileQuestion } from 'lucide-react'

export default function EmptyState({ type }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                <FileQuestion className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No {type === 'original' ? 'Original' : 'AI Enhanced'} Articles Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
                {type === 'original'
                    ? 'Unable to fetch live articles from BeyondChats. Please check your internet connection and try again.'
                    : 'No enhanced articles yet. Run the enhancement script to generate AI-powered versions.'
                }
            </p>
        </div>
    )
}
