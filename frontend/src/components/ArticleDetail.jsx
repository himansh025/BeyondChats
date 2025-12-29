import { ArrowLeft, ExternalLink, Link2, Calendar, Sparkles } from 'lucide-react'

export default function ArticleDetail({ article, onBack }) {
    const isEnhanced = article.isUpdated

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group px-4 py-2 rounded-lg hover:bg-white/50"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Articles</span>
                </button>

                <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className={`h-3 ${isEnhanced
                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500'
                        : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500'
                        }`} />

                    <div className="p-8 md:p-12">
                        <header className="mb-8 pb-8 border-b border-gray-100">
                            <div className="mb-4">
                                <span className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
                  ${isEnhanced
                                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                                        : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'
                                    }
                `}>
                                    {isEnhanced && <Sparkles className="w-4 h-4" />}
                                    {isEnhanced ? 'AI Enhanced Article' : 'Original Article'}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(article.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                {article.originalUrl && (
                                    <a
                                        href={article.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-medium"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Original Source
                                    </a>
                                )}
                            </div>
                        </header>

                        <div className="prose prose-lg max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {article.content}
                            </div>
                        </div>

                        {article.references && article.references.length > 0 && (
                            <div className="mt-12 pt-8 border-t-2 border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <Link2 className="w-5 h-5 text-purple-600" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        References & Sources
                                    </h3>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                                    <p className="text-sm text-gray-600 mb-4">
                                        This article was enhanced using insights from the following top-ranking sources:
                                    </p>
                                    <ul className="space-y-3">
                                        {article.references.map((ref, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                    {idx + 1}
                                                </span>
                                                <a
                                                    href={ref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 hover:underline break-all flex-1 font-medium"
                                                >
                                                    {ref}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </div>
    )
}
