<?php
/**
 * Plugin Name: gorohoroh-revenue-average-order
 *
 * @package WC_Admin
 */

/**
 * Register the JS.
 */
function add_gorohoroh_revenue_average_order_register_script() {

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
		'gorohoroh-revenue-average-order',
		$script_url,
		$script_asset['dependencies'],
		$script_asset['version'],
		true
	);

	wp_register_style(
		'gorohoroh-revenue-average-order',
		plugins_url( '/build/style.css', __FILE__ ),
		// Add any dependencies styles may have, such as wp-components.
		array(),
		filemtime( dirname( __FILE__ ) . '/build/style.css' )
	);

	wp_enqueue_script( 'gorohoroh-revenue-average-order' );
	wp_enqueue_style( 'gorohoroh-revenue-average-order' );
}

add_action( 'admin_enqueue_scripts', 'add_gorohoroh_revenue_average_order_register_script' );
