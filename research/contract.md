# Research data contract

Read ../final-brief.md and ../method.md. The approved amendment at the top of method.md supersedes the older draft. Only official sources actually opened during this task count as checked. Tool source matrix is ../../../day-1-research/02-tool-landscape-matrix.md.

Write a JSON array in your assigned category file. Each tool:

```
{
  "id": "stable-kebab-id", "name": "Exact matrix tool name", "category": "general|research|design|builders",
  "status": "active|discontinued|unverified", "scope": "Precise product/mode/tier scope",
  "summary": "One short sentence explaining shape in plain English, max 140 characters",
  "limitation": "One concise workflow boundary",
  "baseScores": {"N": 0, "NE": 0, "E": 0, "SE": 0, "S": 0, "SW": 0, "W": 0, "NW": 0},
  "visualScores": {"N": 0, "NE": 0, "E": 0, "SE": 0, "S": 0, "SW": 0, "W": 0, "NW": 0},
  "baseCenter": [0,0], "center": [0,0],
  "centerEvidence": {"claim":"...", "sourceIds":["s1"], "confidence":"medium", "inferred":true},
  "sources": [{"id":"s1","title":"...","url":"https://...","finding":"Brief paraphrase of capability actually read"}],
  "evidence": {"N":{"claim":"...","sourceIds":["s1"],"confidence":"medium","inferred":true}, "NE":{}, "E":{}, "SE":{}, "S":{}, "SW":{}, "W":{}, "NW":{}},
  "adjustments": [{"field":"NE", "from":2, "to":1.75,"reason":"..."}]
}
```

Quarter-point scores 0–4. All directions require real claim/sourceIds/confidence/inferred fields; sources may repeat but directional interpretation must be specific. Inferences are normal: numerical scoring is editorial, not a vendor fact. Do not pretend promotional claims establish benchmarks. Limit total paraphrase per source to its word budget; avoid long quotations. Every source must have been opened. Low novelty can legitimately be 0–1 for discovery/extraction products. Do not inflate their generative reach to look like creative assistants. High autonomy does not imply high execution precision.

Keep diagonal <= min(adjacent cardinal scores). Centers must lie inside [-W/4,E/4] × [-S/4,N/4], preferably comfortably interior to avoid degenerate rings. Default centers must be genuinely differentiated using scoped workflows; don't place everything at zero. No geometric generation needed; owner will derive it.

Set visual scores and centers equal to base initially. After category is complete, optionally apply nuanced editorial adjustments ≤0.5 score and ≤0.1 center per coordinate, log every one. Never exceed documented hard boundaries or invent unsupported features. No pressure to invent contrasts when evidence is similar.

Discontinued/unverified tools: null score objects and centers, statusEvidence with sources, no cloud; keep sources/summary/limitation and empty evidence/adjustments. Main owner assigns logos. Do not edit shared files or UI. Output only assigned research JSON and optional assigned notes.
