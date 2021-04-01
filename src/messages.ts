export const bronzeWelcome = ({ user }: { user: string }) => {
  return `Hmm... it seems something went wrong while upgrading you to Hack Club Gold, <@${user}>. :sadparrot:  We'll look in to it, but for now, try talking with our Support <@U01P8NH2WK0>.
  
  We've temporarily restored your message-posting abilities until we resolve this issue!`;
};

export const silverWelcome = ({ user }: { user: string }) => {
  return `Welcome to Hack Club Silver, <@${user}>! This is where you'll hang out until you unlock Hack Club Gold :first_place_medal:
              
*Here's how it works*:
              
Every so often, I'll post the cryptic name of a Slack emoji :ghost: It'll look something like \`:skdjfldkjf:\`, so watch out for it!
              
I'll continue to reveal more characters, one after the other, until I've unveiled the full emoji. Here's an example:
              
\`\`\`
:skfjvur:
:ekfjvur:
:egfjvur:
:eggjvur:
:eggsvur:
:eggsdur:
:eggsder:
:eggsdee:
\`\`\`
              
The first person to react with the actual emoji will be promoted to Hack Club Gold!`;
};