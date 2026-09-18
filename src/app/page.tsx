import { getProjectsByKind } from "@/utils/projects";
import { getExperience } from "@/utils/experience";
import { getSiteSettings } from "@/utils/site";
import ShowMoreList from "@/components/ShowMoreList";

const CONTACT_LABELS = {
  washingtonPost: "Washington Post byline",
  github: "GitHub",
  linkedin: "LinkedIn",
  bluesky: "Bluesky",
} as const;

function displayHandle(url: string): string {
  if (!url) return "add link";
  try {
    const { pathname, hostname } = new URL(url);
    if (hostname.includes("github.com") || hostname.includes("bsky.app")) {
      return pathname.replace(/^\//, "").replace(/\/$/, "") || "add handle";
    }
    return hostname.replace(/^www\./, "");
  } catch {
    return "add link";
  }
}

export default async function Home() {
  const [analysis, tools, experience, site] = await Promise.all([
    getProjectsByKind("Reporting and analysis"),
    getProjectsByKind("Tools and infrastructure"),
    getExperience(),
    getSiteSettings(),
  ]);

  const links = Object.entries(CONTACT_LABELS).map(([key, label]) => {
    const href = site.socialLinks[key as keyof typeof site.socialLinks];
    return {
      key,
      label,
      handle: href ? displayHandle(href) : "add link",
      href: href || "#",
    };
  });

  return (
    <div className="max-w-[660px] mx-auto px-[28px] pt-[96px] pb-[160px] flex flex-col gap-[88px]">
      <header className="flex flex-col gap-[28px]">
        <h1 className="m-0 text-[16px] font-medium">{site.author}</h1>
        <p className="m-0 max-w-[50ch] [text-wrap:pretty]">{site.bio}</p>
      </header>

      <section className="flex flex-col gap-[20px]">
        <h2 className="m-0 text-[13px] font-normal tracking-[0.08em] uppercase opacity-[0.55]">
          Reporting and analysis
        </h2>
        <ShowMoreList items={analysis} />
      </section>

      <section className="flex flex-col gap-[20px]">
        <h2 className="m-0 text-[13px] font-normal tracking-[0.08em] uppercase opacity-[0.55]">
          Tools and infrastructure
        </h2>
        <ShowMoreList items={tools} />
      </section>

      <section className="flex flex-col gap-[20px]">
        <h2 className="m-0 text-[13px] font-normal tracking-[0.08em] uppercase opacity-[0.55]">
          Experience
        </h2>
        <div className="flex flex-col">
          {experience.map((job) => (
            <div key={job.title} className="row flex flex-col gap-[14px]">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-[24px] gap-y-2 items-baseline">
                <span className="flex flex-col gap-1 min-w-0">
                  <span className="font-medium">{job.title}</span>
                  <span className="opacity-[0.55] [text-wrap:pretty]">
                    {job.org}
                  </span>
                </span>
                <span className="text-[13px] opacity-[0.55] text-right [font-variant-numeric:tabular-nums]">
                  {job.dates}
                </span>
              </div>
              {job.roles.length > 0 && (
                <div className="flex flex-col gap-[10px] pl-[24px]">
                  {job.roles.map((role) => (
                    <div
                      key={role.title}
                      className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-[24px] gap-y-2 items-baseline"
                    >
                      <span className="min-w-0 text-[14px] opacity-[0.8]">
                        {role.title}
                      </span>
                      <span className="text-[12px] opacity-[0.55] text-right [font-variant-numeric:tabular-nums]">
                        {role.dates}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-[20px]">
        <h2 className="m-0 text-[13px] font-normal tracking-[0.08em] uppercase opacity-[0.55]">
          Contact
        </h2>
        <div className="flex flex-col">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.href !== "#" ? "_blank" : undefined}
              rel={link.href !== "#" ? "noopener noreferrer" : undefined}
              className="row row-sm grid grid-cols-[minmax(0,1fr)_auto] gap-x-[24px] items-baseline"
            >
              <span>{link.label}</span>
              <span className="text-[13px] opacity-[0.55] whitespace-nowrap">
                {link.handle}
              </span>
            </a>
          ))}
        </div>
      </section>

      <footer className="flex justify-between gap-[24px] text-[13px] opacity-[0.55] border-t border-[color:var(--hairline)] pt-[14px]">
        <span>{site.location}</span>
        <span className="[font-variant-numeric:tabular-nums]">
          {site.updatedLabel}
        </span>
      </footer>
    </div>
  );
}
