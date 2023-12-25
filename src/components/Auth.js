import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../Firebase-config";

export const Auth = () => {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="auth">
      <p>
        Sign In with Google To Continue
      </p>
      <button onClick={signInWithGoogle}>
        Sign In With Google
      </button>
    </div>
  )
};
