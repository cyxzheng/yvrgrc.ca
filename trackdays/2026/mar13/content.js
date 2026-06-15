// Edit the content in this object to update the page.
// Keep event details centralized here instead of in the HTML.
const participantCode = "0313";

window.trackDayEventContent = {
  brandTitle: "YVR GRC Track Days",
  title: "Vancouver GR Corolla Club Track Day 2026",
  storageKey: "trackdays:2026:mar13",
  participantCode,
  groupColors: {
    a: "#A4CD2F",
    b: "#00ABF0",
    c: "#F57F04"
  },
  overviewImage: {
    src: "assets/images/cover.gif",
    alt: "Track day event cover image"
  },
  overviewAudio: {
    src: "",
    buttonLabels: {
      muted: "Unmute",
      playing: "Mute"
    },
    loop: true,
    initialVolume: 0.8
  },
  date: "March 13, 2026",
  time: "12:15 PM - 4:00 PM",
  locationName: "Mission Raceway Park",
  address: "32670 Dyke Rd, Mission, BC V2V 4J5",
  locationUrl: "https://maps.google.com/?q=32670+Dyke+Rd,+Mission,+BC+V2V+4J5",
  summary: "The first ever Vancouver GR Corolla Club track day, in partnership with Toyota Canada and OpenRoad Auto Group.",
  promoLink: {
    label: "Reserve your signed Morizo hat.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
  },
  trackInfo: {
    tabs: [
      {
        id: "getting-there",
        label: "Getting There",
        title: "Arrival Instructions",
        featureCard: {
          eyebrow: "Gate Code",
          value: participantCode
        },
        description:
          "Upon entering the gate, turn RIGHT towards the paddock, and park in the area highlighted on the map for tech inspection.",
        media: {
          title: "Gate and paddock route",
          imageSrc: "assets/images/gettingthere.png",
          meta: "Opens a zoomable PDF in a new tab",
          pdfUrl: "assets/docs/gettingthere.pdf",
          pdfLabel: "Open getting-there PDF"
        },
        infoBox: {
          title: "Important!",
          items: [
            {
              title: "What Time Do I Need To Arrive?",
              body:
                "Arrive on time, so that you have ample time to complete registration, tech inspection, and attend the driver's meeting."
            },
            {
              title: "What happens if I miss the driver's meeting?",
              body:
                "Attending the driver's meeting is mandatory. If you miss the driver's meeting, you will not be driving on track."
            }
          ]
        }
      },
      {
        id: "track-layout",
        label: "Track Layout",
        title: "Passing Zones and Education",
        description:
          "Passing is only allowed via point-bys, otherwise assume the car in front doesn't see you. Familiarize yourself with your group's passing zones.",
        infoBox: {
          title: "Track Layout Change",
          items: [
            {
              body:
                "Due to repaving, the track layout has changed to a shorter circuit. Please follow the marked red track on the map."
            },
          ]
        },
        media: {
          title: "Mission Raceway track layout",
          imageSrc: "assets/images/passingzones.png",
          meta: "Opens a zoomable PDF in a new tab",
          pdfUrl: "assets/docs/passingzones.pdf",
          pdfLabel: "Open track-layout PDF"
        },
        videos: [
          {
            youtubeId: "https://www.youtube.com/watch?v=KenIYlB2kvo",
            title: "Nathan Tong Onboard",
            caption: "Study Nathan sending it."
          },
          {
            title: "Instructor Demo Lap",
            youtubeId: "https://www.youtube.com/watch?v=VS9ga1GbPjI",
            caption: "Corner by corner guide."
          },
          {
            title: "Ross Dunnet Onboard",
            youtubeId: "https://www.youtube.com/watch?v=nJh48rrQEb4",
            caption: "Study Ross sending it."
          }
        ]
      },
      {
        id: "flags",
        label: "Flags",
        title: "Flags",
        description:
          "For educational purposes only! Official flagging procedures will be explained at the Driver's Meeting.",
        flags: [
          {
            name: "Green",
            description: "Track is clear. Resume normal lapping pace.",
            imageSrc: "/trackdays/shared/assets/images/flags/green.png"
          },
          {
            name: "Yellow",
            description: "Caution. No passing.",
            imageSrc: "/trackdays/shared/assets/images/flags/yellow.png"
          },
          {
            name: "Red",
            description: "Session stopped. Slow down and come to a stop at the next worker station until next instruction (front straight, T3, or T6)",
            imageSrc: "/trackdays/shared/assets/images/flags/red.png"
          },
          {
            name: "Black (Waving)",
            description: "All cars slow down, come into hot pits and see a crew member/steward/staff.",
            imageSrc: "/trackdays/shared/assets/images/flags/wavingblack.png"
          },
          {
            name: "Black (Furled/pointed)",
            description: "You have been flagged. Come into the hot pits and speak to staff.",
            imageSrc: "/trackdays/shared/assets/images/flags/black.png"
          },
          {
            name: "Blue",
            description: "There is a faster car behind AND you've been holding them up for 3 corners. Give point-by at next safe opportunity.",
            imageSrc: "/trackdays/shared/assets/images/flags/passing.png"
          },
          {
            name: "Checkered",
            description: "Cool down lap and return to parking (Mission specific: enter parking at the end of hot pits, do not enter at beginning of pit)",
            imageSrc: "/trackdays/shared/assets/images/flags/checkered.png"
          }
        ]
      }
    ]
  },
  schedule: [
    { time: "12:15 PM", title: "Gates Open to Participants", description: `Gate code is ${participantCode}` },
    { time: "12:20 PM", title: "Registration and Tech Inspection" },
    { time: "12:45 PM", title: "Driver's Meeting" },
    { type: "marker", time: "1:00 PM", title: "Track Hot" },
    { time: "1:00 PM", title: "Group A Running", description: "1:00 PM - 1:15 PM", group: "a" },
    { time: "1:15 PM", title: "Group B Running", description: "1:15 PM - 1:30 PM", group: "b" },
    { time: "1:30 PM", title: "Group C Running", description: "1:30 PM - 1:45 PM", group: "c" },
    { time: "1:45 PM", title: "Group A Running", description: "1:45 PM - 2:00 PM", group: "a" },
    { time: "2:00 PM", title: "Group B Running", description: "2:00 PM - 2:15 PM", group: "b" },
    { time: "2:15 PM", title: "Group C Running", description: "2:15 PM - 2:30 PM", group: "c" },
    { time: "2:30 PM", title: "Group A Running", description: "2:30 PM - 2:45 PM", group: "a" },
    { time: "2:45 PM", title: "Group B Running", description: "2:45 PM - 3:00 PM", group: "b" },
    { time: "3:00 PM", title: "Group C Running", description: "3:00 PM - 3:15 PM", group: "c" },
    { time: "3:15 PM", title: "Group A Running", description: "3:15 PM - 3:30 PM", group: "a" },
    { time: "3:30 PM", title: "Group B Running", description: "3:30 PM - 3:45 PM", group: "b" },
    { time: "3:45 PM", title: "Group C Running", description: "3:45 PM - 4:00 PM", group: "c" },
    { type: "marker", time: "4:00 PM", title: "Track Cold" }
  ],
  requiredItems: [
    "Snell 2010 or newer helmet",
    "Driver's License",
    "Signed online waiver",
    "Full tank of gas"
  ],
  recommendedItems: [
    "Water",
    "Tire pressure gauge",
    "Tire pump",
    "Snacks",
    "Folding chair",
    "Basic tools"
  ],
  faqItems: [
    {
      question: "How should I pace my laps?",
      answer:
        "Do one or two hot laps, then take a cooldown lap to manage heat in the car, tires, and brakes."
    },
    {
      question: "What if I feel overwhelmed on track?",
      answer:
        "Back off the pace, give point-bys when possible. This is not a race! Predictable driving matters more than speed."
    },
    {
      question: "What should I do after completing a session?",
      answer:
        "Make your way to the paddock, and let your engine run for a few minutes. DO NOT PULL THE HANDBRAKE."
    },
    {
      question: "Should I change tire pressures during the day?",
      answer:
        "Yes. Check pressures after sessions and adjust as needed, since repeated hot laps can raise them quickly."
    }
  ],
  groups: [
    {
      name: "Group A",
      group: "a",
      level: "Advanced",
      people: [
        "Naohiko Saito / Masahiro Sasaki",
        "Ross Dunnet",
        "Nathan Tong",
        "Colin Yu",
        "Marc Brito",
        "Jessie Pashak",
        "Jason Leung",
        "Alan Cham",
        "Jeremy McLean"
      ]
    },
    {
      name: "Group B",
      group: "b",
      level: "Intermediate",
      people: [
        "Jack Wong",
        "Eugene Liew",
        "Jason Lai",
        "Justin Ng",
        "Don Yip",
        "Brian Wong",
        "Erik Soderlund",
        "Steve Lloyd",
        "Luka Petrovic"
      ]
    },
    {
      name: "Group C",
      group: "c",
      level: "Novice",
      people: [
        "Vic Quintoro",
        "Calvin Zheng",
        "Gabi Chen",
        // "Caymin Hansson",
        "Hanson Ng",
        "Leo Yang",
        "Tim Tseng",
        "Danny Luk",
        // "Ian Wong",
        "Michael Chan",
        "Landon Folz"
      ]
    }
  ],
  volunteers: [
    {
      role: "Registration & Coordination",
      names: ["Eugene Liew", "Calvin Zheng", "Mission Staff"]
    },
    {
      role: "Track Lot Marshals",
      names: ["Ross Dunnet", "Marc Brito", "Justin Ng"]
    },
    {
      role: "Tech Inspections & Support",
      names: ["Nathan Tong", "Marc Brito"]
    },
    {
      role: "Follow Lead Instructors",
      names: ["Jessie Pashak", "Nathan Tong", "Marc Brito"]
    },
    {
      role: "Medical",
      names: ["Victor Quintoro", "Justin Ng"]
    },
    {
      role: "Food & Beverage",
      names: ["Colin Yu", "Justin Ng"]
    }
  ]
};
