"use client";

import { useCallback, useState } from "react";

interface Contact {
  name: string;
  phone: string;
}

interface UseContactPickerResult {
  contact: Contact | null;
  error: string | null;
  importContact: () => Promise<void>;
}

declare global {
  interface Navigator {
    contacts?: {
      select: (properties: string[], options?: { multiple?: boolean }) => Promise<any[]>;
    };
  }
}

export default function useContactPicker(): UseContactPickerResult {
  const [contact, setContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);

  const importContact = useCallback(async () => {
    try {
      if (!("contacts" in navigator && "ContactsManager" in window)) {
        throw new Error("This browser does not support the Contacts API.");
      }

      const result = await (navigator.contacts as Navigator['contacts'])?.select(
        ["name", "tel"],
        { multiple: false }
      );

      if (result && result.length > 0) {
        const [selectedContact] = result;
        
        setContact({
          name: selectedContact.name?.[0] || "Unknown Name",
          phone: selectedContact.tel?.[0] || "No Phone Number",
        });
        setError(null);
      } else {
        throw new Error("No contact selected");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to import contact.";
      setError(message);
      console.error("Contact import error:", err);
    }
  }, []);

  return { contact, error, importContact };
}
