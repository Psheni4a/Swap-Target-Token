// Макрос для игрока

const controlled = canvas.tokens.controlled;
const targets = Array.from(game.user.targets);

if (controlled.length !== 1) {
  ui.notifications.warn("Выбери ровно один свой токен.");
  return;
}

if (targets.length !== 1) {
  ui.notifications.warn("Назначь ровно одну цель.");
  return;
}

if (!game.modules.get("socketlib")?.active) {
  ui.notifications.error("socketlib не активен.");
  return;
}

if (!game.modules.get("swap-target-token")?.active) {
  ui.notifications.error("Swap Target Token module не активен.");
  return;
}

if (!globalThis.swapTargetToken?.socket) {
  ui.notifications.error("Swap Target Token socket не готов. Перезапусти мир Foundry, не только браузер.");
  return;
}

const selected = controlled[0];
const target = targets[0];

if (selected.id === target.id) {
  ui.notifications.warn("Выбранный токен и цель должны быть разными.");
  return;
}

try {
  await globalThis.swapTargetToken.socket.executeAsGM("swapTokensAsGM", {
    sceneId: canvas.scene.id,
    selectedTokenId: selected.id,
    targetTokenId: target.id,
    userId: game.user.id
  });

  ui.notifications.info("Токены поменялись местами.");
} catch (err) {
  console.error("Swap Target Token | error", err);
  ui.notifications.error(err.message ?? "Не удалось поменять токены местами.");
}