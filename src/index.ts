import { App } from "@slack/bolt";

console.log("Hello world 🌎");

const app = new App({
  signingSecret: process.env.SIGNING_SECRET,
  token: process.env.TOKEN,
});

(async () => {
  await app.start(parseInt(process.env.PORT as string) || 3000);
  console.log("App started");
})();
