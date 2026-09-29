## Portfolio pages

- Keep the site static and hand-editable: semantic HTML, plain CSS, and browser JavaScript.
- Do not add a backend, server, framework, build step, package manager, content loader, or scripts to start the portfolio unless I ask.
- When creating or updating a project page, only edit that project's page and files used only by that page, such as its CSS, JavaScript, and screenshots. Do not change the homepage, project cards or links, shared styles or scripts, navigation, blog, sitemap, or other projects unless I ask.
- Follow the existing portfolio styles. Keep markup and CSS readable. Use the installed `frontend-design` skill when creating or substantially redesigning a page.
- Make every project page responsive and usable on mobile, tablet, and desktop screen sizes.
- Create detailed project pages only for projects I say are ready. Leave other projects as clearly labeled cards without links to empty pages. If linking a ready page requires changing the homepage or another out-of-scope file, leave that change for me and tell me what's needed.
- Before creating a page, inspect the featured project and use its existing way to open and run it. Do not change the featured project, install dependencies, or add setup/run scripts or other tooling. If it cannot run with its existing setup, tell me what is missing and ask before changing the setup.
- Use the screenshots I provide in that project's folder. Include them on the project page with useful alt text and captions where helpful. Do not generate or substitute screenshots; tell me if a needed screenshot is missing.
- Use Lenis for smooth scrolling and restrained motion effects when it can be included without a package manager, build step, or changes to shared site files. Keep any page-specific setup with that page and respect `prefers-reduced-motion`.
- Put each project's update timeline directly in its HTML as an ordered list.
- Use a `<time datetime="YYYY-MM-DD">` for each dated update.
- Do not invent project details or update dates. Ask if a fact or date is missing.

### Project-page workflow

- Before building, inspect the project's supplied assets, available source, and existing way to open or run it. If the source or demo is unavailable, build only from the supplied material and state what could not be verified; do not add a server, setup script, or dependencies.
- For a substantial new page, use the `frontend-design` skill to set a compact palette, type system, and layout direction before writing code. Give each project its own visual identity while keeping it legible as part of this portfolio; do not copy another project's page design by default.
- Keep the page hand-editable. Use the provided project images, descriptive filenames, useful alt text, and short captions. Never turn screenshot filenames or capture dates into project milestones unless Fernando confirms those dates.
- After the first page draft, use three focused subagent passes when available: (1) a read-only critique of visual design, palette, and layout; (2) a read-only critique of copy accuracy and clarity; and (3) an implementation pass limited to that page's animation files. The main agent incorporates grounded feedback and resolves any conflicts.
- Keep animation behavior and styling in page-specific files separate from the page's main stylesheet and content script, using clear names such as `budgetAnimation.css` and `budgetAnimation.js`. Use Lenis only when it can load without adding a package manager or changing shared files, and respect `prefers-reduced-motion`.
- Make project-specific animation assets progressively enhanced: page content must remain visible if JavaScript, IntersectionObserver, or the animation CDN is unavailable.
