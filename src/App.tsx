import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // 스타일 import

function App() {
  const queryClient = new QueryClient(); // QueryClient 인스턴스 생성

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastContainer
          style={{
            top: 0,
            width: "100%",
            maxWidth: "420px",
            padding: "16px",
          }}
        />
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
