<?php
/**
 * Plugin Name: gorohoroh-wcadmin-extension-starter-pack
 *
 * @package WC_Admin
 */

/**
 * Register the JS.
 */
function add_extension_register_script() {

	if ( ! class_exists( 'Automattic\WooCommerce\Admin\Loader' ) || ! \Automattic\WooCommerce\Admin\Loader::is_admin_page() ) {
		return;
	}

	$script_path       = '/build/index.js';
	$script_asset_path = dirname( __FILE__ ) . '/build/index.asset.php';
	$script_asset      = file_exists( $script_asset_path )
		? require( $script_asset_path )
		: array( 'dependencies' => array(), 'version' => filemtime( $script_path ) );
	$script_url = plugins_url( $script_path, __FILE__ );

	wp_register_script(
		'gorohoroh-wcadmin-extension-starter-pack',
		$script_url,
		$script_asset['dependencies'],
		$script_asset['version'],
		true
	);

	wp_register_style(
		'gorohoroh-wcadmin-extension-starter-pack',
		plugins_url( '/build/style.css', __FILE__ ),
		// Add any dependencies styles may have, such as wp-components.
		array(),
		filemtime( dirname( __FILE__ ) . '/build/style.css' )
	);

	wp_enqueue_script( 'gorohoroh-wcadmin-extension-starter-pack' );
	wp_enqueue_style( 'gorohoroh-wcadmin-extension-starter-pack' );
}

add_action( 'admin_enqueue_scripts', 'add_extension_register_script' );
