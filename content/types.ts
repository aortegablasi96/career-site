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

/**
 * An image this site carries, per ADR-004: one committed file, shown at the size it was prepared
 * at, with no pipeline and no variants beside it.
 */
export interface Image {
  /**
   * Where the file sits, as a path from the site's root. It is not a URL: every reference to a
   * binary asset goes through `asset()` first, per ADR-004, so it resolves under the Pages base
   * path as well as locally.
   */
  file: string;
  /** What the image shows, for a reader who does not see it. No image on this site is decorative. */
  alt: string;
}

/**
 * A video this site carries, per ADR-004: one committed MP4, with a poster still beside it and
 * nothing fetched until someone presses play.
 *
 * The poster is a separate committed file rather than a frame pulled out of the video, because
 * ADR-004 rules out an image pipeline, and because DDR-010 prints the poster where the video
 * element itself cannot go.
 */
export interface Video {
  /** Where the file sits, as a path from the site's root, reached through `asset()` as an image is. */
  file: string;
  /** The still shown before the video is played, and what prints, per DDR-010. Also a path. */
  poster: string;
  /**
   * What the video shows, for a reader who does not watch it. It is the video's accessible name as
   * well as its description, so nothing on the page depends on playing it.
   */
  description: string;
}

/**
 * What a project shows beside its text, per DDR-010: a still of the application running, or its
 * demo video with a poster still. Both are 4:3 and both are described, so an entry reads correctly
 * whether or not its asset arrives.
 */
export type ProjectMedia = Image | Video;

/**
 * The mark a contact control carries beside its label.
 *
 * DDR-010 gives each control an icon as a second, non-colour cue that it is a control, since the
 * pills are the one place on the page a link is not underlined. Since DDR-029 it is also what tells
 * a reader which service a short label names before they read it. Which mark a control takes is
 * recorded here, beside the link, rather than worked out from its address: a component should not
 * have to recognise a host to know what to draw. It is a key the component maps to a shape, as
 * `SkillLevel` is a key it maps to a tint, so no prose leaves `content/`.
 */
export type ContactIcon = 'gmail' | 'linkedin' | 'github';

/**
 * A contact address in the introduction, shown as a pill control, per DDR-010, and again in the
 * footer, per DDR-028.
 *
 * It carries two strings because the two places show different ones, per DDR-029: the pill shows
 * the short `label` the design draws, and the footer shows `text`, which is the address itself.
 * The address is stated once here and rendered in the one place that shows it, so the two cannot
 * disagree, per ADR-002.
 */
export interface ContactLink extends Link {
  /** The address, such as `aortegablasi@gmail.com`. The footer shows it; the pill does not. */
  text: string;
  /** What the pill shows, per DDR-029: "Email", "LinkedIn" or "GitHub". */
  label: string;
  icon: ContactIcon;
  /**
   * Whether the pill opens its address in a new tab, per DDR-043. The two profiles do, so the page
   * stays open behind them; an email address opens the mail client, which is no tab at all. It is
   * recorded here rather than worked out from the address, for the reason `icon` is. The footer
   * ignores it: its addresses open in the same tab.
   */
  newTab: boolean;
}

/** The introduction at the top of the page, in the order DDR-010 sets. */
export interface Introduction {
  /**
   * The owner, beside the name rather than above it, per DDR-010, so it never pushes the
   * positioning line or the contact controls below the fold on a phone.
   */
  photo: Image;
  /** The page title. */
  name: string;
  /** One line saying what the owner does. */
  positioning: string;
  location: string;
  relocation: string;
  summary: string;
  availability: string;
  /**
   * Each link shows its short label here and its address in the footer, per DDR-029. Neither is
   * printed twice: the pill prints its label with no address after it, and the footer prints the
   * address once.
   */
  contact: readonly ContactLink[];
  /**
   * What a pill that opens a new tab says about it, per DDR-043. Since DDR-044 it is said only to
   * assistive technology, after the label in the pill's accessible name; nothing on the pill shows it.
   */
  newTab: string;
}

