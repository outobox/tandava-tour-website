import React from "react";

let cachedWebGL: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (cachedWebGL !== null) return cachedWebGL;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cachedWebGL = !!gl;
  } catch {
    cachedWebGL = false;
  }
  return cachedWebGL;
}

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: !isWebGLAvailable() };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    if (typeof console !== "undefined") {
      console.warn("[WebGL] Falling back to static poster:", error.message);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

export default WebGLErrorBoundary;
