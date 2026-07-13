# Calendar Wallpaper

A public GitHub Pages site that serves a fresh calendar wallpaper every day.
Visitors choose their iPhone model, preview the correctly sized image, and copy
a stable URL for use in Shortcuts automation.

The generator publishes ten output resolutions covering iPhone X through the
iPhone 16 family. Models with the same screen resolution share one generated
image.

## Development

```bash
npm ci
npm test
npm run render
```

Generated wallpapers are written to:

```text
output/devices/<width>x<height>/today.png
```

The daily workflow publishes the website and generated images to the
`generated-wallpapers` branch. GitHub Pages should serve that branch from its
repository root.
