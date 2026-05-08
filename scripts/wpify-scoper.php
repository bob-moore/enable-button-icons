#!/usr/bin/env php
<?php
/**
 * Reliable WPify Scoper command wrapper.
 *
 * PHP Version 8.2
 *
 * @package    Bmd\EnableButtonIcons
 * @author     Bob Moore <bob@bobmoore.dev>
 * @license    GPL-2.0+ <http://www.gnu.org/licenses/gpl-2.0.txt>
 * @link       https://www.bobmoore.dev
 * @since      1.0.0
 */

declare(strict_types=1);

$root = dirname(__DIR__);
chdir($root);

$mode = $argv[1] ?? (is_file($root . '/composer-deps.lock') ? 'install' : 'update');

if (! in_array($mode, ['install', 'update'], true)) {
	fwrite(STDERR, "Usage: composer wpify-scoper [install|update]\n");
	exit(2);
}

$autoload = $root . '/vendor/scoped/autoload.php';
$lockFile = $root . '/composer-deps.lock';
$exitCode = run_wpify_scoper($root, $mode);

if (0 === $exitCode && is_file($autoload) && is_file($lockFile)) {
	exit(0);
}

if ('install' === $mode && (! is_file($autoload) || ! is_file($lockFile))) {
	fwrite(STDERR, "WPify Scoper did not create vendor/scoped; retrying with update because composer-deps.lock may be missing or stale.\n");
	$exitCode = run_wpify_scoper($root, 'update');
}

if (recover_wpify_scoper_build($root) && is_file($autoload) && is_file($lockFile)) {
	exit(0);
}

fwrite(STDERR, "WPify Scoper did not create {$autoload} and composer-deps.lock.\n");
exit($exitCode ?: 1);

/**
 * Run WPify Scoper in the requested mode.
 *
 * @param string $root Project root path.
 * @param string $mode WPify Scoper mode, either `install` or `update`.
 *
 * @return int Process exit code.
 */
function run_wpify_scoper(string $root, string $mode): int
{
	$binary = $root . '/vendor/bin/wpify-scoper';

	if (! is_file($binary)) {
		fwrite(STDERR, "Missing {$binary}. Run composer install first.\n");
		return 1;
	}

	passthru(escapeshellarg($binary) . ' ' . escapeshellarg($mode), $exitCode);

	return (int) $exitCode;
}

/**
 * Finish the latest complete WPify Scoper temp build.
 *
 * WPify Scoper can fail after PHP-Scoper succeeds but before its generated
 * postinstall command moves the scoped vendor directory into place.
 *
 * @param string $root Project root path.
 *
 * @return bool True when a temp build was completed successfully.
 */
function recover_wpify_scoper_build(string $root): bool
{
	$tempDirs = glob($root . '/tmp-*', GLOB_ONLYDIR) ?: [];

	usort(
		$tempDirs,
		static fn(string $a, string $b): int => filemtime($b) <=> filemtime($a)
	);

	foreach ($tempDirs as $tempDir) {
		$destination = $tempDir . '/destination';
		$postinstall = $tempDir . '/postinstall.php';

		if (! is_file($postinstall) || ! is_file($destination . '/vendor/scoper-autoload.php')) {
			continue;
		}

		fwrite(STDERR, "Finishing WPify Scoper temp build from " . basename($tempDir) . ".\n");

		$dumpAutoload = 'composer dump-autoload --working-dir=' . escapeshellarg($destination) . ' --optimize';
		passthru($dumpAutoload, $dumpExitCode);

		if (0 !== (int) $dumpExitCode) {
			continue;
		}

		passthru(PHP_BINARY . ' ' . escapeshellarg($postinstall), $postinstallExitCode);

		return 0 === (int) $postinstallExitCode;
	}

	return false;
}
