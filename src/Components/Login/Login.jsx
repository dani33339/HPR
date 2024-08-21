import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const handleLogin = () => {
    // ניקוי ההיסטוריה של החיפושים עבור משתמשי אורח שנרשמים
    if (localStorage.getItem('guest_searches')) {
      localStorage.removeItem('guest_searches');
    }

    // הפניה לדף ההתחברות
    loginWithRedirect();
  };

  return (
    <div>
      {!isAuthenticated && (
        <button className="signInBtn btn" onClick={handleLogin}>
          Sign in / up
        </button>
      )}
    </div>
  );
};

export default Login;
