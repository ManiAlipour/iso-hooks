# 📦 Iso Hooks

A collection of lightweight, type-safe, and SSR-compatible React hooks. Designed for modern React applications (Next.js, Remix, Vite).

![npm version](https://img.shields.io/npm/v/iso-hooks?style=flat-square&color=blue)
![License](https://img.shields.io/npm/l/iso-hooks?style=flat-square)
![Downloads](https://img.shields.io/npm/dt/iso-hooks?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)

## ✨ Features

- 🛡️ **SSR Safe:** Built with server-side rendering in mind (won't break Next.js builds).
- 🔷 **TypeScript:** Written in TypeScript with full type definitions included.
- 🌲 **Tree Shakeable:** Import only the hooks you need.
- 🪶 **Lightweight:** Zero dependencies.

## 🚀 Installation

```bash
npm install iso-hooks
# or
yarn add iso-hooks
# or
pnpm add iso-hooks

## 📚 Documentation

### 1. `useLocalStorage`

Persist state in `localStorage` with SSR safety. It automatically syncs state across different tabs and windows.

tsx
import { useLocalStorage } from "iso-hooks";

const App = () => {
  // Usage: useLocalStorage(key, initialValue)
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
<button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
Current theme: {theme}
</button>
  );
};

---

### 2. `useOnClickOutside`

Detect clicks outside of a specified element. Perfect for closing modals, dropdowns, or menus.

tsx
import { useRef, useState } from "react";
import { useOnClickOutside } from "iso-hooks";

const Modal = () => {
  const [isOpen, setOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Close the modal when clicking outside of the referenced element
  useOnClickOutside(ref, () => setOpen(false));

  if (!isOpen) return null;

  return (
<div className="overlay">
<div ref={ref} className="modal-content">
Click outside to close me!
</div>
</div>
  );
};

---

### 3. `useWindowSize`

Get the current window dimensions. Returns `undefined` during SSR to prevent hydration mismatches.

tsx
import { useWindowSize } from "iso-hooks";

const MyComponent = () => {
  const { width, height } = useWindowSize();

  // Handle loading state until the hook runs on the client
  if (!width) return <div>Loading...</div>;

  return (
<div>
Window size: {width} x {height}
</div>
  );
};

---

### 4. `useDebounce`

Delay the execution of a value change. Useful for search inputs to prevent excessive API calls.

tsx
import { useState, useEffect } from "react";
import { useDebounce } from "iso-hooks";

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // The debounced term will only update 500ms after the user stops typing
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
if (debouncedSearchTerm) {
console.log("Searching for:", debouncedSearchTerm);
}
  }, [debouncedSearchTerm]);

  return (
<input
onChange={(e) => setSearchTerm(e.target.value)}
placeholder="Search..."
/>
  );
};

---

### 5. `useInterval`

A declarative version of `setInterval` that handles React lifecycle and closure issues correctly.

tsx
import { useState } from "react";
import { useInterval } from "iso-hooks";

const Timer = () => {
  const [count, setCount] = useState(0);
  const [isPlaying, setPlaying] = useState(true);

  // Increment count every 1000ms. Pass null to pause.
  useInterval(
() => {
setCount(count + 1);
},
isPlaying ? 1000 : null
  );

  return (
<div>
<h1>{count}</h1>
<button onClick={() => setPlaying(!isPlaying)}>
{isPlaying ? "Pause" : "Resume"}
</button>
</div>
  );
};

---

### 6. `useScrollLock`

Prevent the body from scrolling. Useful when opening modals or drawers to prevent background scrolling.

tsx
import { useScrollLock } from "iso-hooks";

const Modal = () => {
  const { lock, unlock } = useScrollLock();

  return (
<div>
<button onClick={lock}>Lock Scroll</button>
<button onClick={unlock}>Unlock Scroll</button>
</div>
  );
};

---

### 7. `useCopyToClipboard`

Copy text to the clipboard securely.

tsx
import { useCopyToClipboard } from "iso-hooks";

const CopyButton = () => {
  const [copiedText, copy] = useCopyToClipboard();

  return (
<button onClick={() => copy("Hello World!")}>
{copiedText ? "Copied!" : "Copy Text"}
</button>
  );
};

---

### 8. `useMediaQuery`

Subscribe to CSS media queries programmatically. SSR safe (returns `false` initially on server).

tsx
import { useMediaQuery } from "iso-hooks";

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
<div>
{isMobile ? <p>Mobile Layout</p> : <p>Desktop Layout</p>}
</div>
  );
};

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [ManiAlipour](https://github.com/ManiAlipour)
```
