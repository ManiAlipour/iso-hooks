# 🚀 iso-hooks

> A collection of modern, **SSR-safe**, and lightweight React hooks.
> Built for real-world applications with Next.js, Remix, and React 18+.

![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat-square)
![NPM Version](https://img.shields.io/npm/v/iso-hooks?style=flat-square)

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
  - [useLocalStorage](#1-uselocalstorage)
  - [useOnClickOutside](#2-useonclickoutside)
  - [useMediaQuery](#3-usemediaquery)
  - [useCopyToClipboard](#4-usecopytoclipboard)
  - [useWindowSize](#5-usewindowsize)
  - [useDebounce](#6-usedebounce)
  - [useInterval](#7-useinterval)
  - [useScrollLock](#8-usescrolllock)
- [Development](#-development)
- [License](#-license)

## ✨ Features

- **SSR Safe:** No more `Hydration Mismatch` errors. Hooks are designed to work seamlessly with Server-Side Rendering (Next.js/Remix).
- **Type-Safe:** Written in TypeScript with full type definitions included.
- **Lightweight:** Tree-shakable exports ensuring a minimal bundle size.
- **Modern:** Uses `useSyncExternalStore` for concurrent React compatibility.
- **Real-time Sync:** `useLocalStorage` automatically syncs state across browser tabs.

## 📦 Installation

```bash
npm install iso-hooks
# or
yarn add iso-hooks
# or
pnpm add iso-hooks

## 🛠 Usage

### 1. `useLocalStorage`

Persist state in `localStorage` with SSR safety. It also syncs state across different tabs automatically!

tsx
import { useLocalStorage } from "iso-hooks";

const App = () => {
  // Similar to useState, but persists in localStorage
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
<button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
Current theme: {theme}
</button>
  );
};

### 2. `useOnClickOutside`

Detect clicks outside of a specified element. Perfect for closing modals, dropdowns, or menus.

tsx
import { useRef, useState } from "react";
import { useOnClickOutside } from "iso-hooks";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of the referenced element
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
<div ref={ref} className="relative">
<button onClick={() => setIsOpen(!isOpen)}>Toggle Menu</button>
{isOpen && (
<ul className="absolute top-full">
<li>Item 1</li>
<li>Item 2</li>
</ul>
)}
</div>
  );
};

### 3. `useMediaQuery`

Subscribe to media queries specifically designed for SSR environments. It avoids hydration mismatches by returning `false` initially on the server.

tsx
import { useMediaQuery } from "iso-hooks";

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  if (isMobile) return <div>Mobile View</div>;

  return <div>Desktop View {isDarkMode && "(Dark Mode)"}</div>;
};

### 4. `useCopyToClipboard`

Copy text to the clipboard securely. It handles the asynchronous nature of the Clipboard API and resets the copied state automatically after a delay (default 2000ms).

tsx
import { useCopyToClipboard } from "iso-hooks";

const CopyButton = ({ text }: { text: string }) => {
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = async () => {
const success = await copy(text);
if (success) {
console.log("Copied successfully!");
}
  };

  return (
<button onClick={handleCopy}>
{copiedText ? "Copied!" : "Copy to Clipboard"}
</button>
  );
};

### 5. `useWindowSize`

Tracks the browser window dimensions. Returns `undefined` for width/height during SSR to prevent hydration errors.

tsx
import { useWindowSize } from "iso-hooks";

const MyComponent = () => {
  const { width, height } = useWindowSize();

  // Handle loading state or SSR
  if (!width || !height) return <div>Loading...</div>;

  return (
<div>
Window size: {width} x {height}
</div>
  );
};

### 6. `useDebounce`

Defer the update of a value until a specified delay has passed. Essential for search inputs to avoid excessive API calls.

tsx
import { useState, useEffect } from "react";
import { useDebounce } from "iso-hooks";

const Search = () => {
  const [text, setText] = useState("");
  // The value will only update 500ms after the user stops typing
  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
if (debouncedText) {
console.log("Fetching API for:", debouncedText);
// perform API call here
}
  }, [debouncedText]);

  return <input onChange={(e) => setText(e.target.value)} placeholder="Search..." />;
};

### 7. `useInterval`

A custom hook that sets up an interval that can access the latest state/props without resetting the timer on every render.

tsx
import { useInterval } from "iso-hooks";

const Counter = () => {
  const [count, setCount] = useState(0);

  // Increment count every second
  useInterval(() => {
    setCount(count + 1);
  }, 1000);

  return <div>Count: {count}</div>;
};

### 8. `useScrollLock`

A hook to lock the body scroll. Useful for modals, drawers, etc. It automatically unlocks when the component unmounts.

tsx
import { useScrollLock } from "iso-hooks";

const Modal = ({ isOpen }: { isOpen: boolean }) => {
  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    if (isOpen) {
      lock();
    } else {
      unlock();
    }
  }, [isOpen, lock, unlock]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <p>Modal content</p>
    </div>
  );
};

## 🧪 Development

If you want to contribute or run the tests locally:

bash
# Install dependencies
npm install

# Run tests
npm run test

# Build the package
npm run build

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT © Mani Alipour
```
