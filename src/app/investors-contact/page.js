//export const dynamic = "force-dynamic";
import React from "react";
import Contact from "../../components/features/investors/Contact";

async function fetchContactData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/investors/contact`, {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    const result = await response.json();
    const contactData = result.data;

    if (result.status === "success") {
      return {
        content: contactData?.content,
        pdf_contacts: contactData?.pdf_contacts || [],
        text_contacts: contactData?.text_contacts || [],
        error: null,
      };
    }
    return {
      content: null,
      contacts: null,
      error: result.message,
    };
  } catch (error) {
    return {
      content: null,
      contacts: null,
      error: "Failed to fetch contact data",
    };
  }
}

export default async function contact() {
  const { content, pdf_contacts, text_contacts, error } = await fetchContactData();

  const contacts = text_contacts;

  console.log("Fetched Contact Data:", { content, pdf_contacts, text_contacts, error });

  return (
    <>
      {/* contact*/}
      <Contact content={content} contacts={contacts} files={pdf_contacts} error={error} />
    </>
  );
}
