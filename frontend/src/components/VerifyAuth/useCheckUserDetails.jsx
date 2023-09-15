import { useEffect, useState } from 'react';

const useCheckUserDetails = () => {
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("isconnected")) {
      setServerMessage({
        message: "Veuillez remplir vos informations de profil",
        type: 'error',
      });
      setTimeout(() => {
        setShouldNavigate(true);
      }, 3000);
    }
  }, []);

  return { shouldNavigate, serverMessage };
};

export default useCheckUserDetails;
