# Google Analytics 4 & AdSense — how CraftSprint is wired

Already in the code (no layout changes needed): set the IDs in Vercel and redeploy.

| Variable (Vercel → Production only, Type: Config) | Example | Turns on |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | `G-AB12CD34EF` | Google Analytics 4 + the events below |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-1234567890123456` | AdSense script (site verification + Auto ads) and `/ads.txt` |
| `NEXT_PUBLIC_ADSENSE_SLOT` (optional) | `1234567890` | Fixed ad unit in tool pages (Auto ads work without it) |

Both run **only on www.craftsprint.io (production)** — never on staging or previews, so test clicks never reach AdSense.

## Privacy & consent
- Google Consent Mode v2 defaults: in the EEA, UK and Switzerland, ads and analytics cookies are **denied until the visitor agrees**; enable AdSense → Privacy & messaging → **European regulations message** so visitors there can choose.
- Events never contain file contents, typed text, chat messages, names or emails.

## Events (tested in the browser with test IDs)
| Event | When | Parameters |
|---|---|---|
| `tool_view` | A tool or game page opens | `tool_slug`, `tool_category` |
| `file_download` | Any download button in any tool | `tool_slug`, `file_extension` |
| `copy_result` | “Copy” in a tool | `tool_slug` |
| `search` (GA4 recommended) | A tool is opened from the site search | `search_term`, `tool_slug` |
| `ai_message` | A message is sent to CraftSprint AI | `ai_mode` (tools / chat) |
| `app_install_prompt` | The install window is answered | `outcome`, `app` |

To see tool names in GA4 reports: Admin → Data display → **Custom definitions** → Create custom dimension (Event scope) for `tool_slug`, `tool_category`, `file_extension`, `ai_mode`.
Useful report: Reports → Engagement → Events → `tool_view` → add the `tool_slug` dimension = most-used tools.
