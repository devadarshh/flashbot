import React from "react";
import Script from "next/script";

const Page = () => {
  return (
    <div>
      <Script
        src="https://flashsupport.nitishyadav.xyz/widget.js"
        data-id=""
        defer
      ></Script>
    </div>
  );
};

export default Page;
