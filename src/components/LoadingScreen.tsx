import React from "react";
import 'ldrs/dotStream';

const LoadingScreen: React.FC = () => (
  <div className="loading-screen">
    <l-dot-stream size="60" speed="2.5" color="white"></l-dot-stream>
  </div>
);

export default LoadingScreen;
