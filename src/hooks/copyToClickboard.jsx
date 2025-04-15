"use client";
import { Copy } from "lucide-react";
import { useState } from "react";

const CopyEmail = () => {
  const email = "2022540866.mohammad@ug.sharda.ac.in"; // Replace with your email
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); // Reset message after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}>
        <Copy size={16} />
    </button>
  );
};
export default CopyEmail;
