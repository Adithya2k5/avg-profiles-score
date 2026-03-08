async function calculateScore() {
  const githubUrl = document.getElementById("githubUrl").value.trim();
  const cfHandle = document.getElementById("codeforcesHandle").value.trim();

  if (!githubUrl || !cfHandle) {
    alert("Please enter both GitHub URL and Codeforces handle");
    return;
  }

  try {
    const githubData = await fetchGitHubData(githubUrl);
    const cfRating = await fetchCodeforcesData(cfHandle);

    // Normalize scores
    const githubScore = Math.min(
      ((githubData.repos * 5 + githubData.stars) / 300) * 100,
      100
    );

    const codeforcesScore = Math.min(
      (cfRating / 2000) * 100,
      100
    );

    // Weighted final score
    const finalScore = Math.round(
      githubScore * 0.6 + codeforcesScore * 0.4
    );

    document.getElementById("score").textContent = finalScore;

    let level = "";
    if (finalScore >= 80) level = "Industry Ready Developer";
    else if (finalScore >= 60) level = "Intermediate Developer";
    else level = "Beginner – Needs Improvement";

    document.getElementById("level").textContent = level;
    document.getElementById("result").classList.remove("hidden");

  } catch (error) {
    alert("Error fetching profile data. Check inputs.");
    console.error(error);
  }
}

/* ---------- GitHub API ---------- */
async function fetchGitHubData(profileUrl) {
  const username = profileUrl.split("github.com/")[1];
  const res = await fetch(`https://api.github.com/users/${username}/repos`);

  if (!res.ok) throw new Error("GitHub API error");

  const repos = await res.json();
  let totalStars = 0;

  repos.forEach(repo => {
    totalStars += repo.stargazers_count;
  });

  return {
    repos: repos.length,
    stars: totalStars
  };
}

/* ---------- Codeforces API ---------- */
async function fetchCodeforcesData(handle) {
  const res = await fetch(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );

  if (!res.ok) throw new Error("Codeforces API error");

  const data = await res.json();
  return data.result[0].rating || 0;
}