/**
 * The bar of links to the page's sections, per DDR-031, which supersedes DDR-010's and DDR-006's
 * rejection of a sticky one.
 *
 * The word each link shows is not here: it sits in its own section's module, beside the heading it
 * stands for, so a section states both of its names in one place.
 */
export interface Contents {
  /** The accessible name of the navigation, so assistive technology can announce it. */
  label: string;
  /** The word the bar's first link shows, which returns the reader to the top of the page. */
  home: string;
  /** The site's title, which the bar shows at the left of the page's column, per DDR-049. */
  title: string;
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
  /** The section's heading. */
  title: string;
  /**
   * The word this section's link in the contents bar shows, per DDR-031. It is the design's own,
   * which is not always the heading: "Education" stands for "Education and certifications". The
   * section is still named by its `h2` for assistive technology, so this shortens the link and not
   * the section.
   */
  link: string;
  /** Newest first. The page shows them in this order, per ADR-002. */
  roles: readonly Role[];
}

/** A project in the projects section, per the Content Brief on #25. */
export interface Project {
  /** The project's name, which is the entry's heading, per DDR-006, and its view's `h1`. */
  name: string;
  /**
   * The last part of the project view's address, per ADR-010: `/projects/<slug>`. It is content
   * rather than something worked out from the name, because an address someone has been sent must
   * not change when a name is reworded. Lowercase words joined by hyphens.
   */
  slug: string;
  /** What the project looks like running, shown beside the text, per DDR-010. */
  media: ProjectMedia;
  /**
   * A few words under the media on the project's view, per DDR-050, naming what the picture shows.
   * The media's own alternative text still describes it in full; this is what a sighted reader is
   * told, so it adds nothing the alternative text does not already say.
   */
  caption: string;
  /**
   * The technologies it uses, shown as tags rather than as a line of metadata, per DDR-010, so a
   * technical reader can scan the stack without reading the description.
   */
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
  /** The section's heading. */
  title: string;
  /**
   * The word this section's link in the contents bar shows, per DDR-031. It is the design's own,
   * which is not always the heading: "Education" stands for "Education and certifications". The
   * section is still named by its `h2` for assistive technology, so this shortens the link and not
   * the section.
   */
  link: string;
  /** In the order the page shows them, per ADR-002. */
  projects: readonly Project[];
  /** The words each project's view shows around the project's own, per DDR-050. */
  view: ProjectView;
}

/** The strings a project's view shows that are not the project's own, per DDR-050. */
export interface ProjectView {
  /** The link at the top of the view, which returns the reader to the projects on the page. */
  back: string;
  /** The label above the technologies. */
  builtWith: string;
  /**
   * What a project's links say about opening a new tab, per DDR-043 as DDR-050 extends it. It is
   * said only to assistive technology, after the link's text in its accessible name, as a profile
   * pill says it.
   */
  newTab: string;
  /** The browser tab's title and the link preview's, from the project's name. */
  title: (project: string) => string;
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
  /** The section's heading. */
  title: string;
  /**
   * The word this section's link in the contents bar shows, per DDR-031. It is the design's own,
   * which is not always the heading: "Education" stands for "Education and certifications". The
   * section is still named by its `h2` for assistive technology, so this shortens the link and not
   * the section.
   */
  link: string;
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
  /** The section's heading. */
  title: string;
  /**
   * The word this section's link in the contents bar shows, per DDR-031. It is the design's own,
   * which is not always the heading: "Education" stands for "Education and certifications". The
   * section is still named by its `h2` for assistive technology, so this shortens the link and not
   * the section.
   */
  link: string;
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
  /** The section's heading. */
  title: string;
  /**
   * The word this section's link in the contents bar shows, per DDR-031. It is the design's own,
   * which is not always the heading: "Education" stands for "Education and certifications". The
   * section is still named by its `h2` for assistive technology, so this shortens the link and not
   * the section.
   */
  link: string;
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
