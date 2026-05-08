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

namespace Bmd;

use Bmd\EnableButtonIcons\Plugin;
use Bmd\EnableButtonIcons\Bmd\GithubWpUpdater;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/scoped/autoload.php';

/**
 * Bootstrapper for the Enable Button Icons plugin.
 *
 * Creates the main plugin service once and wires the scoped GitHub updater.
 */
class EnableButtonIcons
{
	/**
	 * Main plugin service instance.
	 *
	 * @var Plugin|null
	 */
	protected static ?Plugin $instance = null;

	/**
	 * Plugin root URL.
	 *
	 * @var string
	 */
	protected string $url = '';

	/**
	 * Absolute plugin root path.
	 *
	 * @var string
	 */
	protected string $path = '';

	/**
	 * Constructor.
	 *
	 * Initializes the plugin service and update checker once.
	 */
	public function __construct()
	{
		if ( null === self::$instance ) {
			self::$instance = new Plugin(
				plugin_dir_url( __FILE__ ),
				plugin_dir_path( __FILE__ )
			);

			self::$instance->mount();

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
	}

	/**
	 * Get the initialized plugin service.
	 *
	 * @return Plugin|null Plugin service, or null before bootstrap has run.
	 */
	public static function getInstance(): ?Plugin
	{
		return self::$instance;
	}
}

new EnableButtonIcons();
