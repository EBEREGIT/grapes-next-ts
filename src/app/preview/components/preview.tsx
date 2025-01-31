"use client";

import { useSearchParams } from "next/navigation";
import PreviewNav from "./nav";
import { useState } from "react";

export default function PreviewComponent() {
  const [currentFile, setCurrentFile] = useState<TrustedHTML>();
  const searchParams = useSearchParams();

  const projectID = searchParams.get("projectID");

  const parsed = JSON.parse(
    localStorage.getItem(`${projectID}-published`) as string
  );

  return (
    <main>
      {parsed ? (
        <>
          <PreviewNav files={parsed.files} setCurrentFile={setCurrentFile} />
          <main
          className="py-2"
            dangerouslySetInnerHTML={{
              __html: currentFile
                ? (currentFile as TrustedHTML)
                : `<section className="flex justify-center">
                <p className="text-center">Please Select a file above</p>
              </section>`,
            }}
          />
        </>
      ) : (
        <section>
          <p>Please Return to the Editor and Click the Save icon to publish</p>
        </section>
      )}
    </main>
  );
}
