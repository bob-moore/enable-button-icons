<?php
/**
 * Plugin Name:       Enable Button Icons
 * Plugin URI:        https://github.com/bob-moore/enable-button-icons
 * Author:            Bob Moore
 * Author URI:        https://www.bobmoore.dev
 * Description:       Adds icons to Button blocks.
 * Version:           0.3.2
 * Requires at least: 6.9
 * Tested up to:      7.0
 * Requires PHP:      8.2
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       enable-button-icons
 *
 * @package           enable-button-icons
 * @author            Bob Moore <bob@bobmoore.dev>
 * @license           GPL-2.0-or-later <https://www.gnu.org/licenses/gpl-2.0.html>
 * @link              https://www.bobmoore.dev
 */

use Bmd\EnableButtonIcons\ServiceLoader;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/scoped/autoload.php';

new ServiceLoader();
