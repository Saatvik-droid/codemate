### Apporach

- I used `commander` to create a quick CLI.
- PaLM has been used as an LLM to generate responses.
- The CLI uses the `explain` command with the `file` arguement for a relative filepath/filename and generates code explanation through the LLM.

### Challenges

- I had extinguished all my credits for OpenAI free tier and could not avail free credits.
- I used PaLM API in place of OpenAI but the responses were often `null`, so I had to work around that.
- The .env API keys will not load dynamically from various directories, so I had to set an absolute path.
