document.addEventListener("DOMContentLoaded", () => {
  const killCountElement = document.getElementById("kill-count");
  const missedCountElement = document.getElementById("missed-count");
  const spider1CountElement = document.getElementById("spider1-count");
  const spider2CountElement = document.getElementById("spider2-count");
  const toggleSpiders = document.getElementById("toggle-spiders");
  const resetButton = document.getElementById("reset-button");

  chrome.storage.sync.get(
    ["spiderKills", "missedSpiders", "spiderTypesKilled", "spidersEnabled"],
    (result) => {
      killCountElement.textContent = result.spiderKills || 0;
      missedCountElement.textContent = result.missedSpiders || 0;
      spider1CountElement.textContent = result.spiderTypesKilled?.spider1 || 0;
      spider2CountElement.textContent = result.spiderTypesKilled?.spider2 || 0;
      toggleSpiders.checked = result.spidersEnabled !== false;
    }
  );

  toggleSpiders.addEventListener("change", () => {
    const spidersEnabled = toggleSpiders.checked;
    chrome.storage.sync.set({ spidersEnabled }, () => {
      console.log(`Spider spawning ${spidersEnabled ? "enabled" : "disabled"}`);
    });
  });

  resetButton.addEventListener("click", () => {
    chrome.storage.sync.set(
      {
        spiderKills: 0,
        missedSpiders: 0,
        spiderTypesKilled: { spider1: 0, spider2: 0 },
      },
      () => {
        killCountElement.textContent = 0;
        missedCountElement.textContent = 0;
        spider1CountElement.textContent = 0;
        spider2CountElement.textContent = 0;
        console.log("All stats reset successfully.");
      }
    );
  });
});
