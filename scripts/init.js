Hooks.on("createChatMessage", (message, options, userId) => {
  if (!message.isRoll) return;

  const user = game.users.get(userId);
  if (!user?.isGM) return;

  console.log(message);

  const roll = message.rolls[0];

  const rollResult = roll.total;
  const rollFormula = roll.formula;

  const timestamp = message.system?.timestamp ?? Date.now();
  const username = game.users.get(userId)?.name || "Unknown User";
  const actorname = message.alias || "Unknown Actor";
  const flavor = message.flavor;

  // TODO AP: Add if roll is success or fail

  const res = {
    type: "roll",
    timestamp: timestamp,
    roll: {
      username: username,
      actorname: actorname,
      flavor: flavor,
      roll_result: rollResult,
      roll_formula: rollFormula,
    },
    displayTime: game.settings.get("streamelements", "displayTime"),
    style: game.settings.get("streamelements", "cssEditor"),
    html: game.settings.get("streamelements", "htmlEditor"),
  };

  // Send to socket
  game.socket.emit("module.streamelements", res);
  console.log(res);
});