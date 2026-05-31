# Susy → CSS Flex/Grid Migration Guide

## What changed

This migration removes the **Susy grid framework** and **Breakpoint-sass** vendor
dependencies and replaces them with native CSS Grid, Flexbox, and `@media` queries.
No layout behaviour should change — the output CSS is semantically equivalent.

---

## Files modified

| File | What changed |
|------|-------------|
| `_sass/_variables.scss` | Added `$grid-gutter` token (replaces `gutter()` function) |
| `_sass/include/_mixins.scss` | Replaced Bourbon `clearfix` with `display:flow-root`; added native `breakpoint()` mixin |
| `_sass/include/_utilities.scss` | Replaced `@include breakpoint()` → `@media`; replaced `span(2.5 of 12)` → `20.8333%` |
| `_sass/layout/_archive.scss` | Full rewrite: float+span grid → CSS Grid (`.grid__wrapper`) + Flexbox (`.feature__item`) |
| `_sass/minimal-partials.scss` | Removed `@import "vendor/breakpoint/breakpoint"` |

All other layout files (`_page`, `_sidebar`, `_navigation`, etc.) use `@include breakpoint()`
which now resolves to the **native mixin** in `_mixins.scss` — no changes needed in those files.

---

## Conversion reference

### `span(N of 12)` → percentage

| Susy call | CSS equivalent |
|-----------|---------------|
| `span(3 of 12)` | `25%` |
| `span(4 of 12)` | `33.3333%` |
| `span(5 of 10)` | `50%` |
| `span(5 of 12)` | `41.6667%` |
| `span(7 of 12)` | `58.3333%` |
| `span(2.5 of 12)` | `20.8333%` |

### `gutter()` → `$grid-gutter` (2%)

| Susy call | CSS equivalent |
|-----------|---------------|
| `gutter(of 10)` | `$grid-gutter` (2%) |
| `gutter(of 12)` | `$grid-gutter` (2%) |
| `gutter(1 of 12)` | `$grid-gutter` |
| `gutter(0.5 of 12)` | `calc(#{$grid-gutter} * 0.5)` |

### `@include breakpoint($x)` → `@media`

| Susy/Breakpoint-sass | Native CSS |
|----------------------|------------|
| `@include breakpoint($large)` | `@media (min-width: #{$large})` |
| `@include breakpoint($x-large)` | `@media (min-width: #{$x-large})` |
| `@include breakpoint(max-width $small)` | `@media (max-width: #{$small})` |
| `@include breakpoint(max-width $large - 1px)` | `@media (max-width: #{$large - 1px})` |

The new `breakpoint()` mixin in `_mixins.scss` transparently handles both min-width
and max-width forms, so **all existing `@include breakpoint()` calls in unchanged files
continue to work without modification**.

### `@include clearfix` → `display: flow-root`

The Bourbon `clearfix` mixin is replaced by:

```scss
@mixin clearfix {
  display: flow-root;  // modern block-formatting context
  @supports not (display: flow-root) {
    &::after { clear: both; content: ""; display: table; }
  }
}
```

`display: flow-root` has 97%+ browser support and eliminates the `::after` pseudo-element
hack entirely. The `@supports` fallback covers older browsers.

---

## Grid layout changes

### `.grid__wrapper` (archive grid view)

**Before (Susy float grid):**
```scss
.grid__item {
  @include breakpoint($small) {
    float: inline-start;
    width: span(5 of 10);  // 50%
    &:nth-child(2n+2) { margin-inline-start: gutter(of 10); }
  }
  @include breakpoint($medium) {
    width: span(3 of 12);  // 25%
    &:nth-child(4n+2/3/4) { margin-inline-start: gutter(1 of 12); }
  }
}
```

**After (CSS Grid):**
```scss
.grid__wrapper {
  display: grid;
  gap: $grid-gutter;
  grid-template-columns: 1fr;
  @media (min-width: #{$small})  { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: #{$medium}) { grid-template-columns: repeat(4, 1fr); }
}
```

### `.feature__item` (feature rows)

**Before (Susy float):**
```scss
@include breakpoint($small) {
  float: inline-start;
  width: span(4 of 12);  // 33.33%
}
```

**After (Flexbox):**
```scss
.feature__wrapper { display: flex; flex-wrap: wrap; gap: $grid-gutter; }
.feature__item {
  @media (min-width: #{$small}) {
    flex: 0 0 calc(33.3333% - #{$grid-gutter});
  }
}
```

### `.feature__item--left / --right` (two-column feature)

**Before:** `float: inline-start/end` + `width: span(5 of 12)` / `span(7 of 12)`

**After:** `display: flex` on `.archive__item` with `flex` basis percentages (41.67% / 58.33%).
The `--right` variant uses `order` to reverse the visual order without changing the DOM.

---

## Vendor directory

The `_sass/vendor/breakpoint/` and `_sass/vendor/susy/` directories are **no longer imported**
and can be deleted if desired:

```bash
rm -rf _sass/vendor/breakpoint
rm -rf _sass/vendor/susy
```

Font Awesome and font vendors are unchanged.

---

## Testing

After building, verify:

1. **Grid view** (`/publications`, `/talks`) — cards render in 2-col (mobile) → 4-col (desktop) grid
2. **Feature rows** — left/right/center variants align correctly
3. **Sidebar** — appears at ≥1024px, widens at ≥1280px
4. **Navigation** — mobile menu toggle works; desktop nav appears at ≥1024px
5. **`.full` utility** — content extends to the right on wide screens

Run `bundle exec jekyll build` and check for any Sass compilation errors.
