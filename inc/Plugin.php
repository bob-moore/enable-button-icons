<?php
/**
 * Main plugin service.
 *
 * PHP Version 8.2
 *
 * @package    Bmd\EnableButtonIcons
 * @author     Bob Moore <bob@bobmoore.dev>
 * @license    GPL-2.0+ <http://www.gnu.org/licenses/gpl-2.0.txt>
 * @link       https://www.bobmoore.dev
 * @since      1.0.0
 */

namespace Bmd\EnableButtonIcons;

/**
 * Service class for the button icon plugin.
 */
class Plugin
{
	/**
	 * URL of this plugin/package.
	 *
	 * @var string
	 */
	protected string $url;

	/**
	 * Path of this plugin/package.
	 *
	 * @var string
	 */
	protected string $path;

	/**
	 * Constructor.
	 *
	 * @param string $url  URL to the plugin directory.
	 * @param string $path Absolute path to the plugin directory.
	 */
	public function __construct(
		string $url = '',
		string $path = '',
	) {
		$this->setUrl( ! empty( $url ) ? $url : Utilities::getUrl() );
		$this->setPath( ! empty( $path ) ? $path : Utilities::getPath() );
	}

	/**
	 * Set the plugin root URL.
	 *
	 * @param string $url URL to the plugin root.
	 *
	 * @return void
	 */
	public function setUrl( string $url ): void
	{
		$this->url = trailingslashit( esc_url_raw( $url ) );
	}

	/**
	 * Set the plugin root path.
	 *
	 * @param string $path Absolute path to the plugin root.
	 *
	 * @return void
	 */
	public function setPath( string $path ): void
	{
		$this->path = trailingslashit( wp_normalize_path( $path ) );
	}

	/**
	 * Mount actions required.
	 *
	 * @return void
	 */
	public function mount(): void
	{
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueueEditorAssets' ] );
		add_action( 'init', [ $this, 'enqueueBlockStyles' ] );
		add_filter( 'render_block_core/button', [ $this, 'renderBlockButton' ], 10, 2 );
	}

	/**
	 * Enqueue editor assets for the block extension.
	 *
	 * @return void
	 */
	public function enqueueEditorAssets(): void
	{
		$script_file = $this->path . 'build/index.js';

		if ( ! is_file( $script_file ) ) {
			return;
		}

		$assets  = $this->getAssetData( 'index' );
		$version = $assets['version'] ?? (string) filemtime( $script_file );
		$src     = $this->url . 'build/index.js';

		wp_enqueue_script(
			'enable-button-icons-editor-scripts',
			$src,
			$assets['dependencies'],
			$version,
			true
		);

		$style_file = $this->path . 'build/editor.css';

		if ( ! is_file( $style_file ) ) {
			return;
		}

		$style_data = $this->getAssetData( 'editor' );

		wp_enqueue_style(
			'enable-button-icons-editor-styles',
			$this->url . 'build/editor.css',
			[],
			$style_data['version'] ?? (string) filemtime( $style_file )
		);
	}

	/**
	 * Register shared button styles.
	 *
	 * @return void
	 */
	public function enqueueBlockStyles(): void
	{
		$style_file = $this->path . 'build/style.css';

		if ( ! is_file( $style_file ) ) {
			return;
		}

		$asset_data = $this->getAssetData( 'style' );

		wp_enqueue_block_style(
			'core/button',
			[
				'handle' => 'enable-button-icons-block-styles',
				'src'    => $this->url . 'build/style.css',
				'ver'    => $asset_data['version'] ?? (string) filemtime( $style_file ),
				'path'   => $style_file,
			]
		);
	}

