console.log("Swap Target Token | module.js loaded");

async function swapTokensAsGM(data) {
  const { sceneId, selectedTokenId, targetTokenId, userId } = data;

  const user = game.users.get(userId);
  if (!user) throw new Error("User not found.");

  const scene = game.scenes.get(sceneId);
  if (!scene) throw new Error("Scene not found.");

  const selected = scene.tokens.get(selectedTokenId);
  const target = scene.tokens.get(targetTokenId);

  if (!selected || !target) {
    throw new Error("One or both tokens were not found.");
  }

  if (selected.id === target.id) {
    throw new Error("Selected token and target token must be different.");
  }

  if (!selected.testUserPermission(user, "OWNER")) {
    throw new Error("You do not own the selected token.");
  }

  await scene.updateEmbeddedDocuments("Token", [
    {
      _id: selected.id,
      x: target.x,
      y: target.y
    },
    {
      _id: target.id,
      x: selected.x,
      y: selected.y
    }
  ]);

  return true;
}

Hooks.once("socketlib.ready", () => {
  console.log("Swap Target Token | socketlib.ready");

  const socket = socketlib.registerModule("swap-target-token");
  socket.register("swapTokensAsGM", swapTokensAsGM);

  globalThis.swapTargetToken = { socket };

  console.log("Swap Target Token | ready", globalThis.swapTargetToken);
});