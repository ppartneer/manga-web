import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './store/favoritesContext'
import { HistoryProvider } from './store/historyContext'
import { SettingsProvider } from './store/settingsContext'
import Home from './pages/Home'
import Search from './pages/Search'
import MangaDetail from './pages/MangaDetail'
import Reader from './pages/Reader'
import Favorites from './pages/Favorites'
import History from './pages/History'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import { AnimatePresence } from 'framer-motion'

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <FavoritesProvider>
        <HistoryProvider>
          <Router>
            <div className="min-h-screen bg-background text-white pb-20 overflow-x-hidden">
              <Header />
              <main className="container mx-auto px-4 pt-20">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/manga/:id" element={<MangaDetail />} />
                    <Route path="/reader/:chapterId" element={<Reader />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/history" element={<History />} />
                  </Routes>
                </AnimatePresence>
              </main>
              <BottomNav />
            </div>
          </Router>
        </HistoryProvider>
      </FavoritesProvider>
    </SettingsProvider>
  )
}

export default App
