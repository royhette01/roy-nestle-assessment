import { useCallback, useState, type ReactNode } from "react";
import type { PetName } from "../types";
import { absolutizeDefinitionHtml, normalizeDefinitionHtml } from "../lib/htmlLinks";

const X_LOGIN = "https://x.com/i/flow/login";
const MESSENGER_LOGIN = "https://www.messenger.com/login.php";

function SocialSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      className="detail-card__social-svg"
      viewBox="0 0 24 24"
      width={22}
      height={22}
      aria-hidden
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      {children}
    </svg>
  );
}

type Props = {
  name: PetName;
  categoryLabel: (id: string) => string;
  related: PetName[];
  onPickRelated: (id: string) => void;
};

function genderIcon(g: PetName["gender"]) {
  if (g.includes("M") && g.includes("F")) return "⚥";
  if (g.includes("F")) return "♀";
  if (g.includes("M")) return "♂";
  return "—";
}

function DetailSocialRow({
  copyHint,
  onCopyLink,
}: {
  copyHint: string | null;
  onCopyLink: () => void;
}) {
  return (
    <div className="detail-card__social-row">
      <button
        type="button"
        className="detail-card__social-btn"
        onClick={onCopyLink}
        aria-label="Copy page link"
        title={copyHint ?? "Copy link"}
      >
        <SocialSvg>
          <path
            fill="#fff"
            d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
          />
        </SocialSvg>
      </button>
      <a
        className="detail-card__social-btn"
        href={X_LOGIN}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Log in on X (opens in a new tab)"
      >
        <SocialSvg>
          <path
            fill="#fff"
            d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17a4.48 4.48 0 00-7.63 4.08 12.7 12.7 0 01-9.2-4.66 4.48 4.48 0 001.39 5.98c-.74-.02-1.43-.23-2.04-.57v.06a4.49 4.49 0 003.6 4.4 4.52 4.52 0 01-2.03.08 4.49 4.49 0 004.2 3.11 9 9 0 01-5.56 1.91A12.64 12.64 0 008.12 21c8.2 0 12.68-6.79 12.68-12.69 0-.19-.01-.39-.02-.58a9.22 9.22 0 002.56-2.48z"
          />
        </SocialSvg>
      </a>
      <a
        className="detail-card__social-btn"
        href={MESSENGER_LOGIN}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Log in on Messenger (opens in a new tab)"
      >
        <SocialSvg>
          <path
            fill="#fff"
            d="M13.2 5.4L7.4 13.2h3.6l-1.1 6.8 6.8-9.4h-3.7l1.2-5.8z"
          />
        </SocialSvg>
      </a>
    </div>
  );
}

export function NameDetail({
  name,
  categoryLabel,
  related,
  onPickRelated,
}: Props) {
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const tags = name.categories.map((id) => categoryLabel(id)).filter(Boolean);
  const html = absolutizeDefinitionHtml(normalizeDefinitionHtml(name.definition));

  const copyPageLink = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    void navigator.clipboard.writeText(url).then(
      () => {
        setCopyHint("Copied");
        window.setTimeout(() => setCopyHint(null), 2000);
      },
      () => setCopyHint(null),
    );
  }, []);

  return (
    <article className="detail-card">
      <h2 className="detail-card__name">{name.title}</h2>
      <header className="detail-card__head">
        <span className="detail-card__gender" aria-hidden>
          {genderIcon(name.gender)}
        </span>
        <p className="detail-card__tags">
          {tags.length > 0 ? (
            <span className="detail-tag-row">{tags.join(" · ")}</span>
          ) : (
            <span className="detail-tag detail-tag--muted">No tags</span>
          )}
        </p>
      </header>
      <hr className="detail-card__rule" />
      <div
        className="detail-card__body rte"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {related.length > 0 ? (
        <section className="related" aria-labelledby="related-heading">
          <h3 id="related-heading" className="related__title">
            Related names
          </h3>
          <div className="related__foot">
            <ul className="related__chips">
              {related.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="related-chip"
                    onClick={() => onPickRelated(r.id)}
                  >
                    {r.title}
                  </button>
                </li>
              ))}
            </ul>
            <nav
              className="detail-card__social detail-card__social--inline"
              aria-label="Link and social logins"
            >
              <DetailSocialRow copyHint={copyHint} onCopyLink={copyPageLink} />
            </nav>
          </div>
        </section>
      ) : (
        <nav className="detail-card__social" aria-label="Link and social logins">
          <DetailSocialRow copyHint={copyHint} onCopyLink={copyPageLink} />
        </nav>
      )}
    </article>
  );
}
