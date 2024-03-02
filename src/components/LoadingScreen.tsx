import React from "react";
import 'ldrs/dotStream';

const LoadingScreen: React.FC = () => (
  <div className="loading-screen">
    {React.createElement('l-dot-stream', { size: "60", speed: "2.5", color: "white" })}
  </div>
);

export default LoadingScreen;
