// vite.config.ts
import path from "path";
import { defineConfig } from "file:///E:/Workspace/Web/lowflow-design-main/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/Workspace/Web/lowflow-design-main/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/Workspace/Web/lowflow-design-main/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Components from "file:///E:/Workspace/Web/lowflow-design-main/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///E:/Workspace/Web/lowflow-design-main/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import VueSetupExtend from "file:///E:/Workspace/Web/lowflow-design-main/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import Unocss from "file:///E:/Workspace/Web/lowflow-design-main/node_modules/unocss/dist/vite.mjs";
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from "file:///E:/Workspace/Web/lowflow-design-main/node_modules/unocss/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\Workspace\\Web\\lowflow-design-main";
var pathSrc = path.resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  // base: '/lowflow-design',
  resolve: {
    alias: {
      "~/": `${pathSrc}/`,
      "@antv/x6": "@antv/x6/lib",
      "@antv/x6-vue-shape": "@antv/x6-vue-shape/lib"
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`
      }
    }
  },
  ssr: {
    noExternal: ["element-plus"]
  },
  server: {
    hmr: true,
    open: "/#/",
    port: 3200,
    proxy: {
      "/api": {
        target: "http://172.30.3.6:18700",
        changeOrigin: true
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    VueSetupExtend(),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["ts"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.[tj]sx?$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass"
        })
      ],
      dts: "src/components.d.ts"
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          warn: true
        })
      ],
      rules: [
        [
          "flex-center",
          {
            display: "flex",
            "align-items": "center",
            "justify-content": "center"
          }
        ],
        [
          "primaryStyle",
          { background: "linear-gradient(to top, #598ff1, #205ccb)" }
        ],
        ["contentPrimary", { color: "#333" }]
      ],
      transformers: [transformerDirectives(), transformerVariantGroup()]
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // 打包分类
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        // 分包策略
        manualChunks(id) {
          var _a;
          if (id.includes("node_modules")) {
            return (_a = id.split("/node_modules/").pop()) == null ? void 0 : _a.split("/")[0];
          }
        },
        // 打包后的文件夹名称生成规则-->解决部分静态服务器无法正常返回_plugin-vue_export-helper文件
        sanitizeFileName(name) {
          const match = /^[a-z]:/i.exec(name);
          const driveLetter = match ? match[0] : "";
          return driveLetter + name.substring(driveLetter.length).replace(/[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g, "");
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxXb3Jrc3BhY2VcXFxcV2ViXFxcXGxvd2Zsb3ctZGVzaWduLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFdvcmtzcGFjZVxcXFxXZWJcXFxcbG93Zmxvdy1kZXNpZ24tbWFpblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovV29ya3NwYWNlL1dlYi9sb3dmbG93LWRlc2lnbi1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuaW1wb3J0IFZ1ZVNldHVwRXh0ZW5kIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQnXHJcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tIFwidml0ZS1wbHVnaW4tbW9ja1wiXHJcblxyXG5pbXBvcnQgVW5vY3NzIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQge1xyXG4gICAgcHJlc2V0QXR0cmlidXRpZnksXHJcbiAgICBwcmVzZXRJY29ucyxcclxuICAgIHByZXNldFVubyxcclxuICAgIHRyYW5zZm9ybWVyRGlyZWN0aXZlcyxcclxuICAgIHRyYW5zZm9ybWVyVmFyaWFudEdyb3VwLFxyXG59IGZyb20gJ3Vub2NzcydcclxuXHJcbmNvbnN0IHBhdGhTcmMgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgLy8gYmFzZTogJy9sb3dmbG93LWRlc2lnbicsXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJ+L1wiOiBgJHtwYXRoU3JjfS9gLFxyXG4gICAgICBcIkBhbnR2L3g2XCI6IFwiQGFudHYveDYvbGliXCIsXHJcbiAgICAgIFwiQGFudHYveDYtdnVlLXNoYXBlXCI6IFwiQGFudHYveDYtdnVlLXNoYXBlL2xpYlwiLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNzczoge1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAdXNlIFwifi9zdHlsZXMvZWxlbWVudC9pbmRleC5zY3NzXCIgYXMgKjtgLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNzcjoge1xyXG4gICAgbm9FeHRlcm5hbDogW1wiZWxlbWVudC1wbHVzXCJdLFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBobXI6IHRydWUsXHJcbiAgICBvcGVuOiBcIi8jL1wiLFxyXG4gICAgcG9ydDogMzIwMCxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xNzIuMzAuMy42OjE4NzAwXCIsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgICBWdWVTZXR1cEV4dGVuZCgpLFxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIC8vIGFsbG93IGF1dG8gbG9hZCBtYXJrZG93biBjb21wb25lbnRzIHVuZGVyIGAuL3NyYy9jb21wb25lbnRzL2BcclxuICAgICAgZXh0ZW5zaW9uczogW1widHNcIl0sXHJcbiAgICAgIC8vIGFsbG93IGF1dG8gaW1wb3J0IGFuZCByZWdpc3RlciBjb21wb25lbnRzIHVzZWQgaW4gbWFya2Rvd25cclxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvLCAvXFwuW3RqXXN4PyQvXSxcclxuICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7XHJcbiAgICAgICAgICBpbXBvcnRTdHlsZTogXCJzYXNzXCIsXHJcbiAgICAgICAgfSksXHJcbiAgICAgIF0sXHJcbiAgICAgIGR0czogXCJzcmMvY29tcG9uZW50cy5kLnRzXCIsXHJcbiAgICB9KSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bm9jc3NcclxuICAgIC8vIHNlZSB1bm9jc3MuY29uZmlnLnRzIGZvciBjb25maWdcclxuICAgIFVub2Nzcyh7XHJcbiAgICAgIHByZXNldHM6IFtcclxuICAgICAgICBwcmVzZXRVbm8oKSxcclxuICAgICAgICBwcmVzZXRBdHRyaWJ1dGlmeSgpLFxyXG4gICAgICAgIHByZXNldEljb25zKHtcclxuICAgICAgICAgIHNjYWxlOiAxLjIsXHJcbiAgICAgICAgICB3YXJuOiB0cnVlLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICBdLFxyXG4gICAgICBydWxlczogW1xyXG4gICAgICAgIFtcclxuICAgICAgICAgIFwiZmxleC1jZW50ZXJcIixcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgIFwiYWxpZ24taXRlbXNcIjogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgXCJqdXN0aWZ5LWNvbnRlbnRcIjogXCJjZW50ZXJcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICBcInByaW1hcnlTdHlsZVwiLFxyXG4gICAgICAgICAgeyBiYWNrZ3JvdW5kOiBcImxpbmVhci1ncmFkaWVudCh0byB0b3AsICM1OThmZjEsICMyMDVjY2IpXCIgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcImNvbnRlbnRQcmltYXJ5XCIsIHsgY29sb3I6IFwiIzMzM1wiIH1dLFxyXG4gICAgICBdLFxyXG4gICAgICB0cmFuc2Zvcm1lcnM6IFt0cmFuc2Zvcm1lckRpcmVjdGl2ZXMoKSwgdHJhbnNmb3JtZXJWYXJpYW50R3JvdXAoKV0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIC8vIFx1NjI1M1x1NTMwNVx1NTIwNlx1N0M3QlxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiBcImFzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzXCIsXHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwiYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanNcIixcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogXCJhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XVwiLFxyXG4gICAgICAgIC8vIFx1NTIwNlx1NTMwNVx1N0I1Nlx1NzU2NVxyXG4gICAgICAgIG1hbnVhbENodW5rcyhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkLnNwbGl0KFwiL25vZGVfbW9kdWxlcy9cIikucG9wKCk/LnNwbGl0KFwiL1wiKVswXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFx1NjI1M1x1NTMwNVx1NTQwRVx1NzY4NFx1NjU4N1x1NEVGNlx1NTkzOVx1NTQwRFx1NzlGMFx1NzUxRlx1NjIxMFx1ODlDNFx1NTIxOS0tPlx1ODlFM1x1NTFCM1x1OTBFOFx1NTIwNlx1OTc1OVx1NjAwMVx1NjcwRFx1NTJBMVx1NTY2OFx1NjVFMFx1NkNENVx1NkI2M1x1NUUzOFx1OEZENFx1NTZERV9wbHVnaW4tdnVlX2V4cG9ydC1oZWxwZXJcdTY1ODdcdTRFRjZcclxuICAgICAgICBzYW5pdGl6ZUZpbGVOYW1lKG5hbWUpIHtcclxuICAgICAgICAgIGNvbnN0IG1hdGNoID0gL15bYS16XTovaS5leGVjKG5hbWUpO1xyXG4gICAgICAgICAgY29uc3QgZHJpdmVMZXR0ZXIgPSBtYXRjaCA/IG1hdGNoWzBdIDogXCJcIjtcclxuICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGRyaXZlTGV0dGVyICtcclxuICAgICAgICAgICAgbmFtZVxyXG4gICAgICAgICAgICAgIC5zdWJzdHJpbmcoZHJpdmVMZXR0ZXIubGVuZ3RoKVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx4MDAtXFx4MUZcXHg3Rjw+KiNcInt9fF5bXFxdYDs/OiY9KyQsXS9nLCBcIlwiKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUyxPQUFPLFVBQVU7QUFDdlQsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLG9CQUFvQjtBQUczQixPQUFPLFlBQVk7QUFDbkI7QUFBQSxFQUNJO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLE9BQ0c7QUFoQlAsSUFBTSxtQ0FBbUM7QUFrQnpDLElBQU0sVUFBVSxLQUFLLFFBQVEsa0NBQVcsS0FBSztB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
