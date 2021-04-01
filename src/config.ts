import { DateTime } from "luxon";

export interface Config {
  blockedChannels: string[];
  startDate: DateTime;
  endDate: DateTime;
  goldChannel: string; // INFO: idk if we'll use this
  silverChannel: string;
  bronzeChannel: string;
  host: string;
}

export const dev: Config = {
  // Channels that require Hack Club Gold
  blockedChannels: ["C01SW1XUXN1"],
  startDate: DateTime.fromObject({
    hour: 8,
    minute: 16,
    day: 1,
    month: 4,
    year: 2021,
    zone: "America/New_York",
  }),
  endDate: DateTime.fromObject({
    hour: 23,
    minute: 17,
    day: 1,
    month: 4,
    year: 2021,
    zone: "America/New_York",
  }),

  // Channel to send people to when they don't have Gold
  silverChannel: "C01TBNA2FQR",
  goldChannel: "C01T0D24ZBL",
  bronzeChannel: "C01T20DCTEW",
  host: "https://silver-and-gold.ngrok.io",
};

export const prod: Config = {
  blockedChannels: [
    "C0266FRGV", // #lounge
    "C0EA9S0A0", // #code
    "C0131FX5K98", // #javascript
    "C0HNE8UUU", // #studycorner
    "C74HZS5A5", // #lobby
    "C013AGZKYCS", // #question-of-the-day
    "C0NP503L7", // #hackathons
    "C1C3K2RQV", // #design
    "CCW6Q86UF", // #apple
    "C0DCUUH7E", // #music
    "CDJMS683D", // #counttoamillion
    "C0D845A5S", // #college-apps
    "C0121LVV79P", // #rust
    "C015HNHD7FA", // #vim
    "C0K3R2SD8", // #linux
    "CUWFYLM41", // #stonks
  ],

  startDate: DateTime.fromObject({
    hour: 11,
    minute: 15,
    day: 1,
    month: 4,
    year: 2021,
    zone: "America/New_York",
  }),
  endDate: DateTime.fromObject({
    hour: 21,
    day: 1,
    month: 4,
    year: 2021,
    zone: "America/New_York",
  }),

  // TODO: rename these channels before `startDate`
  // they'll have a boring name before it starts so no one will know.
  silverChannel: "C01SZKVGJUB",
  goldChannel: "C01SWB6EFNH",
  bronzeChannel: "C01SWBBTEBF",
  host: "https://silver-and-gold.hosted.hackclub.com",
};

export default (): Config => {
  if (process.env.NODE_ENV == "production") {
    return prod;
  } else {
    return dev;
  }
};
