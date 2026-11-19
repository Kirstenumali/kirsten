const { api, escape, token } = Bounty;
const $ = (selector) => document.querySelector(selector);
const status = $("#status");
const MAX_PROGRAM_LINKS = 50;

let planText = "";

async function initialize() {
  if (!token) {
    $("#signin").hidden = false;
    $("#signin-link").href = Bounty.signIn;
    return;
  }

  try {
    const config = await api("/scope-helper");
    $("#scope-form").hidden = false;

    if (config.mode === "ai") {
      $("#helper-mode").textContent =
        "AI review is connected. Add the available program details below.";
      $("#scope-privacy").textContent =
        "Your submitted scope, links, focus area, program rules, eligibility, and disclosure guidance are sent to OpenRouter for analysis. Links are not opened automatically. Your submission is not saved to your account. No scans or target requests are performed.";
      return;
    }

    $("#helper-mode").textContent =
      "Local checklist mode · AI is not connected. You can still organize program details and build a review checklist.";
    $("#scope-privacy").textContent =
      "Your submitted details are processed locally by this server and are not sent to an AI provider or saved to your account. Links are not opened automatically. No scans or target requests are performed.";
  } catch (error) {
    status.textContent = error.message;
    $("#signin").hidden = false;
    $("#signin-link").href = Bounty.signIn;
  }
}

function renderAssets(assets) {
  const assetList = assets
    .map(
      (item) => `
        <li>
          <strong>${escape(item.asset)}</strong>
          <span class="muted"> — ${escape(item.classification)}</span>
        </li>
      `
    )
    .join("");

  return (
    assetList ||
    "<li>No assets could be classified. Confirm eligible assets with the researcher.</li>"
  );
}

function renderList(items) {
  return items.map((item) => `<li>${escape(item)}</li>`).join("");
}

function renderTools(tools) {
  return tools
    .map(
      (item, index) => `
        <article class="panel" style="margin: 18px 0">
          <h3>${index + 1}. ${escape(item.tool)}</h3>
          <ol>
            ${item.steps.map((step) => `<li>${escape(step)}</li>`).join("")}
          </ol>
          <p class="muted"><strong>Save:</strong> ${escape(item.output)}</p>
        </article>
      `
    )
    .join("");
}

function buildPlanText(data) {
  const heading =
    data.mode === "ai"
      ? "AI-generated draft — researcher approval required"
      : "Local checklist — researcher approval required";
  const assets = data.assets.map(
    (item) => `${item.asset} — ${item.classification}`
  );
  const tools = data.tools.map((item, index) => {
    const steps = item.steps
      .map((step, stepIndex) => `${stepIndex + 1}. ${step}`)
      .join("\n");
    return `${index + 1}. ${item.tool}\n${steps}\nSave: ${item.output}`;
  });

  return [
    heading,
    data.readiness,
    data.summary,
    "Guide before you begin",
    ...data.guidance,
    "Program links (not opened)",
    ...data.referenceLinks,
    "Assets and scope boundaries",
    ...assets,
    "Recommended tools and steps",
    ...tools,
    "Questions for the researcher",
    ...data.questions,
  ].join("\n\n");
}

async function submitScope(event) {
  event.preventDefault();
  const links = $("#scope-links").value
    .split(/\r?\n/)
    .map((link) => link.trim())
    .filter(Boolean);
  const linkError = $("#scope-links-error");
  linkError.hidden = true;
  $("#scope-links").removeAttribute("aria-invalid");

  if (links.length > MAX_PROGRAM_LINKS) {
    linkError.textContent = `You entered ${links.length} links. The maximum is ${MAX_PROGRAM_LINKS}; remove ${links.length - MAX_PROGRAM_LINKS} link(s). Your information is still in the form.`;
    linkError.hidden = false;
    $("#scope-links").setAttribute("aria-invalid", "true");
    status.textContent = "Please correct the program links field.";
    return;
  }

  $("#suggest").disabled = true;
  status.textContent = "Reviewing program information…";
  $("#results").hidden = true;

  try {
    const data = await api("/scope-helper", {
      scope: $("#scope-text").value,
      scopeLinks: $("#scope-links").value,
      focusArea: $("#focus-area").value,
      programRules: $("#program-rules").value,
      eligibility: $("#eligibility").value,
      disclosureGuidelines: $("#disclosure-guidelines").value,
    });

    $("#result-mode").textContent =
      data.mode === "ai"
        ? "AI-generated draft · verify with your researcher"
        : "Local checklist · not AI-generated";
    $("#plan-readiness").textContent = data.readiness;
    $("#scope-summary").textContent = data.summary;
    $("#scope-guidance").innerHTML = renderList(data.guidance);
    $("#scope-assets").innerHTML = renderAssets(data.assets);
    $("#scope-suggestions").innerHTML = renderTools(data.tools);
    $("#scope-questions").innerHTML = renderList(data.questions);
    $("#scope-links-provided").innerHTML = renderList(data.referenceLinks);
    $("#approval-link").href = "/easybugs/" + Bounty.suffix;

    planText = buildPlanText(data);
    $("#results").hidden = false;
    status.textContent = data.notice || "Research plan draft ready for review.";
    $("#results").scrollIntoView({ block: "start" });
  } catch (error) {
    status.textContent = error.message;
    if (/program scope links/i.test(error.message)) {
      linkError.textContent = error.message;
      linkError.hidden = false;
      $("#scope-links").setAttribute("aria-invalid", "true");
    }
  } finally {
    $("#suggest").disabled = false;
  }
}

async function copyPlan() {
  try {
    await navigator.clipboard.writeText(planText);
    status.textContent = "Research plan copied.";
  } catch {
    status.textContent =
      "Copy is unavailable. Select the plan text and copy it manually.";
  }
}

$("#scope-form").addEventListener("submit", submitScope);
$("#copy-plan").addEventListener("click", copyPlan);

initialize();
