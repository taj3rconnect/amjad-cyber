# Decisions and rules from Taj

- "https://taj3rconnect.github.io/amjad-cyber/ will be replaced with amjad.haslani.com do not delete https://taj3rconnect.github.io/amjad-cyber/ until I approve it. I will delete once amjad.haslani.com is working and matching to https://taj3rconnect.github.io/amjad-cyber/ content, daily updates"
- "There are no alerts." The agents are the refresh: "it refreshes the data to get fresh YouTube videos based on the skill, and also gets the fresh job postings once every day."
- Removing Pages means turning off Pages. Never delete the repo: the DGX pulls from it.

# Choices made in the session

- The site is served at the domain root. nginx rewrites the manifest paths, so the shared file stays as Pages needs it.
- `noindex` is set in this site's nginx, not in the Cloudflare zone, because the zone setting affects every haslani.com site.
- The Worker allows an exact list of origins. Update it with a code-only upload so bindings and secrets stay untouched.
- Never test Ask Dad with a real message: it writes to Amjad's chat history and spends credits. POST `{}` to `/chat` proves the origin check.
- Do not commit the Worker's code here: this repo is public.
