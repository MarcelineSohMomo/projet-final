import { useNavigate } from 'react-router-dom';

const Logout = () => {

  const navigate = useNavigate();
      
  const handleLogout = ()=>{
    localStorage.clear();
    return navigate('/signin');
  }

  return (
    // ...le code de votre composant
    <button onClick={handleLogout}>Déconnexion</button>
  );
};

export default Logout;