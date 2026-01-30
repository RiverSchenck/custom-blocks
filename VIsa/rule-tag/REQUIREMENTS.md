# Rule Tag Block — High-Level Requirements

## Core Capabilities

- **Display a rule identifier**  
  The block shows a “Rule” label and a tag with the current rule ID. It is used to label or reference a specific rule in the guideline.

- **Optional legacy ID**  
  A second, legacy identifier can be configured and shown alongside the current ID (e.g. `"RULE-001 | old-123"`). Both IDs are optional; if neither is set, the block does not render.

- **Copy link to this block**  
  Users can copy a deep link that targets this block (e.g. via hash/fragment). This supports sharing or referencing the exact rule location in the page.

- **Configurable tag appearance**  
  The tag’s background color can be set in block settings. Text color adjusts automatically for contrast (light text on dark backgrounds, dark on light).

## Out of Scope (for this high-level set)

- How IDs are validated, synced with external systems, or displayed elsewhere is not defined here; those are design/implementation concerns.