	/**
	 * Resolve script dependency metadata from WordPress build asset files.
	 *
	 * @param string $key Build asset key without the `.asset.php` suffix.
	 *
	 * @return array{dependencies: array<int, string>, version: string|null}
	 */
	protected function getAssetData( string $key ): array
	{
		$asset_file = $this->path . "build/{$key}.asset.php";

		if ( ! is_file( $asset_file ) ) {
			return [
				'dependencies' => [],
				'version'      => null,
			];
		}

		$asset = include $asset_file;

		if ( ! is_array( $asset ) ) {
			return [
				'dependencies' => [],
				'version'      => null,
			];
		}

		$dependencies = $asset['dependencies'] ?? [];
		$version      = $asset['version'] ?? null;

		return [
			'dependencies' => is_array( $dependencies ) ? $dependencies : [],
			'version'      => is_string( $version ) ? $version : null,
		];
	}

	/**
	 * Allowed SVG tags and attributes for stored icons.
	 *
	 * @return array<string, array<string, bool>>
	 */
	protected function getAllowedSvgTags(): array
	{
		return [
			'svg'    => [
				'xmlns'           => true,
				'viewbox'         => true,
				'width'           => true,
				'height'          => true,
				'fill'            => true,
				'stroke'          => true,
				'stroke-width'    => true,
				'stroke-linecap'  => true,
				'stroke-linejoin' => true,
				'aria-hidden'     => true,
				'focusable'       => true,
				'class'           => true,
				'role'            => true,
			],
			'path'   => [
				'd'         => true,
				'fill'      => true,
				'stroke'    => true,
				'fill-rule' => true,
				'clip-rule' => true,
			],
			'circle' => [
				'cx'     => true,
				'cy'     => true,
				'r'      => true,
				'fill'   => true,
				'stroke' => true,
			],
			'rect'   => [
				'x'      => true,
				'y'      => true,
				'width'  => true,
				'height' => true,
				'rx'     => true,
				'ry'     => true,
				'fill'   => true,
				'stroke' => true,
			],
			'line'   => [
				'x1'     => true,
				'y1'     => true,
				'x2'     => true,
				'y2'     => true,
				'stroke' => true,
			],
			'g'      => [
				'fill'      => true,
				'stroke'    => true,
				'transform' => true,
			],
			'use'    => [
				'href'       => true,
				'xlink:href' => true,
			],
			'defs'   => [],
			'title'  => [],
		];
	}

	/**
	 * Render icons on button blocks.
	 *
	 * @param string               $block_content Rendered block markup.
	 * @param array<string, mixed> $block         Parsed block data.
	 *
	 * @return string Filtered block markup.
	 */
	public function renderBlockButton( string $block_content, array $block ): string
	{
		$icon = $block['attrs']['icon'] ?? null;

		if ( ! is_array( $icon ) ) {
			return $block_content;
		}

		$icon_src  = $icon['src'] ?? null;
		$icon_name = $icon['name'] ?? null;

		if ( ! is_string( $icon_src ) || ! is_string( $icon_name ) || '' === $icon_src || '' === $icon_name ) {
			return $block_content;
		}

		$position_left = ! empty( $block['attrs']['iconPositionLeft'] );
		$icon_size     = $block['attrs']['iconSize'] ?? '';
		$safe_svg      = wp_kses( $icon_src, $this->getAllowedSvgTags() );

		$processor = new \WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->add_class( 'has-icon__' . sanitize_html_class( $icon_name ) );

			if ( is_string( $icon_size ) && '' !== trim( $icon_size ) ) {
				$current_style = (string) $processor->get_attribute( 'style' );
				$size_style    = '--wp-block-button--icon-size:' . sanitize_text_field( $icon_size ) . ';';
				$processor->set_attribute( 'style', trim( $current_style . ' ' . $size_style ) );
			}
		}

		$block_content = $processor->get_updated_html();
		$icon_span     = '<span class="wp-block-button__link-icon" aria-hidden="true">' . $safe_svg . '</span>';

		$updated_content = $position_left
			? preg_replace( '/(<a[^>]*>)(.*?)(<\/a>)/is', '$1' . $icon_span . '$2$3', $block_content )
			: preg_replace( '/(<a[^>]*>)(.*?)(<\/a>)/is', '$1$2' . $icon_span . '$3', $block_content );

		return is_string( $updated_content ) ? $updated_content : $block_content;
	}
}
