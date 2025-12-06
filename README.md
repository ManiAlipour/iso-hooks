# 📦 Iso Hooks

A modern, lightweight, and fully SSR-safe collection of handy React hooks — **type-safe, dependency-free, and designed for today’s frameworks** like Next.js, Remix, and Vite.

<p align="center">
  <img src="https://img.shields.io/npm/v/iso-hooks?style=flat-square&color=blue" alt="npm version" />
  <img src="https://img.shields.io/npm/l/iso-hooks?style=flat-square" alt="License" />
  <img src="https://img.shields.io/npm/dt/iso-hooks?style=flat-square" alt="Downloads" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
</p>

---

## ✨ Features

- 🛡️ **SSR-Safe:** Guaranteed to not break server-side rendering.
- 🔷 **TypeScript First:** Full type safety and dedicated types included.
- 🌲 **Tree-shakeable:** Import only what you need.
- 🪶 **No Dependencies:** Enjoy a truly lightweight bundle.

---

## 🚀 Installation

```bash
npm install iso-hooks
# or
yarn add iso-hooks
# or
pnpm add iso-hooks
```

---

## 📚 Documentation

Iso Hooks covers the essentials for modern React development, in a simple and easy-to-use API.

---

### 1️⃣ `useLocalStorage`

Persist values in `localStorage` (SSR-safe), automatically syncing changes between tabs.

```tsx
import { useLocalStorage } from "iso-hooks";

const App = () => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current theme: {theme}
    </button>
  );
};
```

---

### 2️⃣ `useOnClickOutside`

Detect clicks outside of any element — perfect for closing popups, modals, or menus.

```tsx
import { useRef, useState } from "react";
import { useOnClickOutside } from "iso-hooks";

const Modal = () => {
  const [isOpen, setOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

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
```

---

### 3️⃣ `useWindowSize`

Access live window size — automatically SSR-safe, preventing hydration errors.

```tsx
import { useWindowSize } from "iso-hooks";

const MyComponent = () => {
  const { width, height } = useWindowSize();

  if (!width) return <div>Loading...</div>;

  return (
    <div>
      Window size: {width} x {height}
    </div>
  );
};
```

---

### 4️⃣ `useDebounce`

Debounce a value or function, great for search boxes and rapid input.

```tsx
import { useState, useEffect } from "react";
import { useDebounce } from "iso-hooks";

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
```

---

### 5️⃣ `useInterval`

A declarative, React-safe interval that never suffers from stale closure bugs.

```tsx
import { useState } from "react";
import { useInterval } from "iso-hooks";

const Timer = () => {
  const [count, setCount] = useState(0);
  const [isPlaying, setPlaying] = useState(true);

  useInterval(
    () => setCount(c => c + 1),
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
```

---

### 6️⃣ `useScrollLock`

Prevent the body scroll — perfect for modals, mobile menus, or drawers.

```tsx
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
```

---

### 7️⃣ `useCopyToClipboard`

Copy any text to the clipboard with ease.

```tsx
import { useCopyToClipboard } from "iso-hooks";

const CopyButton = () => {
  const [copiedText, copy] = useCopyToClipboard();

  return (
    <button onClick={() => copy("Hello World!")}>
      {copiedText ? "Copied!" : "Copy Text"}
    </button>
  );
};
```

---

### 8️⃣ `useMediaQuery`

React to CSS media queries in JS (SSR returns `false` until client hydration).

```tsx
import { useMediaQuery } from "iso-hooks";

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      {isMobile ? <p>Mobile Layout</p> : <p>Desktop Layout</p>}
    </div>
  );
};
```

---

### 9️⃣ `useEventListener`

Attach event listeners to any element or the window, safely and declaratively.

```tsx
import { useEventListener } from "iso-hooks";

const LogKeydown = () => {
  useEventListener("keydown", (e: KeyboardEvent) => {
    console.log("Key pressed:", e.key);
  });

  return <div>Press any key and check the console.</div>;
};
```

---

### 🔟 `useHover`

Detect when an element is hovered.

```tsx
import { useRef } from "react";
import { useHover } from "iso-hooks";

const HoverComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useHover(ref);

  return (
    <div ref={ref}>
      {isHovered ? "You're hovering me!" : "Hover over me"}
    </div>
  );
};
```

---

### 1️⃣1️⃣ `useTimeout`

Set timeouts in React, safely clearing when needed.

```tsx
import { useState } from "react";
import { useTimeout } from "iso-hooks";

const TimeoutDemo = () => {
  const [message, setMessage] = useState("Waiting...");
  useTimeout(() => setMessage("Timeout finished!"), 2000);

  return <div>{message}</div>;
};
```

---

### 1️⃣2️⃣ `useIntersectionObserver`

Observe when elements enter the viewport.

```tsx
import { useRef } from "react";
import { useIntersectionObserver } from "iso-hooks";

const LazyComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref);

  return (
    <div ref={ref}>
      {entry?.isIntersecting ? "Visible in viewport" : "Scroll to reveal me!"}
    </div>
  );
};
```

---

## 🤝 Contributing

All contributions, issues, and suggestions are welcome! Please open a Pull Request or Issue.

---

## 📄 License

MIT © [ManiAlipour](https://github.com/ManiAlipour)

---

<p align="center"><i>Built with ♥ for the React community.</i></p>
