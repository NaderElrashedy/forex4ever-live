export const DISTRICTS = [
  {
    id: "downtown",
    name: "TMGM Downtown",
    shortName: "Downtown",
    icon: "◈",
    color: "#31d7ff",
    position: 20,
    description:
      "Enter Market City and learn how disciplined traders prepare before making decisions.",
  },
  {
    id: "candle-street",
    name: "Candle Street",
    shortName: "Candle Street",
    icon: "▥",
    color: "#9c8cff",
    position: -90,
    description:
      "Read candle structure, rejection signals and price-action context.",
  },
  {
    id: "market-district",
    name: "Market District",
    shortName: "Market District",
    icon: "◆",
    color: "#5ae6ff",
    position: -200,
    description:
      "Explore trends, support, resistance and market structure.",
  },
  {
    id: "risk-harbor",
    name: "Risk Harbor",
    shortName: "Risk Harbor",
    icon: "⬡",
    color: "#56efb1",
    position: -310,
    description:
      "Protect virtual capital with disciplined risk management.",
  },
  {
    id: "news-lab",
    name: "News Laboratory",
    shortName: "News Lab",
    icon: "⌬",
    color: "#ffbd59",
    position: -420,
    description:
      "Learn how volatility and economic events can affect trading decisions.",
  },
  {
    id: "golden-castle",
    name: "Golden Castle",
    shortName: "Golden Castle",
    icon: "♛",
    color: "#f6cf66",
    position: -530,
    description:
      "Complete the final discipline tests and unlock the Golden Mystery Box.",
  },
];

