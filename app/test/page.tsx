import React from "react";
import Script from "next/script";

const Page = () => {
  return (
    <div>
      <Script
        src={`${
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://flashbot.nitishyadav.xyz"
        }/widget.js`}
        data-id="4f3ed7fe-6df5-4e94-b10e-b67113f7fe5a"
        data-base-url={
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://flashbot.nitishyadav.xyz"
        }
        defer
      ></Script>
    </div>
  );
};

export default Page;
