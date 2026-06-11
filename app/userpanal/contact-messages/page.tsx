import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import ContactMessagesClient from "@/app/_components/_userpanal/ContactMessagesClient";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Metadata for the Contact Messages page ///////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

export function generateMetadata() {
  const title = "FlickHQ – Movies & TV Shows - Contact Messages";
  const description =
    "View your submitted contact messages and their status on FlickHQ. Track replies to your inquiries and support requests.";

  return getSharedMetadata(title, description);
}

// //////////////////////////////////////////////////////////////////////////////
// ///////// Entry point — delegates to the client component ////////////////////
// //////////////////////////////////////////////////////////////////////////////

export default function ContactMessagesPage() {
  return <ContactMessagesClient />;
}
