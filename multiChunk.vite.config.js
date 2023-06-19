import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import url from "url";
import fs from "fs";
import path from "path";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const pagesDir = path.resolve(__dirname, "src/pages");

const getAllFilesRecursively = (dirPath, fileList = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      getAllFilesRecursively(filePath, fileList); // Recursively call the function for subdirectories
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
};
getAllFilesRecursively(pagesDir).filter((file) => file.endsWith(".tsx"));

const entries = getAllFilesRecursively(pagesDir).reduce((acc, file, i) => {
  const name = `chunk-${i}`;
  acc[name] = file;
  return acc;
}, {});

entries["index.html"] = "index.html";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: entries,
    },
  },
  resolve: {
    alias: [
      {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: "$1",
      },
    ],
  },
  plugins: [react()],
});
