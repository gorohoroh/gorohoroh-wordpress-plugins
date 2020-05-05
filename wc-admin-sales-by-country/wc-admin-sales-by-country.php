<?php
/**
 * Plugin Name: wc-admin-sales-by-country
 *
 * @package WC_Admin
 */

/**
 * Register the JS.
 */
function add_wc_admin_sales_by_country_register_script() {

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
		'wc-admin-sales-by-country',
		$script_url,
		$script_asset['dependencies'],
		$script_asset['version'],
		true
	);

	wp_register_style(
		'wc-admin-sales-by-country',
		plugins_url( '/build/style.css', __FILE__ ),
		// Add any dependencies styles may have, such as wp-components.
		array(),
		filemtime( dirname( __FILE__ ) . '/build/style.css' )
	);

	wp_enqueue_script( 'wc-admin-sales-by-country' );
	wp_enqueue_style( 'wc-admin-sales-by-country' );
}

function add_to_analytics_menu( $report_pages ) {

    $report_pages[] = array(
        'id' => 'wc-admin-sales-by-country',
        'title' => __('Sales by Country', 'wc-admin-sales-by-country'),
        'parent' => 'woocommerce-analytics',
        'path' => '/analytics/sales-by-country',
    );

    return $report_pages;
}

add_action( 'admin_enqueue_scripts', 'add_wc_admin_sales_by_country_register_script' );

add_filter( 'woocommerce_analytics_report_menu_items', 'add_to_analytics_menu' );

add_action( 'init', function () {
    wp_set_script_translations( 'wc-admin-sales-by-country', 'wc-admin-sales-by-country' );
});