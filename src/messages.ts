export const bronzeWelcome = ({ user }: { user: string }) => {
  return `Hmm... it seems something went wrong while upgrading you to Hack Club Gold, <@${user}>. :sadparrot:  We'll look in to it, but for now, try talking with our Support <@U01P8NH2WK0>.
  
  We've temporarily restored your message-posting abilities until we resolve this issue!`;
};

export const silverWelcome = ({ user }: { user: string }) => {
  return `<@${user}> You’ve been added to this Silver member channel because posting in certain channels now requires Gold member status.
React to this message with correct emoji to be promoted to Hack Club Gold!
INSTRUCTIONS:
Click the “Add reaction” button on this message (long-press on mobile) and then type the emoji.
Whoever does this first gets a promotion from Silver to Gold!
This message will self destruct if no one completes the challenge before the answer is revealed.
If someone gets it before you do, a new challenge will appear, so have patience and try again.
If you’re confused, please ask for help ^,^ in this channel!`;
};
