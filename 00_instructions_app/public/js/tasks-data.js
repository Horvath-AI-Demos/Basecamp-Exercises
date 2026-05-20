const TASKS = [
    {
        id: "step-1",
        title: "Step 1: Fork & Clone Repository",
        subtitle: "Fork the upstream repo to your GitHub account, then clone your fork",
        category: "core",
        points: 10,
        content: `
      <p>Start by forking the inventory management demo app so you have your own copy on GitHub, then clone and create a working branch:</p>
      <h4>Option 1 — Fork + Git (recommended)</h4>
      <ol>
        <li>Go to <a href="https://github.com/beck-source/inventory-management" target="_blank">https://github.com/beck-source/inventory-management</a> and click <strong>Fork</strong> in the top-right corner.</li>
        <li>Clone your fork:
          <pre><code>git clone git@github.com:YOUR_USERNAME/inventory-management.git</code></pre>
        </li>
        <li>Enter the directory and create a working branch:
          <pre><code>cd inventory-management && git checkout -b new_features</code></pre>
        </li>
      </ol>
      <h4>Option 2 — Download ZIP (skips the fork)</h4>
      <p><a href="https://github.com/beck-source/inventory-management" target="_blank">Download the ZIP</a> from the GitHub repo page, unzip, and <code>cd</code> into the directory. Then initialize a branch:</p>
      <pre><code>git init && git add -A && git commit -m "initial commit"
git checkout -b new_features</code></pre>
      <div class="task-note">Option 2 skips the fork step — you won't be able to push to GitHub or use the GitHub App integration in later steps.</div>
    `,
    },
    {
        id: "step-2",
        title: "Step 2: Launch Claude Code",
        subtitle: "What you'll learn: Starting Claude Code, selecting a model",
        category: "core",
        points: 10,
        content: `
      <p>Open your terminal inside the project directory and start Claude Code:</p>
      <pre><code>claude</code></pre>
      <p>Once Claude Code is running, select your preferred model:</p>
      <pre><code>/model</code></pre>
      <p>Choose a model from the list. For this workshop, any model works well.</p>
    `,
    },
    {
        id: "step-3",
        title: "Step 3: Run Inventory Management Locally",
        subtitle:
            "What you'll learn: Using Claude Code to install dependencies and start dev servers",
        category: "core",
        points: 15,
        content: `
      <p>Paste the following prompt into Claude Code:</p>
      <pre><code>Install dependencies and start the development servers and open up the frontend and backend in my respective browser windows.</code></pre>
      <p>Claude will:</p>
      <ul>
        <li>Install npm dependencies for the Vue 3 frontend (<code>cd client && npm install</code>)</li>
        <li>Install Python dependencies for the FastAPI backend (<code>cd server && uv sync</code>)</li>
        <li>Start the backend server on port 8001</li>
        <li>Start the frontend dev server on port 3000</li>
      </ul>
      <p>Once both servers are running, open <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> in your browser, and inspect the app.</p>
      <div style="margin:1rem 0"><img src="/assets/step_3_dashboard.png" alt="Inventory Management Dashboard" style="width:50%;border-radius:var(--radius);border:1px solid var(--light-gray);box-shadow:var(--shadow-md)"></div>
      <p>Explore the app for a few minutes. Click through the pages to get familiar with what's there:</p>
      <ul>
        <li><strong>Dashboard</strong> — KPI cards, revenue charts, order summaries</li>
        <li><strong>Inventory</strong> — Stock levels across warehouses</li>
        <li><strong>Orders</strong> — Order tracking with status filters</li>
        <li><strong>Spending</strong> — Spending analytics and breakdowns</li>
        <li><strong>Demand</strong> — Demand forecasting with trends</li>
        <li><strong>Backlog</strong> — Backlog monitoring</li>
      </ul>
      <div class="task-note">Note: this app intentionally has some bugs planted for us to fix :)</div>
    `,
    },
    {
        id: "step-4",
        title: "Step 4: Edit the CLAUDE.md File",
        subtitle:
            "What you'll learn: Project context files, @-file mentions, ways to edit instructions and Claude's persistent memory systems",
        category: "core",
        points: 15,
        content: `
      <p>The Catalyst Components project should have a <code>CLAUDE.md</code> file that gives Claude persistent instructions about the project — coding conventions, system architecture, technology stacks and rules to follow. This repo already has one.</p>
      <div class="task-tip">If you're starting a fresh project without a CLAUDE.md, run <code>/init</code> to generate one automatically.</div>
      <h4>Using @-file mentions</h4>
      <p>You can reference any file in your prompts using <code>@</code>. Try it:</p>
      <pre><code>Print out exactly what is in @CLAUDE.md</code></pre>
      <p>Claude reads the file and prints its contents. The <code>@</code> syntax works for any file in your project.</p>
      <h4>Three ways to edit the CLAUDE.md file</h4>
      <p><strong>Method 1 — Use <code>#</code> Memory Mode (recommended)</strong></p>
      <p>Press <code>#</code> at the prompt to enter Memory Mode. This lets you write directly to CLAUDE.md without consuming any tokens — Claude doesn't need to process the request.</p>
      <pre><code># Always document non-obvious logic changes with comments</code></pre>
      <p><strong>Method 2 — Edit directly in your editor</strong></p>
      <p>Open <code>CLAUDE.md</code> in your text editor (VSCode, vim, etc.) and make changes. Also zero token cost.</p>
      <p><strong>Method 3 — Prompt Claude to edit it</strong></p>
      <pre><code>Edit my CLAUDE.md file to add "Always document non-obvious logic changes with comments"</code></pre>
      <p>Claude opens the file, adds the instruction, and saves it.</p>
      <div class="task-note">Methods 1 and 2 are free — no tokens consumed. Method 3 uses tokens since Claude processes the request and makes the edit. Use Method 3 when you want Claude to decide how to organize or word the instruction.</div>
      <h4>Persistent memory systems</h4>
      <p>Claude has 2 persistent memory systems but ultimately the record ends up in the same place — the <code>./.claude/CLAUDE.md</code> (personal):</p>
      <p><code>/CLAUDE.md</code> markdown files with persistent instructions that load automatically:</p>
      <table style="width:100%;border-collapse:collapse;font-size:0.88rem;margin:0.75rem 0 0.5rem">
        <tr style="border-bottom:1px solid var(--light-gray);background:rgba(232,230,220,0.3)">
          <th style="padding:0.5rem 0.75rem;text-align:left;font-weight:600;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.04em;color:var(--mid-gray)">File</th>
          <th style="padding:0.5rem 0.75rem;text-align:left;font-weight:600;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.04em;color:var(--mid-gray)">Scope</th>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem"><code>./CLAUDE.md</code></td>
          <td style="padding:0.5rem 0.75rem">Project (shared via git)</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem"><code>./.claude/rules/*.md</code></td>
          <td style="padding:0.5rem 0.75rem">Topic-specific rules</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem"><code>./.claude/CLAUDE.md</code></td>
          <td style="padding:0.5rem 0.75rem">Personal, all projects</td>
        </tr>
        <tr>
          <td style="padding:0.5rem 0.75rem"><code>./CLAUDE.local.md</code></td>
          <td style="padding:0.5rem 0.75rem">Personal, this project only</td>
        </tr>
      </table>
      <p><code>/memory</code> command which writes to your personal <code>./.claude/CLAUDE.md</code> and is faster for capturing preferences on the fly.</p>
    `,
    },
    {
        id: "step-5",
        title: "Step 5: Explore the Codebase",
        subtitle:
            "What you'll learn: Using Claude Code to understand and visualize a codebase",
        category: "core",
        points: 20,
        content: `
      <p>Ask Claude to investigate the project and generate an architecture overview:</p>
      <pre><code>I want to understand this codebase. Investigate the project and create a simple, professional HTML-based architecture page showing the system architecture, tech stack, and data flow. Then open the file in a browser window.</code></pre>
      <p>Claude will:</p>
      <ul>
        <li>Explore the directory structure</li>
        <li>Read key files to understand the architecture</li>
        <li>Generate an HTML page with a visual diagram showing the Vue 3 frontend, FastAPI backend, and JSON data flow</li>
        <li>Open the file in your browser</li>
      </ul>
      <p>This demonstrates how Claude Code can quickly onboard you to an unfamiliar codebase.</p>
    `,
    },
    {
        id: "step-6",
        title: "Step 6: Build a Feature",
        subtitle:
            "What you'll learn: Plan Mode (Shift+Tab), iterative development, interactive feedback",
        category: "core",
        points: 30,
        content: `
      <p>This is the core of the workshop. You'll use Plan Mode to have Claude design a feature before implementing it, then iterate on the result.</p>
      <h4>Enter Plan Mode</h4>
      <p>Press <strong>Shift+Tab</strong> to switch Claude into Plan Mode. In Plan Mode, Claude proposes a plan and waits for your approval before writing any code.</p>
      <p>Choose one of the two feature options below.</p>
      <h4>Option A: Budget-Based Restocking Tool</h4>
      <p>Build a new tab that recommends which items to restock based on a budget, using demand forecast data.</p>
      <p>Paste this prompt:</p>
      <pre><code>Build a new "Restocking" tab in the app. It should have:
1. A budget slider that lets the user set their available budget
2. Based on the budget, recommend items from the demand forecast to restock
3. A "Place Order" button that submits the restocking order
4. The submitted order should appear in the existing Orders tab with a new "Submitted Orders" section showing delivery lead time

Use the AskUserQuestion tool!</code></pre>
      <p>Claude will present a plan. Review it — when it looks good, accept the plan and let Claude implement it.</p>
      <div class="task-note">Claude may ask you clarifying questions using the AskUserQuestion tool (e.g., "Should the budget slider range from $0–$50,000 or should I determine the range from the data?"). Answer these as they come up.</div>
      <p>Test the feature in your browser once Claude finishes. You may notice things aren't perfect!</p>
      <p>Then iterate: choose what you'd like to work on next.</p>
      <div class="task-tip"><strong>Pro Tip:</strong> Claude is an intelligent thought partner
        <ul style="margin:0.5rem 0 0 1.25rem;list-style:disc">
          <li>Can help plan, discover, ideate and design across the SDLC</li>
          <li>Can help identify biases, identify gaps and support critical thinking</li>
          <li>Can review, document, architect and draft visual diagrams</li>
          <li>Can check screenshots by pasting them into the conversation (ctrl + v)</li>
        </ul>
      </div>
      <h4>Option B: SaaS-Style UI Redesign</h4>
      <p>Transform the app's interface from a basic layout into a polished, modern SaaS-style design using a reusable Claude Code skill.</p>
      <p><strong>Part 1 — Create the skill</strong></p>
      <pre><code>I want to build a skill that redesigns a Vue 3 application's UI into a modern SaaS-style interface with a vertical navigation sidebar on the left instead of a top nav bar, consistent spacing, and a polished professional look.</code></pre>
      <p>Claude will ask follow-up questions to build the skill. Answer them to shape the skill's behavior.</p>
      <p><strong>Part 2 — Apply the skill</strong></p>
      <pre><code>Use the frontend-design skill to redesign this inventory management app into a modern SaaS-style interface with:
1. Vertical navigation bar on the left side instead of the top
2. Clean, modern card layouts
3. Professional SaaS aesthetic

Use the AskUserQuestion tool!</code></pre>
      <p>Claude presents a plan. Accept it and let the implementation run.</p>
      <p>Then iterate:</p>
      <pre><code>Add a collapsible sidebar with icons-only mode for smaller screens.</code></pre>
      <div class="task-tip">When Claude's plan looks good, accept it and wait for the implementation to complete. Then test the changes in your browser at <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.</div>
    `,
    },
    {
        id: "step-7",
        title: "Step 7: Context Management",
        subtitle:
            "What you'll learn: Managing the context window during long sessions",
        category: "core",
        points: 10,
        content: `
      <p>After building a feature, your context window may be filling up. Claude Code provides tools to manage this.</p>
      <h4>Check context usage:</h4>
      <pre><code>/context</code></pre>
      <p>This shows a breakdown of how much context is being used by your conversation, files, and tools.</p>
      <h4>Compact the context:</h4>
      <pre><code>/compact</code></pre>
      <p>This summarizes the conversation so far and clears older context, freeing up space for new work. Claude retains the key information.</p>
      <p>You can also pass an instruction to <code>/compact</code> to tell Claude what to prioritize when summarizing:</p>
      <pre><code>/compact keep the details of the restocking feature</code></pre>
      <p>This ensures important context (like a feature you're actively building) survives the compaction.</p>
    `,
    },
    {
        id: "step-8",
        title: "Step 8: Add Playwright MCP",
        subtitle:
            "What you'll learn: MCP (Model Context Protocol), installing MCP servers",
        category: "core",
        points: 15,
        content: `
      <p>MCP servers give Claude the ability to connect to external tools — things like browser automation, database access, or API integrations. Think of them as a connector protocol that extends what Claude can do beyond operating within the confines of your local machine. (<a href="https://code.claude.com/docs/en/mcp" target="_blank">Learn more about MCP</a>)</p>
      <p>Enter Bash mode by pressing <code>!</code>, then run:</p>
      <pre><code>! claude mcp add playwright npx @playwright/mcp@latest</code></pre>
      <p>This installs the Playwright MCP server, which gives Claude the ability to control a browser.</p>
    `,
    },
    {
        id: "step-9",
        title: "Step 9: Use Playwright MCP to Test",
        subtitle:
            "What you'll learn: Context budget awareness, browser testing via MCP",
        category: "core",
        points: 20,
        content: `
      <p>Restart Claude Code to pick up the MCP configuration:</p>
      <pre><code>/exit

claude</code></pre>
      <p>Now check the context impact:</p>
      <pre><code>/context</code></pre>
      <p>Notice how MCP servers consume some context budget for their tool definitions. This is a useful thing to be aware of when working with multiple MCP servers.</p>
      <div class="task-note">This repo already has Playwright configured in <code>.mcp.json</code>, but we teach the install process here so you know how to add MCP servers to your own projects.</div>
      <p>Verify the MCP server is loaded:</p>
      <pre><code>/mcp</code></pre>
      <p>You should see <code>playwright</code> listed.</p>
      <p>Now use Playwright to test the app by pasting this into Claude Code:</p>
      <pre><code>Use Playwright MCP to test the app:
1. Start the development servers
2. Navigate to localhost:3000
3. Take a screenshot of the dashboard
4. Click through the main navigation tabs and verify each page loads</code></pre>
      <p>Claude will launch a browser, navigate through the app, take screenshots, and report what it finds. If anything looks wrong, keep iterating:</p>
      <div class="task-tip"><strong>Pro Tip:</strong> Claude is an amazing teacher and can help troubleshoot most technical roadblocks
        <ul style="margin:0.5rem 0 0 1.25rem;list-style:disc">
          <li>Install, manage and handle package dependencies</li>
          <li>Troubleshoot errors and debug applications</li>
          <li>Run bash commands & git for source control and integrate with your CI/CD</li>
        </ul>
      </div>
      <p>Then iterate: choose what you'd like to work on next.</p>
    `,
    },
    {
        id: "step-github-app",
        title: "Step 10: Connect Claude Code to GitHub",
        subtitle: "What you'll learn: Installing the GitHub App, enabling @claude on your repo",
        category: "core",
        points: 15,
        content: `
      <p>The GitHub App connects Claude Code to your GitHub account so Claude can read and write pull requests, review code, and be triggered from the cloud. Install it now so it's active when you open your PR in the next step.</p>
      <h4>1. Run the install command</h4>
      <p>Inside Claude Code, run:</p>
      <pre><code>/install-github-app</code></pre>
      <p>Claude will prompt you to select which GitHub workflows to install. Enable both:</p>
      <ul>
        <li><strong>@Claude Code</strong> — tag <code>@claude</code> in issues and PR comments to get Claude's help</li>
        <li><strong>Claude Code Review</strong> — automated code review on every new PR</li>
      </ul>
      <p>Follow the browser flow to authorize the GitHub App on your forked <code>inventory-management</code> repo.</p>
      <h4>2. Merge the @claude PR</h4>
      <p>After the command completes, Claude creates a pre-filled PR that adds the GitHub Actions workflow files to your repo. Open that PR in your browser and <strong>merge it</strong>.</p>
      <p>Once merged, Claude is live on your fork:</p>
      <ul>
        <li>If you enabled <strong>Claude Code Review</strong> — any new PR will trigger an automatic code review comment</li>
        <li>If you enabled <strong>@Claude Code</strong> — tag <code>@claude</code> in any issue or PR comment to invoke Claude on demand</li>
      </ul>
      <div class="task-note">Make sure you forked the repo in Step 1 — the GitHub App needs to be authorized on <em>your</em> fork, not the upstream.</div>
    `,
    },
    {
        id: "step-10",
        title: "Step 11: Commit, Push & Open a PR",
        subtitle: "What you'll learn: Git operations through Claude Code, @claude PR review in action",
        category: "core",
        points: 20,
        content: `
      <p>Now commit your feature work, push the branch, and open a pull request. Because you merged the <code>@claude</code> workflow in the previous step, Claude will automatically review your PR.</p>
      <pre><code>Commit the changes you've made in this branch, push the branch to GitHub, and open a pull request.</code></pre>
      <p>Claude will stage the changes, write a descriptive commit message, push the branch to your fork, and open a PR.</p>
      <p>Open the PR in your browser — within a minute you should see Claude post an automated code review comment.</p>
      <div class="task-tip">You can also tag <code>@claude</code> in any PR comment to ask a follow-up question or request a specific change.</div>
      <p><strong>Merge your PR before moving to the next step.</strong></p>
    `,
    },
    {
        id: "step-11",
        title: "Step 12: Advanced Workflows",
        subtitle: "Skills, subagents, hooks, plugins, agent teams, and worktrees",
        category: "core",
        points: 25,
        content: `
      <p>The steps above cover the core tutorial. Below are five powerful Claude Code features you can explore in the remaining time. Click a tab to learn more and try each one.</p>

      <div class="adv-tabs">
        <button class="adv-tab active" onclick="(function(btn){btn.parentElement.querySelectorAll('.adv-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');btn.closest('.adv-tabs').nextElementSibling.querySelectorAll('.adv-panel').forEach(p=>p.classList.remove('active'));btn.closest('.adv-tabs').nextElementSibling.querySelector('[data-tab=&quot;'+btn.dataset.tab+'&quot;]').classList.add('active')})(this)" data-tab="skills">Skills</button>
        <button class="adv-tab" onclick="(function(btn){btn.parentElement.querySelectorAll('.adv-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');btn.closest('.adv-tabs').nextElementSibling.querySelectorAll('.adv-panel').forEach(p=>p.classList.remove('active'));btn.closest('.adv-tabs').nextElementSibling.querySelector('[data-tab=&quot;'+btn.dataset.tab+'&quot;]').classList.add('active')})(this)" data-tab="subagents">Subagents</button>
        <button class="adv-tab" onclick="(function(btn){btn.parentElement.querySelectorAll('.adv-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');btn.closest('.adv-tabs').nextElementSibling.querySelectorAll('.adv-panel').forEach(p=>p.classList.remove('active'));btn.closest('.adv-tabs').nextElementSibling.querySelector('[data-tab=&quot;'+btn.dataset.tab+'&quot;]').classList.add('active')})(this)" data-tab="hooks">Hooks</button>
        <button class="adv-tab" onclick="(function(btn){btn.parentElement.querySelectorAll('.adv-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');btn.closest('.adv-tabs').nextElementSibling.querySelectorAll('.adv-panel').forEach(p=>p.classList.remove('active'));btn.closest('.adv-tabs').nextElementSibling.querySelector('[data-tab=&quot;'+btn.dataset.tab+'&quot;]').classList.add('active')})(this)" data-tab="plugins">Plugins</button>
        <button class="adv-tab" onclick="(function(btn){btn.parentElement.querySelectorAll('.adv-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');btn.closest('.adv-tabs').nextElementSibling.querySelectorAll('.adv-panel').forEach(p=>p.classList.remove('active'));btn.closest('.adv-tabs').nextElementSibling.querySelector('[data-tab=&quot;'+btn.dataset.tab+'&quot;]').classList.add('active')})(this)" data-tab="agent-teams">Agent Teams</button>
        <button class="adv-tab" onclick="(function(btn){btn.parentElement.querySelectorAll('.adv-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');btn.closest('.adv-tabs').nextElementSibling.querySelectorAll('.adv-panel').forEach(p=>p.classList.remove('active'));btn.closest('.adv-tabs').nextElementSibling.querySelector('[data-tab=&quot;'+btn.dataset.tab+'&quot;]').classList.add('active')})(this)" data-tab="worktrees">Worktrees</button>
      </div>

      <div class="adv-panels">
        <!-- Skills -->
        <div class="adv-panel active" data-tab="skills">
          <h4>Skills — Reusable instruction sets</h4>
          <p>Skills are reusable instruction sets that teach Claude specialized tasks — like playbooks for specific domains.</p>
          <p><strong>When to use:</strong></p>
          <ul>
            <li>Standardizing team workflows</li>
            <li>Creating repeatable processes</li>
            <li>Domain-specific code generation</li>
          </ul>
          <div class="adv-tryit">
            <div class="adv-tryit-toggle" onclick="this.parentElement.classList.toggle('open')">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 10 13 14 9"/></svg>
              Try it
            </div>
            <div class="adv-tryit-body">
              <p>Create a Vue component analysis skill:</p>
              <pre><code>I want to build a skill that analyzes Vue component structure and suggests optimizations for performance and code reuse</code></pre>
              <p>Answer Claude's follow-up questions to define the skill's scope and behavior. Claude will build and test the skill for you.</p>
            </div>
          </div>
          <p style="margin-top:0.75rem;font-size:0.85rem"><a href="https://docs.anthropic.com/en/docs/claude-code/skills" target="_blank">Skills documentation &rarr;</a></p>
        </div>

        <!-- Subagents -->
        <div class="adv-panel" data-tab="subagents">
          <h4>Subagents — Specialized Claude agents</h4>
          <p>Specialized Claude agents scoped to specific tasks. Delegate complex subtasks to focused specialists.</p>
          <p><strong>When to use:</strong></p>
          <ul>
            <li>Code review and security auditing</li>
            <li>Debugging and domain-specific analysis</li>
            <li>Any task that benefits from a focused agent</li>
          </ul>
          <div class="adv-tryit">
            <div class="adv-tryit-toggle" onclick="this.parentElement.classList.toggle('open')">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 10 13 14 9"/></svg>
              Try it
            </div>
            <div class="adv-tryit-body">
              <p>Create a Debugger subagent:</p>
              <pre><code>Create a new Debugger subagent that specializes in investigating runtime errors, reading stack traces, and suggesting fixes. It should have access to Read, Grep, Glob, and Bash tools.</code></pre>
              <p>Then test it:</p>
              <pre><code>Use the debugger agent to investigate any console errors on the Dashboard page.</code></pre>
            </div>
          </div>
          <p style="margin-top:0.75rem;font-size:0.85rem"><a href="https://docs.anthropic.com/en/docs/claude-code/sub-agents" target="_blank">Subagents documentation &rarr;</a></p>
        </div>

        <!-- Hooks -->
        <div class="adv-panel" data-tab="hooks">
          <h4>Hooks — Automated event responses</h4>
          <p>Shell commands that run automatically in response to Claude Code events (file edits, tool calls, etc.).</p>
          <p><strong>When to use:</strong></p>
          <ul>
            <li>Auto-formatting on save</li>
            <li>Logging tool usage</li>
            <li>Enforcing code standards and pre-commit checks</li>
          </ul>
          <div class="adv-tryit">
            <div class="adv-tryit-toggle" onclick="this.parentElement.classList.toggle('open')">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 10 13 14 9"/></svg>
              Try it
            </div>
            <div class="adv-tryit-body">
              <p>Install Prettier and add a formatting hook:</p>
              <pre><code>npm install --save-dev prettier</code></pre>
              <p>Configure the hook using <code>/hooks</code> or add it manually to <code>~/.claude/settings.json</code>:</p>
              <pre><code>{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}</code></pre>
              <p>Test it:</p>
              <pre><code>Add an extra function to api.js with deliberately messy formatting</code></pre>
              <p>The hook should automatically clean it up after Claude writes the file.</p>
            </div>
          </div>
          <p style="margin-top:0.75rem;font-size:0.85rem"><a href="https://docs.anthropic.com/en/docs/claude-code/hooks" target="_blank">Hooks documentation &rarr;</a></p>
        </div>

        <!-- Plugins -->
        <div class="adv-panel" data-tab="plugins">
          <h4>Plugins — Community-built workflow packages</h4>
          <p>Community-built packages that bundle slash commands, skills, and conventions into installable workflows.</p>
          <p><strong>When to use:</strong></p>
          <ul>
            <li>Adopting team/org-wide workflows</li>
            <li>Standardizing CI/CD patterns</li>
            <li>Adding domain-specific commands</li>
          </ul>
          <div class="adv-tryit">
            <div class="adv-tryit-toggle" onclick="this.parentElement.classList.toggle('open')">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 10 13 14 9"/></svg>
              Try it
            </div>
            <div class="adv-tryit-body">
              <p>Browse and add a plugin from the marketplace:</p>
              <pre><code>/plugin marketplace add https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock</code></pre>
              <p>Install a specific workflow:</p>
              <pre><code>/plugin install epcc-workflow</code></pre>
              <p>Use the plugin's workflow:</p>
              <pre><code>/epcc-code Add a CSV export button to the inventory page</code></pre>
            </div>
          </div>
          <p style="margin-top:0.75rem;font-size:0.85rem"><a href="https://docs.anthropic.com/en/docs/claude-code/plugins" target="_blank">Plugins documentation &rarr;</a></p>
        </div>

        <!-- Agent Teams -->
        <div class="adv-panel" data-tab="agent-teams">
          <h4>Agent Teams — Coordinated multi-agent workflows</h4>
          <p>Coordinate multiple Claude Code instances working together as a team. Unlike subagents which report back to one parent, teammates share a task list, investigate independently, and message each other directly.</p>
          <p><strong>When to use:</strong></p>
          <ul>
            <li>Research and review from multiple perspectives simultaneously</li>
            <li>Debugging with competing hypotheses that agents debate</li>
            <li>Cross-layer work (frontend, backend, tests) each owned by a different teammate</li>
          </ul>
          <div class="adv-tryit">
            <div class="adv-tryit-toggle" onclick="this.parentElement.classList.toggle('open')">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 10 13 14 9"/></svg>
              Try it
            </div>
            <div class="adv-tryit-body">
              <p>First, enable agent teams (experimental feature). Paste into Claude Code:</p>
              <pre><code>/config</code></pre>
              <p>Select <strong>Edit settings</strong> and add the experimental flag:</p>
              <pre><code>{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}</code></pre>
              <p>Then restart Claude Code and try this:</p>
              <pre><code>Create an agent team with 3 teammates to audit this inventory management app from different angles:
- Security Auditor: find vulnerabilities (injection, auth issues, data exposure)
- Performance Analyst: find bottlenecks (slow queries, unnecessary re-renders, large payloads)
- UX Reviewer: find usability issues (accessibility, responsive design, error handling)

Have them investigate in parallel, share findings with each other, and challenge each other's severity ratings. Produce a single prioritized action plan at the end.</code></pre>
              <p>Watch the teammates coordinate — use <strong>Shift+Down</strong> to cycle between agents and see their individual progress. The lead synthesizes their findings into a final report.</p>
            </div>
          </div>
          <p style="margin-top:0.75rem;font-size:0.85rem"><a href="https://code.claude.com/docs/en/agent-teams" target="_blank">Agent Teams documentation &rarr;</a></p>
        </div>

        <!-- Worktrees -->
        <div class="adv-panel" data-tab="worktrees">
          <h4>Worktrees — Isolated parallel branches</h4>
          <p>Isolated git branches that let Claude work on a separate copy of your repo without touching your current work.</p>
          <p><strong>When to use:</strong></p>
          <ul>
            <li>Parallel feature development</li>
            <li>Exploratory changes you might discard</li>
            <li>Running experiments while keeping main work clean</li>
          </ul>
          <div class="adv-tryit">
            <div class="adv-tryit-toggle" onclick="this.parentElement.classList.toggle('open')">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 10 13 14 9"/></svg>
              Try it
            </div>
            <div class="adv-tryit-body">
              <p>Use a worktree to prototype a feature without affecting your current branch:</p>
              <pre><code>Use a worktree to prototype a dark mode toggle for the app without affecting my current branch. Create the feature, test it, and show me the result.</code></pre>
              <p>Claude will create an isolated copy of the repo, make changes there, and leave your working branch untouched.</p>
            </div>
          </div>
          <p style="margin-top:0.75rem;font-size:0.85rem"><a href="https://git-scm.com/docs/git-worktree" target="_blank">Worktrees documentation &rarr;</a></p>
        </div>
      </div>
    `,
    },
    {
        id: "expert-bugbounty",
        title: "Expert Challenge: Bug Bounty — Fix the Reports Page",
        subtitle: "Discover and fix multiple hidden bugs using Claude Code",
        category: "bonus",
        points: 25,
        content: `
      <p>Your mission: The Reports page has multiple bugs hiding in plain sight. Your job is to discover them visually, then use Claude Code to identify and fix them all.</p>
      <h4>Step 1: Discover the bugs (~2 minutes)</h4>
      <p>With the app running at <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>, investigate the Reports page:</p>
      <ul>
        <li>Switch the language using the language switcher in the top-right corner. Navigate through the app's pages. Notice anything different about the Reports page?</li>
        <li>Try the filters. Set a Time Period filter (e.g., "January") or a Warehouse filter (e.g., "San Francisco"). Check each page. Does the Reports page respond?</li>
        <li>Open your browser's DevTools (F12 or Cmd+Option+I) and check the Console tab. Click around the Reports page. What do you see?</li>
      </ul>
      <p>You should have found at least 3 distinct categories of bugs just from visual inspection.</p>
      <h4>Step 2: Fix the bugs with Claude Code (~3-5 minutes)</h4>
      <p>Now paste this prompt into Claude Code:</p>
      <pre><code>The Reports page (/reports) has multiple bugs compared to the rest of the app. I found that:
1. It doesn't translate to Japanese when I switch languages
2. It ignores the global filter bar
3. It spams the browser console with debug logs
Investigate the Reports page code, identify ALL the issues (there are more than these 3), and fix them. Look at how other pages like Dashboard and Orders are implemented for reference.</code></pre>
      <p>Claude will:</p>
      <ul>
        <li>Read <code>Reports.vue</code> and compare it with working pages like <code>Dashboard.vue</code></li>
        <li>Identify all the bugs (there are 8+ issues)</li>
        <li>Refactor the component to match the patterns used in the rest of the app</li>
        <li>Fix the "Reports" nav tab translation in <code>App.vue</code></li>
      </ul>
      <p>Verify the fixes by refreshing <a href="http://localhost:3000/reports" target="_blank">http://localhost:3000/reports</a> and checking:</p>
      <ul>
        <li>Language switching works</li>
        <li>Filters update the data</li>
        <li>No more <code>console.log</code> spam</li>
        <li>Code follows Composition API patterns</li>
      </ul>
      <h4>Stretch Goal</h4>
      <p>Fix the Backlog page (<code>/backlog</code>) — it has the same i18n problem. All its strings are hardcoded in English instead of using the <code>t()</code> translation function.</p>
    `,
    },
    {
        id: "free-build",
        title: "Go Further: Make It Yours",
        subtitle: "You've got the fundamentals — now build something real",
        category: "bonus",
        points: 0,
        content: `
      <p>You've covered the full Claude Code workflow: exploring a codebase, shipping features, writing tests, reviewing PRs, and integrating with GitHub. That's the foundation. Now it's time to go off-script.</p>
      <h4>Ideas to get you started</h4>
      <ul>
        <li><strong>Add a new feature</strong> — low-stock alerts, a search bar, an export-to-CSV button, a dark mode toggle. Ask Claude to implement it end-to-end.</li>
        <li><strong>Restyle the app</strong> — change the colour palette, swap fonts, redesign the nav. Try: <em>"Redesign the app with a dark navy and orange theme."</em></li>
        <li><strong>Improve the data model</strong> — add supplier tracking, product categories, or a simple audit log. Let Claude write the migrations and wire up the UI.</li>
        <li><strong>Extend the tests</strong> — ask Claude to increase coverage, add edge cases, or set up a CI workflow with GitHub Actions.</li>
        <li><strong>Break something on purpose</strong> — introduce a bug and see how quickly Claude can find and fix it with a single prompt.</li>
      </ul>
      <h4>How to approach it</h4>
      <p>Describe what you want in plain language. Claude will read the codebase, plan the changes, and implement them. Push back if the output isn't right — iterate just like you would with a teammate.</p>
      <div class="task-tip">There's no wrong answer here. The goal is to get a feel for what Claude Code can do when you give it real, open-ended problems.</div>
      <div class="task-tip"><strong>Go deeper:</strong> Check out the <a href="https://code.claude.com/docs/en/best-practices" target="_blank">Claude Code best practices guide</a> for tips on prompt patterns, CLAUDE.md setup, agentic workflows, and more.</div>
    `,
    },
];

