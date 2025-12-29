export default function TabSelector({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'original', label: 'Original Articles', color: 'blue' },
        { id: 'updated', label: 'AI Enhanced', color: 'purple' }
    ]

    return (
        <div className="flex bg-white p-1.5 rounded-xl border border-gray-200 shadow-md">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
            px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200
            ${activeTab === tab.id
                            ? `bg-gradient-to-r ${tab.color === 'blue'
                                ? 'from-blue-500 to-blue-600'
                                : 'from-purple-500 to-purple-600'
                            } text-white shadow-lg transform scale-105`
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
          `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
