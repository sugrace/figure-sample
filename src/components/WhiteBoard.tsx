import React, { useState } from "react";

const WhiteBoard = ({ children }) => {
  return (
    <div>
      <div
        style={{
          height: "600px",
          border: "1px solid #ccc",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default WhiteBoard;
