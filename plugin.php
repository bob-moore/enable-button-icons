<?php
/**
 * Plugin Name:       Enable Button Icons
 * Plugin URI:        https://github.com/bob-moore/enable-button-icons
 * Author:            Bob Moore
 * Author URI:        https://www.bobmoore.dev
 * Description:       Adds icons to Button blocks.
 * Version:           0.3.0
 * Requires at least: 6.9
 * Tested up to:      7.0
 * Requires PHP:      8.2
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       enable-button-icons
 *
 * @package           enable-button-icons
 */

use Bmd\EnableButtonIcons;
use Bmd\EnableButtonIcons\Bmd\GithubWpUpdater;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/scoped/autoload.php';

function initialize_enable_button_icons_updater(): void
{
	$updater = new GithubWpUpdater(
		__FILE__,
		[
			'github.user'   => 'bob-moore',
			'github.repo'   => 'enable-button-icons',
			'github.branch' => 'main',
		]
	);

	$updater->mount();
}

function create_enable_button_icons_plugin(): void
{
	$plugin = new EnableButtonIcons(
		plugin_dir_url( __FILE__ ),
		plugin_dir_path( __FILE__ )
	);

	$plugin->mount();
}

initialize_enable_button_icons_updater();
create_enable_button_icons_plugin();
