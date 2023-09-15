import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BigUserProfilCard from "./components/profil/BigUserProfilCard";
import BigServiceDetailCard from "./components/service/BigServiceDetailCard";
import ServiceDetails from "./components/service/ServiceDetails";
import { Accueil, BuildService, Dashboard, Home, Signin, Signup, SignUpArtisan, User } from "./pages";
import Services from "./pages/Dashboard/Services";
import Statistics from "./pages/Dashboard/Statistics";
import Inbox from "./pages/Inbox/Inbox";
import Profile from "./pages/User/ProfileWithoutnavbar";

function App() {
  // const auth = useSelector(state => state.auth);
  // console.log(auth)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-artisan" element={<SignUpArtisan />} />
        <Route path="/home" element={<Home />} />
        <Route path="/service" element={<BuildService />} />
        <Route path="/profile" element={<User />} />
        <Route path="/dashboard/*" element={<Dashboard/>} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/inbox/:id" element={<Inbox/>} />
        {/* <Route path="/services/:id" element={<ServiceDetails  />} /> */}
        <Route path="/services/:id" element={<BigServiceDetailCard  width={"200px"} height={"200px"}/>} />
        <Route path="/viewuser/:id" element={<BigUserProfilCard width={"200px"} height={"200px"}/>} />

      </Routes>
        {/* <Route path='*' element={<Notfound />} /> */}
    </BrowserRouter>
  );
}

export default App;
