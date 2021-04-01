// This file has various global state things

import { App, ExpressReceiver } from "@slack/bolt";
import express from "express";
import { Challenge } from "./challenge";

const receiver = new ExpressReceiver({
  signingSecret: process.env.SIGNING_SECRET as string,
});

receiver.router.use(express.static("assets"));
export const app = new App({
  signingSecret: process.env.SIGNING_SECRET,
  token: process.env.TOKEN,
  receiver,
});

export default {
  challenge: undefined as Challenge | undefined,
};
