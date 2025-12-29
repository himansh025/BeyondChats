import { useState, useEffect } from 'react'
import axios from 'axios'
import { RefreshCw } from 'lucide-react'

// Components
import Navbar from './components/Navbar'
import TabSelector from './components/TabSelector'
import ArticleCard from './components/ArticleCard'
import ArticleDetail from './components/ArticleDetail'
import LoadingGrid from './components/LoadingGrid'
import EmptyState from './components/EmptyState'

function App() {
  const [activeTab, setActiveTab] = useState('updated') // Start with AI Enhanced tab
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

  const fetchArticles = async (type) => {
    setLoading(true)
    try {
      // For original articles, fetch live from BeyondChats
      // For AI enhanced, fetch from database
      const endpoint = type === 'original'
        ? `${API_URL}/articles/live-originals`
        : `${API_URL}/articles?type=${type}`

      const { data } = await axios.get(endpoint)
      setArticles(data)
    } catch (error) {
      console.error('Error fetching articles:', error)
      setArticles([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles(activeTab)
  }, [activeTab])

  // If article is selected, show detail view
  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Discover Enhanced Articles
          </h2>
          <p className="text-gray-600">
            Explore original blog posts and their AI-enhanced versions powered by Google Search and Gemini LLM
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <TabSelector
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <button
            onClick={() => fetchArticles(activeTab)}
            disabled={loading}
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh articles"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {loading ? (
          <LoadingGrid />
        ) : articles.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard
                key={article._id}
                article={article}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>
        )}
        {!loading && articles.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border border-gray-200">
              <span className="text-sm font-semibold text-gray-700">
                Showing {articles.length} {activeTab === 'original' ? 'original' : 'AI-enhanced'} article{articles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
