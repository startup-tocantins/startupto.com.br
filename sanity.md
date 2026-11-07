Set up Sanity using the `sanity-best-practices` skill's `getting-started` reference.

If the skill can't be found, install it by running `npx skills add sanity-io/agent-toolkit --skill sanity-best-practices -y`. If the install fails, stop and ask me to run it.

Context:
- Project: StartupTocantins (hy28b6oa)
- Dataset: production
- Framework: Next.js
- Project Type: Blog
- This is a monorepo: the current folder is the root, with the Studio in `studio` and the Next.js app in `web`
- Connect Sanity to my new `web` app
- First, confirm `studio` and `web` are both in your working directory. If not, stop and ask me to restart you from the `startuptocantins` folder.
- Keep the Studio standalone — do not embed it in the Next.js app