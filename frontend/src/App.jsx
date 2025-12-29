import { useState, useEffect } from 'react'
import axios from 'axios'
import { BookOpen, RefreshCw, ArrowRight, ExternalLink } from 'lucide-react'

// Simple Card Component
const ArticleCard = ({ article, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-100 group">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${article.isUpdated ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {article.isUpdated ? 'Enhanced by AI' : 'Original'}
        </span>
        <span className="text-gray-400 text-sm">
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-gray-600 line-clamp-3 mb-4">
        {article.content.substring(0, 150)}...
      </p>
      <div className="flex items-center text-blue-600 font-medium text-sm">
        Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
)

// Detail View Component
const ArticleDetail = ({ article, onBack }) => (
  <div className="max-w-4xl mx-auto p-4 animate-fade-in">
    <button onClick={onBack} className="mb-6 flex items-center text-gray-500 hover:text-gray-800 transition-colors">
      <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Articles
    </button>

    <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
      <header className="mb-8 border-b border-gray-100 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center">Posted on {new Date(article.createdAt).toLocaleDateString()}</span>
          {article.originalUrl && (
            <a href={article.originalUrl} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
              <ExternalLink className="w-3 h-3 mr-1" /> Original Source
            </a>
          )}
        </div>
      </header>

      <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
        {article.content}
      </div>

      {article.references && article.references.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">References & Sources</h3>
          <ul className="space-y-2">
            {article.references.map((ref, idx) => (
              <li key={idx}>
                <a href={ref} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  </div>
)

function App() {
  const [activeTab, setActiveTab] = useState('original')
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchArticles = async (type) => {
    setLoading(true)
    try {
      // type for API is 'original' or 'updated'
      // My automation script updates articles in place (isUpdated=true), so I need to differentiate.
      // API supports ?type=original | updated
      const { data } = await axios.get(`http://localhost:5000/articles?type=${type}`)
      setArticles(data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles(activeTab)
  }, [activeTab])

  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                BeyondChats Blog Reader
              </span>
            </div>

            <a href="https://github.com/StartUp-Internships/beyondchats-assignment" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
              Assignment
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab('original')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'original'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Original Articles
            </button>
            <button
              onClick={() => setActiveTab('updated')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'updated'
                ? 'bg-purple-50 text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              AI Enhanced
            </button>
          </div>

          <button onClick={() => fetchArticles(activeTab)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Refresh">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard
                key={article._id}
                article={article}
                onClick={() => setSelectedArticle(article)}
              />
            ))}

            {articles.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                No articles found in this category.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
