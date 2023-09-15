import AuthGuard from "../../components/VerifyAuth/AuthGuard";
import User from "./User";

function BeforeUserPage() {
  return (
    <AuthGuard>
      <User />
    </AuthGuard>
  );
}

export default BeforeUserPage;
