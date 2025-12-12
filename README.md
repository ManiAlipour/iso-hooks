# 📦 Iso Hooks

A modern, lightweight, and fully SSR-safe collection of handy React hooks — **type-safe, dependency-free, and made for today's frameworks** like Next.js, Remix, and Vite.

<p align="center">
  <img src="https://img.shields.io/npm/v/iso-hooks?style=flat-square&color=blue" alt="npm version" />
  <img src="https://img.shields.io/npm/l/iso-hooks?style=flat-square" alt="License" />
  <img src="https://img.shields.io/npm/dt/iso-hooks?style=flat-square" alt="Downloads" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
</p>

---

## ✨ Features

- 🛡️ **SSR-Safe:** Works seamlessly with server-side rendering.
- 🔷 **TypeScript First:** Strong types and dedicated definitions included.
- 🌲 **Tree-shakeable:** Import only what you need.
- 🪶 **No Dependencies:** Truly lightweight bundle.

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

Iso Hooks provides all the essentials for modern React development with a simple and secure API.

---

### 1️⃣ `useLocalStorage`

Persist and retrieve values from localStorage in an SSR-friendly way, automatically syncing across tabs.

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

Detect clicks outside any element — great for closing popups, modals, or menus.

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

Access live window size — SSR-safe, preventing hydration errors.

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

Debounce values or functions — ideal for search boxes or rapid input.

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

A declarative, React-safe interval hook — no more stale closure bugs.

```tsx
import { useState } from "react";
import { useInterval } from "iso-hooks";

const Timer = () => {
  const [count, setCount] = useState(0);
  const [isPlaying, setPlaying] = useState(true);

  useInterval(() => setCount((c) => c + 1), isPlaying ? 1000 : null);

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

Lock the body scroll — perfect for modals, mobile menus, or drawers.

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

Copy any text to the user's clipboard easily.

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

  return <div>{isMobile ? <p>Mobile Layout</p> : <p>Desktop Layout</p>}</div>;
};
```

---

### 9️⃣ `useEventListener`

Add event listeners safely and declaratively to any element or the window.

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
import { useHover } from "iso-hooks";

const HoverComponent = () => {
  const [ref, isHovered] = useHover<HTMLDivElement>();

  return (
    <div ref={ref}>{isHovered ? "You're hovering me!" : "Hover over me"}</div>
  );
};
```

---

### 11️⃣ `useTimeout`

Set timeouts in React, safely cleared on unmount or updates.

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

### 12️⃣ `useIntersectionObserver`

React to elements entering or leaving the viewport.

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

### 13️⃣ `useMeasure`

Measure the size and position of a DOM element, SSR-safe.

```tsx
import { useRef } from "react";
import { useMeasure } from "iso-hooks";

const BoxMeasurement = () => {
  const ref = useRef<HTMLDivElement>(null);
  const bounds = useMeasure(ref);

  return (
    <div>
      <div
        ref={ref}
        style={{ width: 200, height: 150, background: "#eee", margin: 16 }}
      >
        Resize me!
      </div>
      <pre>{JSON.stringify(bounds, null, 2)}</pre>
    </div>
  );
};
```

---

### 14️⃣ `useFetch`

Easy HTTP requests, with auto-cancellation, reactivity, and loading/error state.

```tsx
import { useFetch } from "iso-hooks";

const MyApiData = () => {
  // Pass [] as initial data so 'data' is never null!
  const { data, loading, error, refetch } = useFetch<Todo[]>(
    "https://jsonplaceholder.typicode.com/todos",
    { initialData: [] }
  );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {loading && <p>Refreshing...</p>}
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <button onClick={refetch}>Refetch</button>
    </div>
  );
};
```

---

### 15️⃣ `useThrottleCallback`

Throttle a callback — fires at the start of the interval and, optionally, once at the end.

```tsx
import { useThrottleCallback } from "iso-hooks";

const DemoThrottle = () => {
  const throttledLog = useThrottleCallback(() => {
    console.log("Throttled!");
  }, 1000);

  return <button onClick={throttledLog}>Throttle me</button>;
};
```

---

### 16️⃣ `usePrevious`

Get the previous value of any variable or state — perfect for comparisons and animations.

```tsx
import { usePrevious } from "iso-hooks";

