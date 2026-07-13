# Calendar Wallpaper

Public calendar wallpaper generator built for GitHub Actions and GitHub Pages.

This repository starts from the rendering code used by the private
`year-calendar` project, without its Git history, generated wallpapers, theme
history, or personal output.

## Development

```bash
npm ci
npm test
npm run render
```

Generated wallpapers are written to `output/`. The daily workflow publishes
generated assets to the `generated-wallpapers` branch.
