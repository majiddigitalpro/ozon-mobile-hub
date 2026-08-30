export type RepairService = {
  id: string;
  title: string;
  deviceType: "iPhone" | "Android" | "Both";
  description: string;
  considerations: string;
  turnaroundLabel: string;
  branches: "Both branches" | "Triprayar" | "Chavakkad";
};

export const REPAIR_SERVICES: RepairService[] = [
  {
    id: "screen-replacement",
    title: "Screen Replacement",
    deviceType: "Both",
    description: "Cracked, blank or touch-unresponsive displays replaced for iPhone and Android models.",
    considerations: "Timing depends on the model and display availability.",
    turnaroundLabel: "Selected models in as little as 1 hour",
    branches: "Both branches",
  },
  {
    id: "battery-replacement",
    title: "Battery Replacement",
    deviceType: "Both",
    description: "For phones that drain quickly, shut down suddenly or no longer hold charge.",
    considerations: "We check battery health before recommending a replacement.",
    turnaroundLabel: "Often same day",
    branches: "Both branches",
  },
  {
    id: "charging-port-repair",
    title: "Charging Port Repair",
    deviceType: "Both",
    description: "Loose, slow or non-charging ports cleaned, repaired or replaced.",
    considerations: "Cable and adapter are tested first to rule out simple causes.",
    turnaroundLabel: "Diagnosis first, then confirmed",
    branches: "Both branches",
  },
  {
    id: "camera-repair",
    title: "Camera Repair",
    deviceType: "Both",
    description: "Blurred, black or shaking front and rear cameras inspected and repaired.",
    considerations: "Some faults are software related and are checked first.",
    turnaroundLabel: "Depends on parts availability",
    branches: "Both branches",
  },
  {
    id: "speaker-mic-repair",
    title: "Speaker / Microphone Repair",
    deviceType: "Both",
    description: "Low volume, muffled calls or a microphone the other side cannot hear.",
    considerations: "Cleaning sometimes resolves the issue without a replacement.",
    turnaroundLabel: "Often same day",
    branches: "Both branches",
  },
  {
    id: "water-damage",
    title: "Water Damage",
    deviceType: "Both",
    description: "Liquid-damaged phones cleaned and assessed board level where possible.",
    considerations: "Outcome depends on the extent of the damage. Bring it in as early as possible.",
    turnaroundLabel: "Assessment required",
    branches: "Both branches",
  },
  {
    id: "software-issues",
    title: "Software Issues",
    deviceType: "Both",
    description: "Restarting phones, stuck updates, boot loops, lag and setup problems.",
    considerations: "We explain any data implications before starting.",
    turnaroundLabel: "Often same day",
    branches: "Both branches",
  },
  {
    id: "motherboard-repair",
    title: "Motherboard Repair",
    deviceType: "Both",
    description: "Board-level diagnosis for phones that do not power on or behave unpredictably.",
    considerations: "Advanced repair — diagnosis comes first, then a clear recommendation.",
    turnaroundLabel: "Assessment required",
    branches: "Triprayar",
  },
  {
    id: "back-glass-replacement",
    title: "Back Glass Replacement",
    deviceType: "Both",
    description: "Shattered rear panels replaced to restore grip and looks.",
    considerations: "Availability varies by model and colour.",
    turnaroundLabel: "Depends on parts availability",
    branches: "Both branches",
  },
  {
    id: "face-id-repair",
    title: "Face ID Repair",
    deviceType: "iPhone",
    description: "Face ID failures diagnosed on supported iPhone models.",
    considerations: "Some Face ID faults cannot be repaired outside Apple — we tell you honestly.",
    turnaroundLabel: "Assessment required",
    branches: "Triprayar",
  },
  {
    id: "iphone-repair",
    title: "iPhone Repair",
    deviceType: "iPhone",
    description: "Full iPhone service covering displays, batteries, charging, cameras and software.",
    considerations: "Bring your device to either branch for a diagnosis.",
    turnaroundLabel: "Selected repairs in as little as 1 hour",
    branches: "Both branches",
  },
  {
    id: "android-repair",
    title: "Android Repair",
    deviceType: "Android",
    description: "Samsung, Xiaomi, Vivo, Oppo, OnePlus, Realme, Motorola and more.",
    considerations: "Parts availability varies by brand and model.",
    turnaroundLabel: "Selected repairs in as little as 1 hour",
    branches: "Both branches",
  },
  {
    id: "data-recovery",
    title: "Data Recovery",
    deviceType: "Both",
    description: "Recovery attempts for photos and files from damaged or unresponsive phones.",
    considerations: "Recovery is never guaranteed — we explain what is realistic first.",
    turnaroundLabel: "Assessment required",
    branches: "Triprayar",
  },
];

export const REPAIR_PROBLEMS = [
  "Broken screen",
  "Battery",
  "Charging",
  "Camera",
  "Water damage",
  "Software",
  "Speaker/mic",
  "Back glass",
  "Other",
];

export const REPAIR_STEPS = [
  {
    step: "01",
    title: "Tell Us the Problem",
    body: "Contact us or submit a quick repair request.",
  },
  {
    step: "02",
    title: "Get a Diagnosis",
    body: "Our technicians inspect the device and explain the repair.",
  },
  {
    step: "03",
    title: "Approve the Repair",
    body: "Proceed after understanding the required service.",
  },
  {
    step: "04",
    title: "Get Your Phone Back",
    body: "Selected repairs may be completed quickly, depending on the repair and parts availability.",
  },
];
