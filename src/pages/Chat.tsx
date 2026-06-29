import { useParams } from "react-router-dom";
import { useGuardedNavigate } from "@/lib/routes";
import { ChevronLeft, MoreHorizontal, Send, CheckSquare } from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";

type TechBlock = {
  name: string;
  id: string;
  bullets: string[];
  actions: string[];
};

type ChatContent = {
  question: string;
  intro: string;
  techs: TechBlock[];
};

const CONTENT: Record<string, ChatContent> = {
  efficiency: {
    question: "What's impacting my team's efficiency?",
    intro:
      "A drop in team efficiency may be linked to several factors. Below are technician-related observations that could be influencing performance, along with context and suggested actions.",
    techs: [
      {
        name: "Marcus Thompson",
        id: "MT4821",
        bullets: [
          "Excessive Available Time Not Dispatched and Demand Hours with no Dispatch. Review the following dates: 6/30, 6/29, 6/28. 6/28 does not show any dispatches but 8 hours of demand time.",
          "ATND can be caused by improper time coding or if tech is loaned to ACE for ORCA jobs then work may be delayed in loading until end of the month.",
        ],
        actions: [
          "Review Infor and validate hours worked with schedule.",
          "Review time coding.",
          "Validate coding is valid.",
        ],
      },
      {
        name: "Derek Holloway",
        id: "DH6103",
        bullets: [
          "Excessive Out of Garage Time while dispatched. Review the following dates: 6/10, 6/17, 6/24. Tech dispatched but did not leave the garage for more than .5 hours after dispatching.",
        ],
        actions: [
          "Coach tech that they should not dispatch until after huddle and code time appropriately.",
          "Coach tech that they should prep for the day, including loading vehicle with necessary equipment and supplies.",
        ],
      },
      {
        name: "Jerome Callaway",
        id: "JC5529",
        bullets: [
          "Excessive Jep Hours, Helper Ticket greater than 90 minutes, Same Day Completion Rate. Review the following dates: 6/5, 6/15, 6/25, 6/26.",
        ],
        actions: [
          "Review the following days Jeps and Helper Ticket Creation with Tech.",
          "Coach tech to follow Expert Path for all fiber jobs.",
          "Coach tech to create the helper ticket as soon as possible.",
        ],
      },
    ],
  },
  atnd: {
    question: "Why has ATND increased?",
    intro:
      "Available Time Not Dispatched hours are trending higher than last month. Below are technician-level observations and recommended next steps.",
    techs: [
      {
        name: "Marcus Thompson",
        id: "MT4821",
        bullets: [
          "ATND hours: 34 hrs June vs. 23 hrs May. Hours are concentrated on 6/28–6/30 with no dispatches recorded despite 8 hours of demand time logged.",
        ],
        actions: [
          "Review Infor and validate hours worked with schedule.",
          "Confirm time coding — check if tech was loaned to ACE for ORCA jobs during this period.",
        ],
      },
      {
        name: "Derek Holloway",
        id: "DH6103",
        bullets: [
          "ATND hours elevated on 6/10, 6/17, 6/24. Tech was dispatched on these dates but did not leave the garage within .5 hours of dispatch.",
        ],
        actions: [
          "Review dispatch timestamps against garage departure.",
          "Coach tech on dispatch protocol and pre-departure preparation.",
        ],
      },
    ],
  },
};

const Chat = () => {
  const navigate = useGuardedNavigate();
  const { topic } = useParams<{ topic: string }>();
  const content = CONTENT[topic ?? "efficiency"] ?? CONTENT.efficiency;

  return (
    <div data-view-name="Chat" className="relative min-h-screen bg-[#F2F2F6] flex flex-col justify-end items-start gap-4 w-[393px] mx-auto">
      <StatusBar />

      {/* Header */}
      <header className="w-full flex items-center justify-between px-4 py-2 bg-[#F2F2F6]">
        <button
          type="button"
          onClick={() => navigate("/performance")}
          className="w-9 h-9 rounded-full bg-card flex items-center justify-center shadow-sm"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground">Chat</h1>
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-card flex items-center justify-center shadow-sm"
          aria-label="More"
        >
          <MoreHorizontal className="w-5 h-5 text-foreground" />
        </button>
      </header>

      {/* Thread */}
      <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto">
        {/* User bubble */}
        <div className="flex justify-end pt-2">
          <div className="max-w-[85%] rounded-[20px] bg-primary text-primary-foreground px-4 py-2.5 text-[15px] leading-snug">
            {content.question}
          </div>
        </div>

        {/* AI response */}
        <div className="rounded-card bg-card p-4 shadow-sm">
          <p className="text-[14px] text-foreground leading-relaxed">{content.intro}</p>

          <ol className="mt-4 space-y-5 list-decimal list-inside">
            {content.techs.map((tech) => (
              <li key={tech.id} className="text-[14px] text-foreground">
                <button
                  type="button"
                  onClick={() => navigate(`/tech/${tech.id}`)}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {tech.name} — {tech.id}
                </button>
                <ul className="mt-2 ml-5 space-y-2 list-disc text-[13.5px] text-foreground/85 leading-relaxed">
                  {tech.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                <div className="mt-3 ml-1 rounded-tile bg-success/10 p-3">
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                    <CheckSquare className="w-4 h-4 text-success" />
                    Actions to be taken:
                  </div>
                  <ol className="mt-1.5 ml-5 list-decimal space-y-1 text-[13.5px] text-foreground/85 leading-relaxed">
                    {tech.actions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ol>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Input bar */}
        <div className="sticky bottom-20 pt-2">
          <div className="flex items-center gap-2 rounded-pill bg-card border border-border px-4 py-2.5 shadow-sm">
            <input
              type="text"
              placeholder="Ask a question"
              readOnly
              className="flex-1 bg-transparent outline-none text-[14px] text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              aria-label="Send"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Chat;
