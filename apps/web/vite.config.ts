import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../../", "VITE_");
  const port = parseInt(env.VITE_PORT, 10);

  return {
    envDir: "../../",
    server: {
      port: port,
    },
    plugins: [react()],
  };
});
