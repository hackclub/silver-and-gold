import EMOJI_PROD from "./emojis.json";

const EMOJI_DEV = [
  "smile",
  "wave",
  "face_with_rolling_eyes",
  "computer",
  "up",
  "raised_hands",
];

export default (): string[] => {
  if (process.env.NODE_ENV == "production") {
    return EMOJI_PROD;
  } else {
    return EMOJI_DEV;
  }
};
