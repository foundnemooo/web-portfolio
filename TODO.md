# TODO

- [x] **Windows XP boot and desktop experience** — Show a Windows XP-style splash and boot/loading sequence that transitions into the portfolio desktop. Recreate the Windows XP home desktop with the default-theme look, nostalgic wallpaper treatment, taskbar, Start-area styling, desktop icons, and pixelated interface details.
- [x] **Joshua’s desktop identity** — Display Joshua Ceazar’s picture and name as the signed-in portfolio owner on the desktop.
- [x] **About app window** — Provide an About desktop icon that opens an app-like window containing Joshua’s existing bio, location, skills, education, and professional experience.
- [x] **Projects folder window** — Provide a Projects desktop icon that opens a folder-style window showcasing NotiFire, Armi Vida’s Mart, and TDIP with the factual descriptions, technologies, and project links available on the existing site.
- [x] **Certificates folder/gallery** — Provide a Certificates desktop icon that opens a folder or gallery containing all seven certificates from the existing portfolio, with clear certificate details and viewable assets or links.
- [x] **Contact app window** — Provide a Contact desktop icon that opens an app-like contact window with Joshua’s email plus GitHub, LinkedIn, and resume links from the existing site.
- [x] **Desktop-window behavior** — Support opening and closing apps, focus and layering behavior, draggable windows, and familiar minimize/maximize controls where appropriate.
- [x] **Responsive XP desktop** — Adapt the Windows XP concept across desktop and smaller screens while keeping portfolio content readable and links usable.

## Requested design refinements

- [x] **Original personal identity mark** — Replace all Microsoft logos with an original, non-Microsoft personal mark across the desktop, taskbar, splash screen, favicon, and platform project logo.
- [x] **CeazarXP splash branding** — On the splash screen, replace the Microsoft text with “Joshua” and replace “WindowsXP” with “CeazarXP.”
- [x] **Centered portrait and greeting** — Remove the desktop “signed in as” tab. Make Joshua’s photo larger and center it on the desktop with the text “hello world! I’m Joshua - Junior Web developer.”
- [x] **Richer desktop motion** — Add fancier animations and transitions, including visible hover animations on desktop icons and controls.

## Motion enhancements

- [x] **Window open and close transitions** — Give application windows smooth, fancy opening and closing animations; keep a closing app visible until its exit transition finishes.
- [x] **Wallpaper cursor trail** — Show a decorative cursor-following animation while the pointer moves over empty desktop wallpaper, not while it is over app windows, icons, the taskbar, or the intro portrait. Respect touch input and reduced-motion preferences.

## Desktop interaction refinements

- [x] **Minimize and restore animation** — Add smooth animations when an app window is minimized and when it is restored from the taskbar.
- [x] **Start menu and button animation** — Add smooth opening and closing animations to the Start menu and a responsive visual animation/state on its button.
- [x] **Restart action** — Replace “Turn off computer” with “Restart”; when pressed, refresh the page so the CeazarXP startup sequence runs again.
- [x] **More visible desktop icons** — Enhance desktop icon visibility while maintaining the Windows XP theme.

## Desktop composition update
- [x] **Centered shortcut row** — In desktop view, place the desktop icons below the “hello world! I’m Joshua” introduction and center them. In mobile view, also move the icons below the introduction and center them.
- [x] **Pixel-cursor procession** — Replace the current cursor movement animation with multiple pixelated cursors following the pointer over the desktop wallpaper.

## Cursor trail consistency

- [x] **Continuous desktop cursor tracking** — Keep the pixelated cursors consistently following the pointer across the desktop, without gaps over content or when the pointer pauses; hide the effect only when the pointer leaves the desktop. Continue respecting touch input and reduced-motion preferences.

## Preview edit batch wpe_f2eb7f564f6919e49f5a3fb2

- [x] **Remove desktop note** — Remove the desktop note element currently containing “Click an icon to explore” and “Good things are under the hood.”

## Preview edit batch wpe_3d735f55b707a385bb4a7dda

- [x] **Guidance note** — The earlier-requested desktop note is already removed.
- [x] **Workstation label** — Replace “JOSHUA CEAZAR · PERSONAL WORKSTATION” with “JOSHUA CEAZAR LOPEZ”.
- [x] **Hero kicker** — Shorten “PORTFOLIO SYSTEM / 2026” to “PORTFOLIO / 2026”, then clear the kicker text in the final preview edit.
- [x] **Role line** — Replace “- Junior Web developer.” with “A Junior Web Developer”.
- [x] **Hero caption** — Clear “BUILDING USEFUL THINGS, CAREFULLY” from the caption.

## Previous-portfolio hero typography

- [x] **Match the previous hero text design** — Style the current “hello world!”, “I'm Joshua.”, and “A Junior Web Developer” texts using the previous portfolio’s DM Mono uppercase and letter-spaced greeting/role, large tightly tracked sans-plus-italic-serif name treatment, and lime accent. Keep the text wording, centered XP desktop layout, wallpaper, portrait, and folder shortcuts intact.

