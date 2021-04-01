// ideas:
// make people count from 1-17? might get boring idk. if you say 17, you "win" if you haven't said 15 or 16 previously
// make people guess an emoji. the first person to do it "gets out". randomize the emoji after

import config from "./config";
import EmojiList from "./emoji";
import { bronzeWelcome, silverWelcome } from "./messages";
import Member, { Membership } from "./models/member";
import state, { app } from "./state";

export interface Challenge {
  right: string;
  wrong: string;
  interval: NodeJS.Timeout;
  timestamp: string;
  isRunning: boolean;
}

const EMOJI = EmojiList();

app.event("reaction_added", async ({ event, client }) => {
  console.log(`${event.user} reacted with ${event.reaction}`);

  if (
    state.challenge &&
    (event.item as any).channel == config().silverChannel &&
    (event.item as any).ts == state.challenge?.timestamp &&
    state.challenge?.isRunning &&
    event.reaction == state.challenge.right
  ) {
    const member = await Member.findOne({ userId: event.user });
    if (!member || member.membership != Membership.SILVER) {
      return;
    }

    clearTimeout(state.challenge.interval);
    state.challenge.isRunning = false;

    await app.client.chat.postMessage({
      text: `woooooooooo <@${event.user}> picked the right emoji!!!`,
      channel: config().silverChannel,
      token: process.env.TOKEN,
    });

    await app.client.chat.update({
      channel: (event.item as any).channel,
      text: challengeText(state.challenge.right, ":white_check_mark:", false),
      ts: (event.item as any).ts,
      token: process.env.TOKEN,
    });

    setTimeout(async () => {
      state.challenge = await newChallenge();

      try {
        const resp = await app.client.conversations.invite({
          channel: config().bronzeChannel,
          users: event.user,
          token: process.env.TOKEN,
        });

        console.log(resp);
      } catch (e) {
        console.log(e);
      }

      try {
        // await app.client.conversations.kick({
        //   channel: config().silverChannel,
        //   user: event.user,
        //   token: process.env.TOKEN,
        // });

        await client.chat.postEphemeral({
          channel: config().bronzeChannel,
          text: `Something went wrong, <@${event.user}>`,
          user: event.user,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: bronzeWelcome({ user: event.user }),
              },
            },
            {
              type: "image",
              image_url: `${config().host}/bronze.gif`,
              alt_text: "Hack Club Silver",
            },
          ],
        });

        member.membership = Membership.BRONZE;
        await member.save();
      } catch (e) {
        console.log(e);
      }
    }, 3000);
  }
});

function sample<T>(arr: T[]): T {
  // random element from array
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomChar() {
  let n = Math.floor(Math.random() * 62);
  if (n < 10) return n; //1-10
  if (n < 36) return String.fromCharCode(n + 55); //A-Z
  return String.fromCharCode(n + 61); //a-z
}

function randomString(length: number) {
  let s = "";
  while (s.length < length) s += randomChar();
  return s;
}

function challengeText(
  currentAnswer: string,
  challengeEmoji: string,
  expiring: boolean
): string {
  const text = [
    `️${challengeEmoji}️ NEW CHALLENGE! What emoji is this? ️${challengeEmoji}`,
    `React to this message with correct response`,
    `️:thinking_face: :arrow_right: :${currentAnswer}: :arrow_left: :face_with_monocle:`,
    `\`:${currentAnswer}:\``, // FIXME: maybe this is just for debugging idk
  ];

  if (expiring) {
    text.push("TIME IS TICKING! Solve this before the answer is revealed...");
    // gonna change it to have a warning towards the end i think
    //
  }

  return text.join("\n");

  //  return `️${challengeEmoji}️ NEW CHALLENGE! What emoji is this? ️${challengeEmoji}
  //React to this message with correct response
  //:thinking_face: :arrow_right: :${currentAnswer}: :arrow_left: :face_with_monocle:
  //\`:${currentAnswer}:\``; // FIXME: maybe this is just for debugging idk
}

export async function newChallenge(): Promise<Challenge> {
  // the bot will post a random :/emoji:. every 10 seconds it will edit one
  // letter within the colons. like :/kajfnwkkso:, slowly revealing the answer
  // react and get it right and you "win"

  // POST MESSAGE - guess some emoji

  const right = sample(EMOJI);
  const wrong = randomString(right.length);

  const timeEmoji = [
    "🕛", // 0
    "🕐", // 1
    "🕑", // 2
    "🕒", // 3
    "🕓", // 4
    "🕔", // 5
    "🕕", // 6
    "🕖", // 7
    "🕗", // 8
    "🕘", // 9
    "🕙", // 10
    "🕚", // 11
  ];

  let currentTimeEmoji = timeEmoji.shift() || "🕛";
  timeEmoji.push(currentTimeEmoji);

  const message = await app.client.chat.postMessage({
    channel: config().silverChannel,
    //text: ":" + wrong + ":",
    text: challengeText(wrong, currentTimeEmoji, false),
    token: process.env.TOKEN,
  });

  // UPDATE MESSAGE - edit the message
  let edited = wrong.split("");
  const idxs = Array.from({ length: right.length }, (_, i) => i);
  const interval = setInterval(async () => {
    // FIXME: perhaps this should work from the end to the beginning.. not random indexes
    const i = sample(idxs); // get a random array element (value matches index)

    idxs.splice(idxs.indexOf(i), 1); // remove the element so we don't edit it next time

    edited[i] = right[i]; // change one char in the list of wrong chars to the right char
    // FIXME: edit the message rather than posting a new message
    // say(challengeText(edited.join(''), currentTimeEmoji)
    currentTimeEmoji = timeEmoji.shift() || "🕛";
    timeEmoji.push(currentTimeEmoji);

    app.client.chat.update({
      channel: config().silverChannel,
      token: process.env.TOKEN,
      //text: ":" + edited.join("") + ":",
      text: challengeText(edited.join(""), currentTimeEmoji, idxs.length < 2),
      ts: message.ts as string,
    });

    console.log(edited.join(""));

    if (idxs.length == 0) {
      // on the last one
      clearInterval(interval);
      if (state.challenge) {
        state.challenge.isRunning = false;
      }

      setTimeout(async () => {
        if (state.challenge) {
          try {
            await app.client.chat.delete({
              channel: config().silverChannel,
              ts: state.challenge.timestamp,
              token: process.env.TOKEN,
            });
          } catch (e) {}
        }
        state.challenge = await newChallenge();
      }, 5000);
    }
  }, 5 * 1000 /* 10 seconds */);

  return {
    right,
    wrong,
    interval, // so you can cancel it on challenge completion
    timestamp: message.ts as string,
    isRunning: true,
  };
}

function challengeResponse() {
  // LISTEN FOR CORRECT RESPONSES - maybe this needs to use global state variables (or a database)?
  // did someone react with `:${right}:`?
  //    end this challenge
  //    move the winner to #bronze
  //    start a new challenge :D
}
