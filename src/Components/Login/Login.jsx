import { useAuth0 } from '@auth0/auth0-react';



const Login = () => {
    const {loginWithRedirect, isAuthenticated} = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
          <button className="singInBtn btn" onClick = {() => loginWithRedirect()}>
            Sing in / up
          </button>
        )}
    </div>
  )
}

export default Login
