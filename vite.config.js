import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          // ✅ 複製 web-ifc 套件中所有的 .wasm 檔案
          src: "node_modules/web-ifc/*.wasm",
          dest: "ifc-wasm", // ➜ 複製到 /dist/ifc-wasm/
        },
        {
          // ✅ 複製 web-ifc 的 worker 檔案
          src: "node_modules/web-ifc/web-ifc-mt.worker.js",
          dest: "ifc-wasm",
        },
      ],
    }),
  ],
  server: {
    headers: {
      // ✅ 加上 WebAssembly 正常執行需要的 HTTP headers
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
