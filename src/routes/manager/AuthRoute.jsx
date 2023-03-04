import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'

function AuthRoute() {
  const { user } = useUser()
  return user ? <Outlet /> : <Navigate to='/login' />
}

export default AuthRoute
