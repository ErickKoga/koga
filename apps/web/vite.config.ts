import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../../", "VITE_");
  const port = parseInt(env.VITE_PORT, 10);

  return {
    envDir: "../../",
    server: {
      port: port,
    },
    plugins: [react(), tailwindcss()],
  };
});
