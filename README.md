# RCC GitHub Ready

Website design from localhost:5173 with all 37 original RCC services, phone, email, Delhi locality, working hours and existing Google Apps Script enquiry endpoint.

Upload index.html, privacy.html, disclaimer.html, styles.css and assets/ to the repository root. Enable GitHub Pages from main / (root).

Editable code: source/. Run npm ci then npm run dev. Build with npm run build -- --base=./; copy source/dist/index.html to the repository root.

Build and JavaScript syntax checked. Live enquiry delivery and browser appearance have not been verified. No test enquiry was submitted.

Language and appearance: Hindi/English and Light/Dark controls are in the header. Preferences stay in browser localStorage; enquiry contents do not. Hindi copy is maintained in source/src/js/hi.json. Standard abbreviations and brand names stay unchanged, and form values remain stable across languages.

Run npm run build in source/ to regenerate the root index.html and shared preference files. Upload the root index.html, privacy.html, disclaimer.html, styles.css, preferences.js, preferences.css, .nojekyll and assets/ to GitHub Pages. Routes use hashes and assets use relative paths, so repository subpaths need no server rewrites. No translation API or backend was added.
