import { ArrowRight, Sparkles, FileText } from 'lucide-react'

export default function ArticleCard({ article, onClick }) {
    const isEnhanced = article.isUpdated

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 group transform hover:-translate-y-1"
        >
            <div className={`h-2 ${isEnhanced ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`} />

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className={`
            px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5
            ${isEnhanced
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                            : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'
                        }
          `}>
                        {isEnhanced ? (
                            <>
                                <Sparkles className="w-3 h-3" />
                                Enhanced by AI
                            </>
                        ) : (
                            <>
                                <FileText className="w-3 h-3" />
                                Original
                            </>
                        )}
                    </span>
                    <span className="text-gray-400 text-xs font-medium">
                        {new Date(article.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {article.title}
                </h3>

                <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                    {article.content.substring(0, 180)}...
                </p>

                {isEnhanced && article.references && article.references.length > 0 && (
                    <div className="mb-4 text-xs text-purple-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                        {article.references.length} reference{article.references.length > 1 ? 's' : ''} cited
                    </div>
                )}

                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    )
}
