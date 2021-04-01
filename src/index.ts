import { createConnection } from "typeorm";

import Member, { Membership } from "./models/member";

import config from "./config";
import { newChallenge } from "./challenge";

import state, { app } from "./state";
import { silverWelcome } from "./messages";
import Solving from "./models/solving";

app.command("/emojileaderboard", async ({ ack }) => {
  const items = await Solving.createQueryBuilder("solving")
    .select('solving."userId"')
    .addSelect('COUNT(solving."userId")', "count")
    .groupBy('"userId"')
    .orderBy("count", "DESC")
    .limit(10)
    .getRawMany<{ userId: string; count: number }>();

  let text = `Here are the top ${items.length} people to have completed the emoji puzzle!\n\n`;

  text += items
    .map(
      ({ userId, count }) =>
        `<@${userId}>'s solved it ${count} time${count == 1 ? "" : "s"}!`
    )
    .join("\n");

  await ack(text);
});

app.message(async ({ message, client, event }) => {
  if (message.subtype) {
    return;
  }

  console.log(config().startDate.diffNow().toMillis());
  console.log(config().endDate.diffNow().toMillis());

  if (
    config().blockedChannels.includes(message.channel) &&
    config().startDate.diffNow().toMillis() < 0 &&
    config().endDate.diffNow().toMillis() > 0
  ) {
    const user: string = (message as any).user;

    // Check to see if they have Hack Club Gold
    const member = await Member.findOne({ userId: user });
    if (member && member.membership != Membership.SILVER) {
      // "I'll allow it"
      console.log(`User ${user} has Hack Club Gold!`);
      return;
    }

    if (!(message as any).thread_ts) {
      // Let them know if it was a top-level message
      await client.chat.postMessage({
        text: `Sorry, but you need Hack Club Gold to post messages here!`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Sorry <@${user}>, but you need Hack Club Gold to post messages here! Check <#C0266FRGT> for more info :first_place_medal:`,
            },
          },
          {
            type: "image",
            image_url: `${config().host}/gold.gif`,
            alt_text: "Hack Club Gold",
          },
        ],
        channel: message.channel,
        thread_ts: message.ts,
      });
    }

    // Delete the message
    try {
      await app.client.chat.delete({
        ts: message.ts,
        channel: message.channel,
        token: process.env.USER_TOKEN,
      });
    } catch (e) {
      console.error("error deleting message: " + e);
    }

    // Invite them to #hack-club-silver
    try {
      await client.conversations.invite({
        channel: config().silverChannel,
        users: user,
      });

      // If the invitation succeeded, welcome them
      await client.chat.postEphemeral({
        channel: config().silverChannel,
        text: `Welcome to Hack Club Silver, <@${user}>`,
        user,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: silverWelcome({ user }),
            },
          },
          {
            type: "image",
            image_url: `${config().host}/silver.gif`,
            alt_text: "Hack Club Silver",
          },
        ],
      });

      const member = new Member();

      member.userId = user;
      member.membership = Membership.SILVER;

      try {
        await member.save();
      } catch (e) {
        // nobody cares
      }
    } catch (e) {
      console.error("error inviting them: " + e);
      // discard error because maybe they're just already in the channel
    }
  }
});

(async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Member, Solving],
    synchronize: true,
  });

  await app.start(parseInt(process.env.PORT as string) || 3000);
  console.log("App started");

  console.log(
    `Configured to start at ${config().startDate.toLocaleString()}, in ${config()
      .startDate.diffNow()
      .as("minutes")} minutes`
  );

  state.challenge = await newChallenge();
})();
