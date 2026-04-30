=== Enable Button Icons ===
Contributors: Bob Moore
Tags: block-editor, gutenberg, button, icons, blocks
Requires at least: 6.9
Tested up to: 7.0
Stable tag: 0.3.1
Requires PHP: 8.2
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add icons to the core/button block with WordPress icons, MUI icons, or custom SVG.

== Description ==

Enable Button Icons extends the core/button block with icon controls in the block sidebar.

This plugin is a fork and rewrite of the original project by Nick Diego:
https://github.com/ndiego/enable-button-icons

What it does:

* Adds icon controls to core/button in the block editor.
* Supports WordPress icon set, MUI icon set, and custom SVG markup.
* Supports left/right icon position.
* Supports per-button icon size using CSS units.
* Renders sanitized inline SVG on the frontend.

This plugin is distributed through GitHub releases and includes a scoped updater so WordPress can surface updates from this repository.

== Installation ==

= Install as a WordPress plugin =

1. Download the latest release zip from GitHub.
2. In WordPress admin, go to Plugins > Add New Plugin > Upload Plugin.
3. Upload the zip and activate Enable Button Icons.

= Install via Composer (library usage) =

1. Require the package:

`composer require bmd/enable-button-icons`

2. Ensure Composer autoloading is loaded:

`require_once __DIR__ . '/vendor/autoload.php';`

3. Instantiate and mount the service:

`use Bmd\EnableButtonIcons;`
`$plugin = new EnableButtonIcons( plugin_dir_url( __FILE__ ), plugin_dir_path( __FILE__ ) );`
`$plugin->mount();`

== Frequently Asked Questions ==

= Is this plugin in the WordPress Plugin Directory? =

No. It is distributed via GitHub releases.

= Does this plugin support updates in wp-admin? =

Yes. It includes a GitHub updater integration so WordPress can detect updates from this repo.

= Which icon sets are included? =

WordPress icons and MUI icons, plus a custom SVG option.

= Is this the same as the original ndiego plugin? =

It is a fork and rewrite based on that project, with updated architecture and packaging.

== Changelog ==

= 0.3.0 =

* Fork and rewrite of the original `ndiego/enable-button-icons` plugin.
* Added service-based architecture and block editor controls for icons.
* Added frontend rendering with SVG sanitization and per-button sizing/position.
* Added scoped GitHub updater bootstrap and release packaging workflow.

== Upgrade Notice ==

= 0.3.0 =

Major rewrite of the original project with updated internals, release pipeline, and GitHub-delivered updates.
