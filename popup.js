// Retrieve statistics from Chrome storage and update the dashboard
chrome.storage.sync.get(
  ["spiderKills", "missedSpiders", "spiderTypesKilled"],
  (result) => {
    const killedSpiders = result.spiderKills || 0;
    const missedSpiders = result.missedSpiders || 0;
    const spiderTypesKilled = result.spiderTypesKilled || {
      spider1: 0,
      spider2: 0,
    };

    // Update the HTML with the retrieved stats
    document.getElementById("killedSpiders").innerText = killedSpiders;
    document.getElementById("missedSpiders").innerText = missedSpiders;
    document.getElementById("spider1Kills").innerText =
      spiderTypesKilled.spider1 || 0;
    document.getElementById("spider2Kills").innerText =
      spiderTypesKilled.spider2 || 0;
  }
);
