"use client";

import { FacebookProvider, CustomChat } from "react-facebook";

const FacebookMSG = () => {
  return (
    <FacebookProvider appId="142857828856613" chatSupport>
      <CustomChat pageId="102490042723592" minimized={true} />
    </FacebookProvider>
  );
};

export default FacebookMSG;