const missionGroups = [
  {
    districtId: "downtown",
    badge: "Downtown Explorer",
    missions: [
      {
        title: "The First Signal",
        description:
          "The market has started moving quickly. What should you do first?",
        type: "choice",
        options: [
          "Enter immediately before the move disappears",
          "Review the market context and trading plan",
          "Increase risk to benefit from the movement",
          "Copy a random public trade",
        ],
        answer: 1,
        hint: "A disciplined decision begins with context and a plan.",
      },
      {
        title: "Mission Blueprint",
        description:
          "Select the correct order for preparing a trading decision.",
        type: "sequence",
        items: [
          "Check market context",
          "Identify the invalidation level",
          "Calculate appropriate risk",
          "Decide whether the setup follows the plan",
        ],
        answer: [0, 1, 2, 3],
        hint: "Understand the market before calculating and taking risk.",
      },
      {
        title: "Safe Entry Zone",
        description:
          "A setup is unclear and price is moving unpredictably. What is the disciplined action?",
        type: "choice",
        options: [
          "Wait until the setup becomes clear",
          "Enter with maximum virtual size",
          "Open several random positions",
          "Remove the stop-loss",
        ],
        answer: 0,
        hint: "Waiting is a valid trading decision.",
      },
      {
        title: "The Patience Test",
        description:
          "Your plan requires confirmation, but confirmation has not appeared.",
        type: "choice",
        options: [
          "Enter because the market may leave",
          "Ignore the plan for this trade",
          "Wait for confirmation or skip the setup",
          "Double the risk after entering",
        ],
        answer: 2,
        hint: "The mission rewards discipline, not speed.",
      },
      {
        title: "Downtown Guardian",
        description:
          "Which combination represents a prepared decision?",
        type: "choice",
        boss: true,
        options: [
          "Emotion, speed and high risk",
          "Plan, invalidation level and controlled risk",
          "Rumours, leverage and revenge",
          "Random entry without an exit plan",
        ],
        answer: 1,
        hint: "A plan defines both the decision and when it becomes invalid.",
      },
    ],
  },
  {
    districtId: "candle-street",
    badge: "Candle Reader",
    missions: [
      {
        title: "Candle Anatomy",
        description: "What does the body of a candle normally represent?",
        type: "choice",
        options: [
          "The distance between open and close",
          "Guaranteed future direction",
          "The total account balance",
          "The broker's commission",
        ],
        answer: 0,
        hint: "The body is formed by the opening and closing prices.",
      },
      {
        title: "Bullish Avenue",
        description:
          "A bullish candle generally closes at a price that is...",
        type: "choice",
        options: [
          "Below its opening price",
          "Exactly equal to every previous candle",
          "Above its opening price",
          "Guaranteed to continue rising",
        ],
        answer: 2,
        hint: "Bullish describes the relationship between open and close.",
      },
      {
        title: "Rejection Alley",
        description:
          "A long upper wick may indicate rejection from higher prices, but what else is required?",
        type: "choice",
        options: [
          "No other information",
          "Market context and confirmation",
          "Maximum leverage",
          "Removing risk controls",
        ],
        answer: 1,
        hint: "One candle alone does not guarantee the next market move.",
      },
      {
        title: "Context Scanner",
        description:
          "Arrange the candle-reading process in a disciplined order.",
        type: "sequence",
        items: [
          "Check the broader market structure",
          "Locate the candle within an important area",
          "Study the candle shape",
          "Wait for confirmation if required",
        ],
        answer: [0, 1, 2, 3],
        hint: "Start with the wider context before focusing on one candle.",
      },
      {
        title: "Spirit of Candle Street",
        description:
          "A rejection candle appears in the middle of an unclear market. What should you conclude?",
        type: "choice",
        boss: true,
        options: [
          "It guarantees a reversal",
          "It guarantees a profitable trade",
          "It needs context and does not guarantee direction",
          "Risk controls are no longer required",
        ],
        answer: 2,
        hint: "Candles provide information, not guarantees.",
      },
    ],
  },
  {
    districtId: "market-district",
    badge: "Market Navigator",
    missions: [
      {
        title: "Trend Boulevard",
        description:
          "Which structure commonly describes an upward trend?",
        type: "choice",
        options: [
          "Lower highs and lower lows",
          "Higher highs and higher lows",
          "One large candle",
          "No visible structure",
        ],
        answer: 1,
        hint: "An upward trend generally advances through rising swing points.",
      },
      {
        title: "Support Station",
        description:
          "Support is best treated as...",
        type: "choice",
        options: [
          "An exact price that can never break",
          "A zone where buying interest may appear",
          "A guarantee of profit",
          "A reason to remove the stop-loss",
        ],
        answer: 1,
        hint: "Support is usually a zone, not an unbreakable line.",
      },
      {
        title: "Resistance Tower",
        description:
          "Price reaches resistance during a strong upward movement. What is the disciplined approach?",
        type: "choice",
        options: [
          "Assume an immediate reversal",
          "Ignore the market structure",
          "Observe price reaction and wait for evidence",
          "Use maximum risk",
        ],
        answer: 2,
        hint: "Important areas require observation and confirmation.",
      },
      {
        title: "Structure Route",
        description:
          "Arrange these market-structure steps.",
        type: "sequence",
        items: [
          "Identify major swing points",
          "Determine the current structure",
          "Mark relevant zones",
          "Build a conditional plan",
        ],
        answer: [0, 1, 2, 3],
        hint: "Find the swings before deciding what the structure means.",
      },
      {
        title: "Market Tower",
        description:
          "The market breaks resistance briefly and then closes back below it. This could be...",
        type: "choice",
        boss: true,
        options: [
          "A guaranteed upward trend",
          "A possible false breakout requiring confirmation",
          "Proof that stop-losses are unnecessary",
          "A reason to enter randomly",
        ],
        answer: 1,
        hint: "A brief break without acceptance may be a false breakout.",
      },
    ],
  },
  {
    districtId: "risk-harbor",
    badge: "Capital Guardian",
    missions: [
      {
        title: "Capital Shield",
        description:
          "What is the primary purpose of risk management?",
        type: "choice",
        options: [
          "Guarantee that every decision wins",
          "Protect capital and control potential loss",
          "Increase leverage continuously",
          "Eliminate all uncertainty",
        ],
        answer: 1,
        hint: "Risk management controls exposure; it cannot guarantee results.",
      },
      {
        title: "Stop-Loss Harbor",
        description:
          "Where should an invalidation level normally be placed?",
        type: "choice",
        options: [
          "At a logical level showing the idea is invalid",
          "At a random distance",
          "Nowhere",
          "Where it guarantees a profit",
        ],
        answer: 0,
        hint: "The invalidation level should relate to the trading idea.",
      },
      {
        title: "Risk Route",
        description:
          "Arrange the controlled-risk process.",
        type: "sequence",
        items: [
          "Define the invalidation level",
          "Calculate the distance to that level",
          "Choose an appropriate risk limit",
          "Calculate the virtual position size",
        ],
        answer: [0, 1, 2, 3],
        hint: "The position size depends on the invalidation distance and risk limit.",
      },
      {
        title: "Heat Alarm",
        description:
          "After two losing decisions, you feel angry and want to recover immediately.",
        type: "choice",
        options: [
          "Increase risk",
          "Open several positions",
          "Pause and review your emotional state",
          "Remove the trading plan",
        ],
        answer: 2,
        hint: "Revenge trading increases risk and reduces decision quality.",
      },
      {
        title: "Harbor Guardian",
        description:
          "Which virtual risk decision is the most disciplined?",
        type: "choice",
        boss: true,
        options: [
          "Risking most of the account on one idea",
          "Using controlled risk defined before entry",
          "Increasing risk after every loss",
          "Trading without knowing potential loss",
        ],
        answer: 1,
        hint: "Potential loss should be understood and controlled before entry.",
      },
    ],
  },
  {
    districtId: "news-lab",
    badge: "News Analyst",
    missions: [
      {
        title: "Expectation Chamber",
        description:
          "Why can major economic news create volatility?",
        type: "choice",
        options: [
          "Because expectations and actual results can differ",
          "Because markets become risk-free",
          "Because prices must move in one direction",
          "Because stop-losses stop existing",
        ],
        answer: 0,
        hint: "Unexpected information can rapidly change market expectations.",
      },
      {
        title: "Calendar Scanner",
        description:
          "What should be checked before a planned decision?",
        type: "choice",
        options: [
          "Only social media comments",
          "Relevant scheduled economic events",
          "Nothing if the chart looks attractive",
          "Only the previous candle",
        ],
        answer: 1,
        hint: "Scheduled events may affect volatility and execution.",
      },
      {
        title: "Laboratory Protocol",
        description:
          "Arrange the responsible news-checking process.",
        type: "sequence",
        items: [
          "Check the economic calendar",
          "Identify events relevant to the market",
          "Review possible volatility",
          "Adjust or avoid the decision according to the plan",
        ],
        answer: [0, 1, 2, 3],
        hint: "Find the event first, then evaluate its relevance.",
      },
      {
        title: "Headline Storm",
        description:
          "An unverified headline appears online. What should you do?",
        type: "choice",
        options: [
          "Trade immediately",
          "Increase leverage",
          "Verify it using reliable sources",
          "Assume it guarantees direction",
        ],
        answer: 2,
        hint: "Unverified information should not control a disciplined decision.",
      },
      {
        title: "Data Storm",
        description:
          "A major release is seconds away and spreads may become unstable.",
        type: "choice",
        boss: true,
        options: [
          "Enter without a plan",
          "Consider waiting until conditions stabilise",
          "Remove the stop-loss",
          "Use the largest possible size",
        ],
        answer: 1,
        hint: "Choosing not to participate during unstable conditions is valid.",
      },
    ],
  },
  {
    districtId: "golden-castle",
    badge: "Market City Champion",
    missions: [
      {
        title: "The Discipline Gate",
        description:
          "A setup looks attractive but violates your written plan.",
        type: "choice",
        options: [
          "Take it because it looks exciting",
          "Skip it and follow the plan",
          "Increase risk",
          "Enter and create a reason later",
        ],
        answer: 1,
        hint: "Discipline means following the plan even when temptation appears.",
      },
      {
        title: "The Golden Plan",
        description:
          "Arrange the complete decision process.",
        type: "sequence",
        items: [
          "Review context and news",
          "Define setup and invalidation",
          "Calculate controlled risk",
          "Execute only if all conditions are met",
        ],
        answer: [0, 1, 2, 3],
        hint: "Context comes before execution.",
      },
      {
        title: "Patience Hall",
        description:
          "There is no valid opportunity today. What is the correct result?",
        type: "choice",
        options: [
          "Force a decision",
          "Trade randomly to remain active",
          "Protect capital and wait",
          "Increase Risk Heat",
        ],
        answer: 2,
        hint: "No trade can be a successful disciplined decision.",
      },
      {
        title: "Final Decision",
        description:
          "Which statement best represents responsible trading education?",
        type: "choice",
        options: [
          "Profit is guaranteed with the right indicator",
          "Risk can be eliminated completely",
          "Trading involves uncertainty and potential capital loss",
          "Every market movement should be traded",
        ],
        answer: 2,
        hint: "No educational tool can remove market uncertainty.",
      },
      {
        title: "Master of Market City",
        description:
          "Choose the principles that unlock the Golden Mystery Box.",
        type: "choice",
        boss: true,
        options: [
          "Speed, emotion and maximum leverage",
          "Patience, planning and controlled risk",
          "Revenge, rumours and random entries",
          "Guaranteed profit and zero uncertainty",
        ],
        answer: 1,
        hint: "The city rewards disciplined behaviour, not reckless risk.",
      },
    ],
  },
];

export const MISSIONS = missionGroups.flatMap((group) =>
  group.missions.map((mission, index) => {
    const district = DISTRICTS.find(
      (item) => item.id === group.districtId
    );

    const globalIndex =
      DISTRICTS.findIndex((item) => item.id === group.districtId) * 5 +
      index;

    return {
      ...mission,
      id: `${group.districtId}-${index + 1}`,
      number: globalIndex + 1,
      districtId: group.districtId,
      districtName: district.name,
      districtColor: district.color,
      districtIcon: district.icon,
      badge: group.badge,
      points: mission.boss ? 400 : 150 + index * 25,
      coins: mission.boss ? 200 : 60 + index * 15,
    };
  })
);

export const TOTAL_MISSIONS = MISSIONS.length;

export function getDistrictMissions(districtId) {
  return MISSIONS.filter((mission) => mission.districtId === districtId);
}

export function getMissionByNumber(number) {
  return MISSIONS.find((mission) => mission.number === number);
}
