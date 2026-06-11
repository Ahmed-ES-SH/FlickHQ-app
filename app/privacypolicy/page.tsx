///////////////////////////////////////////////////////////////////////////////
///////// Privacy Policy — Server Component entry point ///////////////////////
///////////////////////////////////////////////////////////////////////////////

import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import PrivacyPolicyWrapper from "../_components/_website/privacypolicy/PrivacyPlicyWrapper";
import { Suspense } from "react";

///////////////////////////////////////////////////////////////////////////////
///////// Metadata for SEO & social sharing ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export function generateMetadata() {
  const title = "FlickHQ – Movies & TV Shows - Privacy Policy";
  const description =
    "Read FlickHQ's Privacy Policy to understand how we collect, use, and protect your personal information when you use our streaming services.";

  const sharedMetadata = getSharedMetadata(title, description);

  return sharedMetadata;
}

///////////////////////////////////////////////////////////////////////////////
///////// Page entry — renders the Privacy Policy content /////////////////////
///////////////////////////////////////////////////////////////////////////////

export default function PrivacyPolicy() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">Loading Privacy Policy...</div>
      }
    >
      <PrivacyPolicyWrapper />
    </Suspense>
  );
}
