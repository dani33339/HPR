import { useAuth0 } from '@auth0/auth0-react';

const Logout = () => {
    const {logout, isAuthenticated} = useAuth0();

  return (
    <>
      {isAuthenticated && ( 
          <li onClick = {() => logout()}>
            Sing Out
          </li>

        )}
    </>
  )
}

export default Logout
