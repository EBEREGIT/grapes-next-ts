"use client";

import type { Editor } from "grapesjs";
import GrapesJsStudio from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import { useSearchParams } from "next/navigation";

export default function EditorView() {
  const searchParams = useSearchParams();
  const projectID = searchParams.get("projectID");

  // save project
  const saveToLocalStorage = async (projectId: string, project: unknown) => {
    localStorage.setItem(projectId, JSON.stringify(project));
  };

  // load project
  const loadFromLocalStorage = async (projectId: string) => {
    const projectString = localStorage.getItem(projectId);
    return projectString ? JSON.parse(projectString) : null;
  };

  // publish project
  const publishWebsite = async (editor: Editor) => {
    const files = await editor.runCommand("studio:projectFiles", {
      styles: "inline",
    });
    const websiteData = {
      lastPublished: new Date().toLocaleString(),
      files,
    };
    localStorage.setItem(`${projectID}-published`, JSON.stringify(websiteData));
  };

  return (
    <main className="flex h-screen flex-col justify-between gap-2">
      <div className="flex-1 w-full h-full overflow-hidden">
        <GrapesJsStudio
          options={{
            licenseKey: "YOUR_LICENSE_KEY",
            project: {
              default: {
                pages: [
                  {
                    name: "Home",
                    component: "<h1>Fallback Project, reload to retry</h1>",
                  },
                ],
              },
            },
            storage: {
              type: "self",
              autosaveIntervalMs: 5, // save after every 5 changes

              //   save project
              onSave: async ({ project, editor }) => {
                await saveToLocalStorage(projectID as string, project);
                await publishWebsite(editor);
                console.log("Project saved", { project });
              },

              //   get project from storage
              onLoad: async () => {
                const project = await loadFromLocalStorage(projectID as string);
                console.log("Project loaded", { project });

                // If the project doesn't exist (eg. first load), let's return a new one.
                return {
                  project: project || {
                    pages: [
                      {
                        name: "Home",
                        component: `<h1 style="padding: 2rem; text-align: center">
                            Hello Home 👋
                          </h1>`,
                      },
                      {
                        name: "About",
                        component: `<h1 style="padding: 2rem; text-align: center">
                            Hello About 👋
                          </h1>`,
                      },
                      {
                        name: "Blog",
                        component: `<h1 style="padding: 2rem; text-align: center">
                            Hello Blog 👋
                          </h1>`,
                      },
                    ],
                  },
                };
              },
            },
          }}
        />
      </div>
    </main>
  );
}
