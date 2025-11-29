# 🚀 iso-hooks

> A collection of modern, **SSR-safe**, and lightweight React hooks.
> Built for real-world applications with Next.js, Remix, and React 18+.

![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat-square)

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **SSR Safe:** No more `Hydration Mismatch` errors. Hooks like `useLocalStorage` and `useMediaQuery` are designed to work seamlessly with Server-Side Rendering.
- **Type-Safe:** Written in TypeScript with full type definitions included.
- **Lightweight:** Tree-shakable exports ensuring a minimal bundle size.
- **Modern:** Uses `useSyncExternalStore` for concurrent React compatibility.
- **Tested:** Fully tested with Vitest.

## 📦 Installation

```bash
npm install iso-hooks
# or
yarn add iso-hooks
# or
pnpm add iso-hooks
```

## 🛠 Usage

### 1. `useLocalStorage`

Persist state in `localStorage` with SSR safety. It also syncs state across different tabs automatically!

```tsx
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
```

### 2. `useOnClickOutside`

Detect clicks outside of a specified element. Perfect for closing modals, dropdowns, or menus.

```tsx
import { useRef, useState } from "react";
import { useOnClickOutside } from "iso-hooks";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of the referenced element
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Menu</button>
      {isOpen && (
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      )}
    </div>
  );
};
```

### 3. `useDebounce`

Defer the update of a value until a specified delay has passed. Essential for search inputs to avoid excessive API calls.

```tsx
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

  return <input onChange={(e) => setText(e.target.value)} />;
};
```

### 4. `useMediaQuery`

Subscribe to media queries specifically designed for SSR environments.

```tsx
import { useMediaQuery } from "iso-hooks";

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  if (isMobile) return <div>Mobile View</div>;

  return <div>Desktop View {isDarkMode && "(Dark Mode)"}</div>;
};
```

## 🧪 Development

If you want to contribute or run the tests locally:

```bash
# Install dependencies
npm install

# Run tests
npm run test
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT © Mani Alipour

```

```
