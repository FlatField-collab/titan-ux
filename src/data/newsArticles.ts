import usa250Hero from "@/assets/news-usa250.jpg";

export type BulletNode = {
  text: string;
  children?: BulletNode[];
};

export type ArticleSection = {
  heading: string;
  paragraph?: string;
  bullets?: BulletNode[];
  trailing?: string;
};

export type NewsArticle = {
  id: string;
  format: "safety-bulletin" | "comms-post";
  title: string;
  category: string;
  categoryFull?: string;
  categoryTone: "green" | "blue" | "orange";
  publishedOn: string;
  dateTag: string;
  snippet: string;
  // comms-post
  who?: string;
  when?: string;
  where?: string;
  why?: string;
  heroImage?: string;
  body?: string[];
  // safety-bulletin
  orgLockup?: string;
  intro?: string;
  sections?: ArticleSection[];
  resources?: { label: string; href?: string };
};

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "happy-250th-birthday",
    format: "comms-post",
    title: "Happy 250th Birthday, America!",
    category: "Field Ops",
    categoryFull: "Field Ops - PremWire/Core/CO Communications",
    categoryTone: "green",
    publishedOn: "August 3, 2026",
    dateTag: "TODAY, AUG 3",
    snippet: "150 years of Connecting!",
    who: "All ANFO Employees",
    when: "August 3, 2026",
    where: "All areas",
    why: "Celebrating our nation's birthday and how we at AT&T are part of its history, present, and future.",
    heroImage: usa250Hero,
    body: [
      "As America gears up to celebrate our nation's 250th birthday, we're celebrating all of the connections AT&T has made over the last 150 years…and all those to come. For every breakthrough in human connection, AT&T and our employees are always there, working hard to make a difference for our customers, our communities, and our country. After all, \"American\" has always been our first name.",
    ],
  },
  {
    id: "ac-fvd-safety",
    format: "safety-bulletin",
    title: "AC FVD: Proper Testing, Storage & Safety",
    category: "National EH&S Organization",
    categoryFull: "AT&T National EH&S Organization",
    categoryTone: "blue",
    publishedOn: "August 5, 2026",
    dateTag: "AUG 5",
    snippet:
      "New safety protocols are live. Review proper FVD testing, storage requirements, and danger signs before starting your next job.",
    orgLockup: "AT&T National EH&S Organization",
    intro:
      "One of the most serious risks in the field is exposure to electrical hazards. The AC FVD must be used to detect foreign AC voltage on metallic objects in the work area to prevent shock, burns, or fatal injury. That's why it's so important to understand the correct procedures for testing and storage.",
    sections: [
      {
        heading: "Proper Testing",
        paragraph:
          "Perform the self-test and ensure the following parts of the FVD all work correctly:",
        bullets: [
          { text: "The green LED" },
          { text: "Red bars" },
          { text: "Alarm" },
        ],
        trailing:
          "Before starting work, test all metallic objects in the workspace that could become energized, including:",
      },
      {
        heading: "",
        bullets: [
          { text: "Cabinets" },
          { text: "Poles" },
          { text: "Grounds" },
          { text: "Conduit" },
          { text: "NID's" },
          { text: "Strand" },
          { text: "Fences" },
          { text: "Ceiling grids" },
          { text: "AC Units" },
          { text: "Pipes" },
          { text: "All exposed metal" },
        ],
      },
      {
        heading: "Proper Storage",
        paragraph:
          "Keep the AC FVD clean, protected, and properly stored in its designated pouch to prevent contact with other tools that could damage the device. Replace the AC FVD **immediately** if:",
        bullets: [
          { text: "The unit becomes damaged" },
          { text: "The unit is dropped" },
          { text: "The unit is exposed to water" },
          { text: "The markings or insulating surfaces become compromised." },
        ],
      },
      {
        heading: "Important Notes",
        bullets: [
          {
            text: "The AC FVD detects AC voltage *only*. It does **not** detect DC voltage, current flow, or voltage inside certain grounded shielded cables.",
          },
          {
            text: "The FVD is intended to test for foreign voltage present where it should not be present. You should assume all power lines are energized and distance yourself at least 4 feet from those lines.",
          },
          {
            text: "If 50 Vac or greater is detected: Treat it as a hazard. Ground yourself and retest using the W1BU ground cord and conductive cap. If the reading remains, stop work, protect the area, notify your supervisor, and inform the responsible utility/owner.",
          },
          {
            text: "Watch for other danger signs:",
            children: [
              { text: "Arcing" },
              { text: "Sparks" },
              { text: "Glowing wires" },
              { text: "Buzzing" },
              { text: "Smoke" },
              { text: "Ozone smell" },
              { text: "Vibration" },
            ],
          },
          {
            text: "Any of the above may indicate high current, even if voltage isn't shown. If suspected, cease work and contact your supervisor.",
          },
          {
            text: "Extra precautions apply when working near mobile homes, or when handling wire bundles / unidentified cables.",
          },
        ],
      },
    ],
    resources: { label: "EHS-1600-JBA-7" },
  },
  {
    id: "summer-storm-readiness",
    format: "comms-post",
    title: "Summer Storm Readiness: What Techs Need to Know",
    category: "Field Ops",
    categoryFull: "Field Ops - Weather & Safety",
    categoryTone: "green",
    publishedOn: "July 14, 2026",
    dateTag: "JUL 14",
    snippet:
      "Severe weather season is here. Review the updated dispatch and shelter-in-place procedures before heading out.",
    who: "All Field Technicians",
    when: "Effective July 14, 2026",
    where: "Southeast and Gulf regions",
    why: "Ensuring tech safety during severe weather while maintaining service to critical customers.",
    body: [
      "With hurricane season ramping up, please review the updated dispatch posture and shelter-in-place procedures in the Field Ops portal. Managers should confirm every tech has reviewed the materials before their next on-call rotation.",
    ],
  },
  {
    id: "fiber-rollout-q3",
    format: "comms-post",
    title: "Fiber Rollout Q3 Milestones",
    category: "Field Ops",
    categoryFull: "Field Ops - Network Build",
    categoryTone: "green",
    publishedOn: "July 1, 2026",
    dateTag: "JUL 1",
    snippet:
      "We hit 92% of our Q2 fiber pull targets. Here's what's coming up next quarter and how your market is tracking.",
    who: "All Field Operations Managers",
    when: "Quarter starting July 1, 2026",
    where: "All build markets",
    why: "Aligning field execution with the network build plan and customer commitments.",
    body: [
      "Thanks to everyone who pushed hard to close out Q2 — we landed at 92% of plan, our best quarter since the program began. Q3 brings tighter cycle-time targets and three new fiberhood launches; watch for market-specific briefings from your director this week.",
    ],
  },
  {
    id: "ladder-safety-refresher",
    format: "safety-bulletin",
    title: "Ladder Safety Refresher",
    category: "National EH&S Organization",
    categoryFull: "AT&T National EH&S Organization",
    categoryTone: "blue",
    publishedOn: "June 30, 2026",
    dateTag: "JUN 30",
    snippet:
      "A quick refresher on ladder inspection, placement, and three-point contact. Required reading before your next aerial job.",
    orgLockup: "AT&T National EH&S Organization",
    intro:
      "Falls remain a leading cause of injury in the field. Use this refresher to confirm you are inspecting, placing, and climbing ladders correctly before every aerial task.",
    sections: [
      {
        heading: "Inspect Before Every Use",
        bullets: [
          { text: "Check rails, rungs, and feet for cracks or damage" },
          { text: "Verify duty rating matches the load" },
          { text: "Confirm all labels are legible" },
        ],
      },
      {
        heading: "Placement",
        bullets: [
          { text: "Use the 4-to-1 rule for extension ladders" },
          { text: "Tie off at the top whenever possible" },
          { text: "Keep the base on firm, level ground" },
        ],
      },
    ],
    resources: { label: "EHS-1400-LAD-3" },
  },
];

export function getArticle(id: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((a) => a.id === id);
}
