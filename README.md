# Ciencia y Musica

This repo is the source of truth for the `Ciencia y Musica` Obsidian vault and LMS content.

## Structure

- `cursos/` course-private material used by the LMS.
- `public/` public notes that require pull requests and editorial review.
- `draft/` incubator material, student submissions, and supporting resources.
- `.github/workflows/notify-platform-on-content-change.yml` notifies the framework content-bus webhook.

## Collaboration rules

- `public/**` only through pull requests.
- `cursos/**` can use direct pushes for day-to-day teaching work.
- `draft/**` is a staging area and does not publish directly.
- student contributions should arrive via PR and stay in `draft/estudiantes/**` until a teacher reviews them.
- Framework changes belong in `musiki/framework`, not here.

## GitHub setup

Add this repository secret:

- `CONTENT_BUS_SECRET`: shared bearer secret for `https://www.musiki.org.ar/api/webhook/content-update`.

Optional only if you also add a legacy `repository_dispatch` workflow:

- `PLATFORM_DISPATCH_TOKEN`: token allowed to trigger `repository_dispatch` on `musiki/framework`.

## Owners

- Teaching team: `@musiki/docentes-cym`
- Editorial team: `@musiki/editorial`
- Developers: `@musiki/devs`

## First tasks after scaffold

1. Replace the example course notes under `cursos/cym/`.
2. Confirm `CODEOWNERS` matches your real GitHub teams.
3. Protect `main` with required reviews for `public/**`.
4. Register this repo as a source in the platform manifest.
