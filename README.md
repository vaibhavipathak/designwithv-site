# designwithv.ca

Portfolio site for Vaibhavi Bhatt. Plain HTML, CSS and JavaScript: no build step, nothing to install.

## What is in this folder

| Path | What it is |
|---|---|
| `index.html` | Home page |
| `km-modernization.html` | KM Modernization case study |
| `404.html` | Page shown for broken links |
| `css/styles.css` | All styling. Colours and fonts are variables at the top. |
| `js/main.js` | Motion and interactions (scroll reveals, menu, image viewer, the sitemap's "View as" switch) |
| `assets/img/` | Images |
| `assets/docs/` | PDFs (resume, roadmap, training) |
| `CNAME` | Tells GitHub Pages the site lives at designwithv.ca |
| `.nojekyll`, `robots.txt`, `sitemap.xml` | Housekeeping for GitHub Pages and search engines |

## Put it on GitHub

1. Sign in to GitHub and create a new **public** repository, for example `designwithv-site`. Do not add a README or any other starter file.
2. On the new repository's page, choose **uploading an existing file**.
3. Open this folder on your computer, select **everything inside it** (not the folder itself) and drag it into the upload area. `index.html` must end up at the top level of the repository.
4. Select **Commit changes**.
5. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to "Deploy from a branch", choose the `main` branch and the `/ (root)` folder, then **Save**.
6. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/designwithv-site/`. Check it there before moving the domain.

## Point designwithv.ca at it

Do this only once the GitHub address above looks right. The current WordPress site stops being reachable at the domain as soon as the DNS change takes effect.

1. In the repository, go to **Settings → Pages → Custom domain**, enter `designwithv.ca` and **Save**.
2. Sign in to wherever the domain is registered and open its DNS settings.
3. Replace the existing `A` records for the root domain (`@`) with these four:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

4. Add or change the `CNAME` record for `www` so it points to `YOUR-USERNAME.github.io`.
5. Leave any `MX` and `TXT` records alone. They handle email for the domain.
6. Back in **Settings → Pages**, wait for the DNS check to pass, then tick **Enforce HTTPS**. This can take anywhere from a few minutes to a day.

## Updating the site later

- **Text:** open the `.html` file in any text editor, change the words, and upload the file to the repository again (same name, it replaces the old one).
- **A PDF or image:** upload the new file to the same folder with the same file name.
- **Colours:** change the values at the top of `css/styles.css`. `--accent` is the blue.

## Adding a new project later

**A short project (a card on the home page):**

1. Put the cover image in `assets/img/`, ideally about 1280 pixels wide and saved as JPG or WebP.
2. Open `index.html` and find the `<!-- Prototypes -->` section (or `<!-- Recent work -->` for bigger pieces).
3. Copy one whole `<article class="card ...">` ... `</article>` block, paste it next to the others, and change the image file name, title, description, tool chips and links.
4. Upload `index.html` and the new image to GitHub.

The grid rearranges itself, so a fourth or fifth card needs no layout changes.

**A full case study page:**

1. Make a copy of `km-modernization.html` with a new name, for example `new-project.html`, and replace its text and images.
2. Link to it from a card on the home page, the same way the KM Modernization card links to `km-modernization.html`.
3. Add the new page's address to `sitemap.xml` so search engines find it.

## Notes

- The TaskIt card on the old site also linked to a concept diagram, a mockups PDF and a project plan PDF, which weren't in the project folder. To add them, put the files in `assets/docs/` and add links next to "Live app" in the TaskIt card.
- The book's full PDF is intentionally not on the site. The book section links to the YouTube flip-through and the Kindle listings instead.
