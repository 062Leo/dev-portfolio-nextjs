"use client";

import { ExternalLinkDialog, useExternalLink } from "@/components/ui/ExternalLinkDialog";
import { useProject, type DemoControlsGroup } from "@/data/index";
import { imageSize } from "@/data/image-sizes";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useT } from "@/i18n";
import { renderMarkdownText } from "@/lib/markdown";

const isGroupedControls = (
  controls: string[] | DemoControlsGroup[],
): controls is DemoControlsGroup[] => {
  return (
    Array.isArray(controls) &&
    controls.length > 0 &&
    typeof controls[0] === "object" &&
    controls[0] !== null &&
    "title" in controls[0]
  );
};

export function DetailPage({ id }: { id: string }) {
  const { open: openExternalLink, dialogProps } = useExternalLink();
  const t = useT();
  const project = useProject(id);

  const hasDemoControls = project.demoControls && project.demoControls.length > 0;

  let groupedControls: DemoControlsGroup[] | null = null;
  let flatControls: string[] | null = null;

  if (hasDemoControls) {
    const controls = project.demoControls;
    if (isGroupedControls(controls)) {
      groupedControls = controls as DemoControlsGroup[];
    } else {
      flatControls = controls as string[];
    }
  }

  return (
    <div className="relative z-10 container mx-auto max-w-5xl px-4 py-24">
      <div className="mb-8">
        <Link
          href={`/projects/${id}`}
          className="-mt-2.5 mb-5.5 inline-flex items-center gap-2 py-2.5 text-accent transition-colors"
        >
          <ArrowLeft size={20} />
          {t.demo.back}
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-[clamp(1.25rem,6vw,2.25rem)] font-bold font-rubik uppercase [overflow-wrap:anywhere] text-accent-2 text-shadow-glow">
            {project.title} - Demo
          </h1>
        </div>

        <div className="text-base md:text-lg leading-relaxed space-y-4 text-text">
          {project.demotext && renderMarkdownText(project.demotext)}
        </div>

        <div className="mt-4">
          {project.demoImage && (
            <button
              type="button"
              className="w-full rounded-xl overflow-hidden border-2 border-accent bg-bg cursor-pointer block"
              onClick={() => {
                if (project.demoLink) {
                  openExternalLink(project.demoLink, "itch.io");
                }
              }}
            >
              <div className="w-full h-full">
                <Image
                  src={project.demoImage}
                  alt={project.title}
                  {...imageSize(project.demoImage)}
                  sizes="(max-width: 1024px) 100vw, 992px"
                  className="w-full h-auto"
                />
              </div>
            </button>
          )}
        </div>

        <div className="text-base md:text-lg leading-relaxed space-y-4 text-text">
          {hasDemoControls && (
            <>
              <h2 className="mb-4 text-xl font-semibold font-press-start text-accent-2-light">
                {t.demo.controls}
              </h2>
              {groupedControls ? (
                <div className="flex flex-col md:flex-row gap-8">
                  {groupedControls.map((group: DemoControlsGroup, groupIndex: number) => (
                    <div
                      key={groupIndex}
                      className="inline-block overflow-x-auto max-w-md md:flex-1"
                    >
                      <h3 className="mb-2 text-base md:text-lg font-semibold font-press-start text-accent-2-light">
                        {group.title}
                      </h3>
                      <table className="text-sm md:text-base border-collapse">
                        <thead>
                          <tr className="border-b border-accent">
                            <th className="py-1 pr-4 font-semibold text-right font-press-start text-accent-2-light">
                              {t.demo.keys}
                            </th>
                            <th className="py-1 pl-4 font-semibold text-left font-press-start border-l border-accent text-accent-2-light">
                              {t.demo.action}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((item: string, index: number) => {
                            const [action, input] = item.split(":");
                            return (
                              <tr key={index} className="border-b border-accent last:border-b-0">
                                <td className="py-1 pr-4 font-semibold text-right text-text">
                                  {input?.trim()}
                                </td>
                                <td className="py-1 pl-4 text-left border-l border-accent text-text">
                                  {action}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ) : (
                flatControls && (
                  <div className="inline-block overflow-x-auto max-w-md">
                    <table className="text-sm md:text-base border-collapse">
                      <thead>
                        <tr className="border-b border-accent">
                          <th className="py-1 pr-4 font-semibold text-right font-press-start text-accent-2-light">
                            {t.demo.keys}
                          </th>
                          <th className="py-1 pl-4 font-semibold text-left font-press-start border-l border-accent text-accent-2-light">
                            {t.demo.action}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {flatControls.map((control, index) => {
                          const [action, input] = control.split(":");
                          return (
                            <tr key={index} className="border-b border-accent last:border-b-0">
                              <td className="py-1 pr-4 font-semibold text-right text-text">
                                {input?.trim()}
                              </td>
                              <td className="py-1 pl-4 text-left border-l border-accent text-text">
                                {action}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </>
          )}
        </div>

        {project.miscTitle && (
          <h2 className="mb-2 w-full max-w-3xl text-left text-xl font-semibold font-press-start text-accent-2-light">
            {project.miscTitle}
          </h2>
        )}
        {project.miscimage && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full max-w-3xl rounded-xl overflow-hidden border-2 border-accent bg-bg">
              <Image
                src={project.miscimage}
                alt={t.demo.illustrationAlt}
                {...imageSize(project.miscimage)}
                sizes="(max-width: 768px) 100vw, 768px"
                className="w-full h-auto"
              />
            </div>
            {project.misctext && (
              <div className="mt-4 w-full max-w-3xl  text-sm md:text-base leading-relaxed text-text">
                {renderMarkdownText(project.misctext)}
              </div>
            )}
          </div>
        )}
      </div>

      <ExternalLinkDialog {...dialogProps} />
    </div>
  );
}
