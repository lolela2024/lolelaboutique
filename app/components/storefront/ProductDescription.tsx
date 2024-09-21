import React from "react";

export default function ProductDescription({ content }: { content: JSON }) {
  return (
    <div
      className="ProseMirror whitespace-pre-line py-4 rounded-lg"
      style={{ whiteSpace: "pre-line" }}
      dangerouslySetInnerHTML={{
        __html: JSON.parse(JSON.stringify(content)),
      }}
    />
  );
}
