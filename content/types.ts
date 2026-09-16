/**
 * Content types.
 *
 * ADR-002 records that all user-facing prose lives in `content/`, authored as typed
 * TypeScript modules and imported directly by Server Components.
 *
 * Each section story of Epic #25 added the type for its own records, so only the types the page
 * renders are defined here.
 */

/** Site-level metadata. Rendered into the document head rather than the page body. */
export interface Site {
  title: string;
  description: string;
}

/** A link that stands on its own, never inside a sentence, as ADR-002 requires. */
export interface Link {
  /** What the link shows. */
  text: string;
  href: string;
}

/** The introduction at the top of the page, in the order DDR-006 sets. */
export interface Introduction {
  /** The page title. */
  name: string;
  /** One line saying what the owner does. */
  positioning: string;
  location: string;
  relocation: string;
  summary: string;
  availability: string;
  /** Each link's text is its own address, so it is not printed twice, per DDR-006. */
  contact: readonly Link[];
}

/** The list of links to the page's sections, per DDR-006. */
export interface Contents {
  /** The accessible name of the navigation, so assistive technology can announce it. */
  label: string;
}

/** A month, as its machine-readable value: the year and the month's two digits, such as "2024-10". */
export type Month = `${number}-${number}`;

/** How dates read on the page, per DDR-006. */
export interface DateLabels {
  /** The names of the twelve months, January first, as a date shows them. */
  months: readonly string[];
  /** What a current role shows in place of its end month. */
  present: string;
}

/** A role in the experience section, per the Content Brief on #25. */
export interface Role {
  /** The job title, which is the entry's heading, per DDR-006. */
  title: string;
  company: string;
  place: string;
  start: Month;
  /** Left out while the role is current. */
  end?: Month;
  /** Two to four points on what the owner did, CV-style, without pronouns. */
  points: readonly string[];
}

/** The experience section. */
export interface Experience {
  /** The section's heading, which its link in the contents shows too. */
  title: string;
  /** Newest first. The page shows them in this order, per ADR-002. */
  roles: readonly Role[];
}

/** A project in the projects section, per the Content Brief on #25. */
export interface Project {
  /** The project's name, which is the entry's heading, per DDR-006. */
  name: string;
  /** The technologies it uses, which form the entry's metadata line, per DDR-006. */
  technologies: readonly string[];
  /** What the project is and what it demonstrates, CV-style, without pronouns. */
  description: string;
  /**
   * The repository first, then a live version where one exists. Each link is labelled rather than
   * showing its address, which prints after it on paper, per DDR-006.
   */
  links: readonly Link[];
}

/** The projects section. */
export interface Projects {
  /** The section's heading, which its link in the contents shows too. */
  title: string;
  /** In the order the page shows them, per ADR-002. */
  projects: readonly Project[];
}

/** The three levels a skill can have, per the Content Brief on #25. */
export type SkillLevel = 'advanced' | 'proficient' | 'basic';

/** A level, with the word the page shows for it. Levels are words, not scores, per DDR-006. */
export interface SkillLevelName {
  level: SkillLevel;
  name: string;
}

/** A group of skills in the skills section, such as AI, per the Content Brief on #25. */
export interface SkillGroup {
  /** The group's name, which is its heading, per DDR-006. */
  name: string;
  /** The skills at each level, in the order the page shows them. A level with none is left out. */
  skills: Partial<Record<SkillLevel, readonly string[]>>;
}

/** The skills section. */
export interface Skills {
  /** The section's heading, which its link in the contents shows too. */
  title: string;
  /** Every level, strongest first, which is the order each group shows them in, per DDR-006. */
  levels: readonly SkillLevelName[];
  /** In the order the page shows them, per ADR-002. */
  groups: readonly SkillGroup[];
}

/** A degree, per the Content Brief on #25: the months it ran, and its thesis. */
export interface Degree {
  /** The degree's name, which is the entry's heading, per DDR-006. */
  name: string;
  institution: string;
  start: Month;
  end: Month;
  /** What the thesis was about, CV-style, without pronouns. It is the entry's body, per DDR-006. */
  thesis: string;
}

/** A certification, per the Content Brief on #25, named and dated as its certificate states. */
export interface Certification {
  /** The certification's name, exactly as its certificate gives it, which is the entry's heading. */
  name: string;
  /** Who issued it, in the place a degree's institution takes, per DDR-006. */
  institution: string;
  /** The month it was granted, which is the only date it shows, per DDR-006. */
  granted: Month;
}

/** A degree or a certification. Both are entries, and a certification has no body, per DDR-006. */
export type Credential = Degree | Certification;

/** The education and certifications section. */
export interface Credentials {
  /** The section's heading, which its link in the contents shows too. */
  title: string;
  /** Newest first, per DDR-006. The page shows them in this order, per ADR-002. */
  credentials: readonly Credential[];
}

/** A language the owner speaks, per the Content Brief on #25. */
export interface Language {
  name: string;
  /** The owner's level, on the CEFR scale, such as "Native (C2)" or "C1". */
  level: string;
}

/** The languages section. */
export interface Languages {
  /** The section's heading, which its link in the contents shows too. */
  title: string;
  /** In the order the page shows them, per ADR-002. */
  languages: readonly Language[];
}

/**
 * The downloadable CV, per ADR-004 and ADR-005.
 *
 * The file is a separately designed document, not a photograph of the page, so ADR-005 lists the
 * facts it must share with the site and makes the site the one that wins when they disagree. The
 * digest below is what tells anyone that the two have moved apart.
 */
export interface Cv {
  /** What the download control shows, per DDR-010. The control itself is #48's. */
  label: string;
  /**
   * Where the file sits, as a path from the site's root. It is not a URL: every reference to a
   * binary asset goes through `asset()` first, per ADR-004, so it resolves under the Pages base
   * path as well as locally.
   */
  file: string;
  /**
   * A fingerprint of the content modules that hold the site's prose, which `content/cv.test.ts`
   * recomputes. When the page's facts change this stops matching, and the test suite fails until
   * the CV has been brought back into step and this value replaced.
   */
  contentDigest: string;
}
