import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import { useEffect } from "react";
import { useUserStore } from "./store/useUserStore";
import { supabase } from "./services/supabase/supabaseClient";
import axiosInstance from "./services/axios/axiosInstance";

const InitUser = () => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) return;

      const userId = authData.user.id;
      const { data: userRes } = await axiosInstance.get("/user", {
        params: {
          id: `eq.${userId}`,
          select: "*",
        },
      });

      setUser(userRes?.[0] || null);
    };

    fetchAndSetUser();
  }, []);

  return null;
};

function App() {
  return (
    <>
      <InitUser />
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