const Counter = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <div>Current: {count}</div>
      <div>Previous: {prevCount}</div>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
};
```

---

### 17️⃣ `useKeyPress`

Detect when a specific keyboard key is pressed.

```tsx
import { useKeyPress } from "iso-hooks";

const SpaceLogger = () => {
  const spacePressed = useKeyPress(" ");

  return <div>{spacePressed ? "Space key is down" : "Space key is up"}</div>;
};
```

---

### 18️⃣ `useToggle`

Easy boolean state with a toggle function.

```tsx
import { useToggle } from "iso-hooks";

const ToggleDemo = () => {
  const [on, toggle] = useToggle(false);

  return <button onClick={toggle}>{on ? "On" : "Off"}</button>;
};
```

---

### 19️⃣ `useUpdateEffect`

Fire an effect only when dependencies change (not on mount) — a safe replacement for regular useEffect after mount.

```tsx
import { useState } from "react";
import { useUpdateEffect } from "iso-hooks";

const OnlyUpdates = () => {
  const [val, setVal] = useState(0);

  useUpdateEffect(() => {
    alert("State changed: " + val);
  }, [val]);

  return <button onClick={() => setVal((v) => v + 1)}>+1</button>;
};
```

---

### 2️⃣0️⃣ `useIsomorphicLayoutEffect`

Like `useLayoutEffect`, but SSR-safe: automatically falls back to `useEffect` on the server.

```tsx
import { useIsomorphicLayoutEffect } from "iso-hooks";

const UseIsoLayoutDemo = () => {
  useIsomorphicLayoutEffect(() => {
    // Runs only on client, not on server
    // Useful for DOM measurements
  }, []);

  return <div>Check the console (client only)</div>;
};
```

---

### 2️⃣2️⃣ `useMousePosition`

Get the mouse position within the viewport, updated live.

```tsx
import { useMousePosition } from "iso-hooks";

const MousePositionDemo = () => {
  const { x, y } = useMousePosition();

  return (
    <div>
      Mouse: {x}, {y}
    </div>
  );
};
```

---

## 🗂 Full Hooks List

| Hook Name                 | Description                                  |
| ------------------------- | -------------------------------------------- |
| useCopyToClipboard        | Copy text to the clipboard                   |
| useDebounce               | Debounce values or functions                 |
| useDocumentTitle          | Update the document title (SSR-safe)         |
| useEventListener          | Attach any event listener                    |
| useFetch                  | Simple & advanced HTTP data fetching         |
| useFocusTrap              | Trap keyboard focus within an element        |
| useHover                  | Detect when element is hovered               |
| useIntersectionObserver   | Observe element visibility in viewport       |
| useInterval               | Safe and modern setInterval                  |
| useIsomorphicLayoutEffect | SSR-safe version of useLayoutEffect          |
| useKeyPress               | Listen to specific keyboard key press        |
| useLocalStorage           | Save and retrieve values from localStorage   |
| useMediaQuery             | Listen to media queries in JS                |
| useMeasure                | Measure element size and position (SSR-safe) |
| useMousePosition          | Track mouse position in the viewport         |
| useNetworkStatus          | Listen to online/offline status              |
| useOnClickOutside         | Detect clicks outside elements               |
| usePrevious               | Save previous value of a variable            |
| useScrollLock             | Lock or unlock scrolling                     |
| useThrottleCallback       | Throttle callbacks                           |
| useTimeout                | Safe setTimeout in React                     |
| useToggle                 | Manage a boolean toggle                      |
| useUpdateEffect           | Run effects after initial mount only         |
| useWindowSize             | Get live browser window size                 |

---

## 🤝 Contributing

All contributions, issues, and suggestions are welcome! Please open a Pull Request or Issue.

---

## 📄 License

MIT © [ManiAlipour](https://github.com/ManiAlipour)

---

<p align="center"><i>Built with ♥ for the React community.</i></p>