const TOTAL_POSSIBLE_POINTS = TASKS.reduce((sum, t) => sum + t.points, 0);
const CORE_TASKS = TASKS.filter((t) => t.category === "core");
const BONUS_TASKS = TASKS.filter((t) => t.category === "bonus");
const CORE_TOTAL_POINTS = CORE_TASKS.reduce((sum, t) => sum + t.points, 0);

// Pinned reference — not a task, not scored
const REFERENCE_CONTENT = {
    title: "Troubleshooting & Keyboard Shortcuts",
    content: `
      <h4>Troubleshooting</h4>
      <table style="width:100%;border-collapse:collapse;font-size:0.88rem;margin-bottom:1.25rem">
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600;width:40%">Something broke and you're stuck</td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Copy the full error message and paste it into Claude Code</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600">Claude can't see what's on screen</td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Take a screenshot and paste it (Ctrl+V / Cmd+V)</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600">Claude's response doesn't work</td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Iterate: describe what went wrong and what you expected</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600">Claude is struggling with complexity</td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Try <code>think harder</code> or <code>ultrathink</code> to trigger extended thinking</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600">Need to see the full conversation</td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Press <code>Ctrl+O</code> to open the transcript viewer</td>
        </tr>
        <tr>
          <td style="padding:0.5rem 0.75rem;font-weight:600">Servers won't start</td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Run <code>/start</code> or manually kill ports: <code>lsof -ti:3000,8001 | xargs kill</code></td>
        </tr>
      </table>
      <h4>Keyboard Shortcuts</h4>
      <table style="width:100%;border-collapse:collapse;font-size:0.88rem">
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600;width:40%"><code>Enter</code></td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Approve a tool action</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600"><code>Escape</code></td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Deny / cancel</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600"><code>Shift+Tab</code></td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Toggle Plan Mode</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600"><code>!</code></td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Enter Bash mode (run shell commands)</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600"><code>#</code></td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Enter Memory mode</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600"><code>@</code></td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Reference a file</td>
        </tr>
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:0.5rem 0.75rem;font-weight:600"><code>Ctrl+O</code></td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Open transcript viewer</td>
        </tr>
        <tr>
          <td style="padding:0.5rem 0.75rem;font-weight:600"><code>Ctrl+C</code></td>
          <td style="padding:0.5rem 0.75rem;color:var(--dark)">Interrupt Claude</td>
        </tr>
      </table>
      <h4 style="margin-top:1.25rem">Resources</h4>
      <ul>
        <li><a href="https://docs.anthropic.com/en/docs/claude-code" target="_blank">Claude Code Documentation</a></li>
        <li><a href="https://anthropic.skilljar.com/claude-code-in-action" target="_blank">Claude Code Video Course</a></li>
        <li><a href="https://docs.anthropic.com/en/docs/claude-code/best-practices" target="_blank">Claude Code Best Practices</a></li>
      </ul>
    `,
};
