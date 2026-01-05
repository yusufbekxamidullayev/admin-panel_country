import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CountriesPage from './pages/countries/CountriesPage'
import CitiesPage from './pages/cities/CitiesPage'
import ToursPage from './pages/tours/ToursPage'
import HotelsPage from './pages/hotels/HotelsPage'
import DestinationPage from './pages/destinations/DestinationsPage'
import LayoutAdmin from './components/layout/Layout'
import LoginPage from './pages/login/Login'
import { ToastContainer } from 'react-toastify'

const App = () => {
  const token = localStorage.getItem("token")
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route element={token ? <LayoutAdmin /> : <Navigate to={"/"} />}>
          <Route path='countries' element={<CountriesPage />} />
          <Route path='cities' element={<CitiesPage />} />
          <Route path='tours' element={<ToursPage/>} />
          <Route path='hotels' element={<HotelsPage/>} />
          <Route path='destinations' element={<DestinationPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App