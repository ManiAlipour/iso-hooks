import { render, act, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useMeasure } from ".";

// Mock ResizeObserver because it's not available in JSDOM
let resizeCallback: (entries: any[]) => void;
const observeMock = vi.fn();
const disconnectMock = vi.fn();

beforeEach(() => {
  observeMock.mockClear();
  disconnectMock.mockClear();
  resizeCallback = () => {};

  global.ResizeObserver = class ResizeObserver {
    constructor(cb: any) {
      resizeCallback = cb;
    }
    observe = observeMock;
    disconnect = disconnectMock;
    unobserve = vi.fn();
  } as any;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useMeasure", () => {
  it("should initialize with zero values", () => {
    function TestComponent() {
      // Use generic to avoid TS/React ref warnings
      const [ref, { width, height }] = useMeasure<HTMLDivElement>();
      return (
        <div ref={ref} data-testid="box">
          {width}x{height}
        </div>
      );
    }

    render(<TestComponent />);
    // Initial value should be 0x0
    expect(screen.getByTestId("box").textContent).toBe("0x0");
    // Should attach observer
    expect(observeMock).toHaveBeenCalledTimes(1);
  });

  it("should update dimensions when resize occurs", () => {
    function TestComponent() {
      const [ref, rect] = useMeasure<HTMLDivElement>();
      return (
        <div ref={ref} data-testid="box">
          {JSON.stringify(rect)}
        </div>
      );
    }

    render(<TestComponent />);
    // Simulate a resize event by calling the mock callback
    act(() => {
      resizeCallback([
        {
          contentRect: {
            width: 100,
            height: 200,
            top: 10,
            left: 20,
            bottom: 210,
            right: 120,
            x: 20,
            y: 10,
            toJSON: () => ({
              width: 100,
              height: 200,
              top: 10,
              left: 20,
              bottom: 210,
              right: 120,
              x: 20,
              y: 10,
            }),
          },
        },
      ]);
    });

    const output = JSON.parse(screen.getByTestId("box").textContent!);
    // Should update the values properly
    expect(output.width).toBe(100);
    expect(output.height).toBe(200);
    expect(output.top).toBe(10);
  });

  it("should disconnect observer on unmount", () => {
    function TestComponent() {
      const [ref] = useMeasure<HTMLDivElement>();
      return <div ref={ref} />;
    }

    const { unmount } = render(<TestComponent />);
    unmount();
    // Observer should be disconnected
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
