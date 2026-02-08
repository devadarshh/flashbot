import React from "react";
import Script from "next/script";

const Page = () => {
  return (
    <div>
      <Script
        src={`${
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://flashsupport.nitishyadav.xyz"
        }/widget.js`}
        data-id="3cd75e97-93ab-4fbc-b267-0dc2fbae15bf"
        data-base-url={
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://flashsupport.nitishyadav.xyz"
        }
        defer
      ></Script>
    </div>
  );
};

export default Page;
