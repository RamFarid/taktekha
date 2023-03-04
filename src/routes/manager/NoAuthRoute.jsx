import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'

function NoAuthRoute() {
  const { user } = useUser()
  return user ? <Navigate to='/' /> : <Outlet />
}

export default NoAuthRoute
