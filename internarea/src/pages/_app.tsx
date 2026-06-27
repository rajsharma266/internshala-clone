import Footer from "@/Components/Fotter";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { store } from "../store/store";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { login, logout } from "@/Feature/Userslice";
import { getStoredAdmin } from "@/lib/adminSession";
import { getStoredUser, saveStoredUser, toAppUser } from "@/lib/userSession";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const adminOnlyRoutes = [
    "/adminpanel",
    "/postJob",
    "/postInternship",
    "/applications",
    "/manageJobs",
    "/manageInternships",
  ];

  function AuthListener() {
    const dispatch = useDispatch();
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authuser) => {
        if (authuser) {
          const user = {
            uid: authuser.uid,
            photo: authuser.photoURL || "",
            name: authuser.displayName || "",
            email: authuser.email || "",
            phoneNumber: authuser.phoneNumber || "",
          };

          saveStoredUser(user);
          dispatch(
            login(user)
          );
        } else {
          const storedUser = getStoredUser();

          if (storedUser) {
            dispatch(login(toAppUser(storedUser)));
          } else {
            dispatch(logout());
          }
        }
      });

      return () => unsubscribe();
    }, [dispatch]);
    return null;
  }

  const isStandaloneAdminLogin = router.pathname === "/adminlogin";

  useEffect(() => {
    const isAdminRoute =
      adminOnlyRoutes.includes(router.pathname) ||
      router.pathname.startsWith("/detailapplication/");

    if (!isAdminRoute) {
      return;
    }

    const admin = getStoredAdmin();

    if (!admin) {
      router.replace("/adminlogin");
    }
  }, [router, router.pathname]);

  return (
    <Provider store={store}>
      <AuthListener />
      <div className="bg-white">
        <ToastContainer/>
        {!isStandaloneAdminLogin && <Navbar />}
        <Component {...pageProps} />
        {!isStandaloneAdminLogin && <Footer />}
      </div>
    </Provider>
  );
}
