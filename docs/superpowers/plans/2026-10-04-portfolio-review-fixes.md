# Portfolio review fixes

## Scope

Resolve the user-viewpoint findings in sequence: (1) blog article resize state, (2) keyboard-accessible blog list, (3) contact form label associations, (4) reduced-motion skills visibility, (5) fixed-navigation anchor offsets and focus styles, (7) preserve manually paused nearby videos across tab visibility changes, and (8) prevent the CodePath preview from being enlarged beyond its source. Skip finding 6 as requested. Keep media files unchanged.

## Verification approach

For each item, first reproduce or assert the failing behavior, make the smallest static-site change, then verify the corrected behavior in the local browser or with focused source/runtime checks. After each item passes, ask a fresh read-only subagent to inspect that fix before proceeding to the next item. Finish with responsive browser checks, syntax checks, and `git diff --check`.

## Ordered tasks

- [x] 1. Keep the selected blog article visible when switching between desktop and mobile widths; preserve explicit close state.
- [x] 2. Make blog post selection operable with keyboard and expose link/button semantics.
- [x] 3. Connect every contact label to the corresponding input or textarea ID.
- [x] 4. Keep skill icons visible in a stable layout when reduced motion is enabled.
- [x] 5. Keep fixed-navigation targets visible and add a clear keyboard focus indicator.
- [x] 7. Avoid resuming a video after the user manually paused it when a hidden tab becomes visible.
- [x] 8. Keep the CodePath preview crisp by avoiding enlargement beyond its available source dimensions.
- [x] Run final cross-viewport and static checks; preserve all existing and new source media files.
