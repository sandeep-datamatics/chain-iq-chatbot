import { Navigate } from 'react-router-dom'

function PrivateRoute ({ children }) {
  const auth = localStorage.getItem('accessToken')
  return auth || true ? children : <Navigate to="/" />
}

export default PrivateRoute
