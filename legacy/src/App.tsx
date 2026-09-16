import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Destinations from '@/pages/Destinations'
import DestinationDetail from '@/pages/DestinationDetail'
import About from '@/pages/About'

const ItineraryBuilder = lazy(() => import('@/pages/ItineraryBuilder'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/itinerary"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-[50vh] items-center justify-center text-sm text-guru-muted">
                    Loading itinerary builder&hellip;
                  </div>
                }
              >
                <ItineraryBuilder />
              </Suspense>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  )
}

export default App