## Desktop spacing and window restoration

- [x] **Taskbar clearance** — Keep a visible gap between the centered desktop shortcut icons and the taskbar, including tablet and short-height desktop layouts; the icons must not touch or overlap the taskbar.
- [x] **Smooth minimized-window restore** — When a window is minimized and its taskbar button is clicked, display it promptly and restore it with a smooth animation that avoids stuttering before the window appears.

## Desktop and project detail refinements

- [x] **Animated wallpaper** — Animate the desktop wallpaper with continuous, restrained motion while preserving its familiar XP landscape appearance.
- [x] **About label** — Change “About Joshua” to “About Me” wherever the same About shortcut/window appears in the desktop, Start menu, and taskbar.
- [x] **Mobile certificates** — Make the Certificates window fit and read comfortably on mobile without horizontal clipping; keep all seven certificate rows and links usable inside the available window.
- [x] **Project screenshot galleries** — When a visitor opens any selected project, let them view that project’s screenshots, following the previous portfolio’s selected-project experience and retaining the current project details.


## Portfolio refinements

- [x] **Clearly visible wallpaper animation** — Animate the full XP desktop wallpaper with movement that is easy to notice in the main desktop view, not just a subtle tint or barely perceptible drift; keep the Bliss landscape recognizable and honor reduced-motion preferences.
- [x] **Project screenshot framing** — In the Projects window, remove only the unused black canvas outside the NotiFire, Armi Vida’s Mart and TDIP captures; preserve NotiFire’s original phone mockup and its frame, showing the complete phone and app UI without cropping.
- [x] **Explorer project history** — Use the Projects window’s Back button to return from a selected project to the project list and its Forward button to reopen that selected project; remove the separate “Back to My Projects” button.

- [x] **CeazarXP project entry** — Include this portfolio website in My Projects; for this entry, show the technology stack and the frontend libraries/techniques used for animations and styling instead of screenshots. Set its project-list title to “This Web Portfolio” and its description to “A Windows XP-inspired interactive web portfolio, with a custom boot sequence, animated wallpaper, draggable app windows, and portfolio folders.” Use the CeazarMark shown on the splash screen as the icon for this portfolio entry in My Projects.

- [x] **Project-window note** — Remove the text “Screenshots from Joshua’s original portfolio. Live demo links were not listed.” from all project windows.
- [x] **TDIP technology stack** — Keep TDIP’s screenshots in its project window, then show a curated technology-stack view below them and list only notable items from the supplied stack: React 19, TypeScript 5.8, TanStack Start and Router, Vite 7, Nitro, Supabase/PostgreSQL with Auth, RLS, Storage, Realtime, RPCs and Edge Functions, custom TanStack server functions, Zod, Tailwind CSS v4, shadcn/ui, Radix UI, Lucide React, React Hook Form, Recharts, xlsx, PDF.js, pdf-lib, Mammoth, Docxtemplater and Nodemailer with SMTP/Gmail automation.


## Photo card, iconography and Armi stack

- [x] **Hero photo-card motion** — After the splash screen, smooth the animation of the card with Joshua’s photo so it does not stutter, and remove the star/spark icon from the card.
- [x] **Custom portfolio icons** — Do not use Lucide icons in the CeazarXP interface; replace the current Lucide artwork with a distinctive, custom XP-compatible icon set while preserving each control’s meaning and accessible label.
- [x] **Armi Vida’s Mart stack** — Keep the project’s screenshot gallery and add a curated notable stack below it: React 19, TypeScript 5, Vite 7, TanStack Start and Router, Nitro, Supabase/PostgreSQL with Auth, Storage and RLS, Tailwind CSS 4, shadcn/ui and Radix, HTML5 QR scanning, IndexedDB offline caching and queued-sale sync, Recharts, React Hook Form/Zod, and the PWA service-worker/Workbox stack. Retain Lucide React as a listed Armi project dependency only, not as an icon library used by CeazarXP.

- [x] **CeazarXP project copy** — Do not mention the custom XP SVG glyphs or icon artwork in the CeazarXP project description, technology chips or detail text shown in My Projects.


## NotiFire project technology details

- [x] **NotiFire notable stack** — Keep the existing NotiFire screenshot gallery and display a curated stack beneath it, highlighting Flutter 3.27/Dart/Material 3 and Provider; Firebase Auth, Firestore, Realtime Database, Storage and FCM; local/push alert libraries and custom sounds; Firebase Cloud Functions on Node.js 18 with Realtime Database onCreate alert triggers; selected chart/scanning/timezone packages; and Android Kotlin/API 34/Gradle plus iOS Swift targets.


## Mobile desktop alignment

- [ ] **Mobile project icon frame** — In the mobile My Projects list, make the Ceazar portfolio icon’s outer frame match the other project thumbnails in size and border treatment so it is not the only item that stands out.
- [ ] **Main-page vertical position** — Move the main desktop/hero content slightly upward as a group to improve vertical centering; keep the taskbar and opened application windows anchored in place.
