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

function add_currency_settings() {
    $currencies = array(
        array(
            'label' => __( 'United States Dollar', 'dev-blog-example' ),
            'value' => 'USD',
        ),
        array(
            'label' => __( 'New Zealand Dollar', 'dev-blog-example' ),
            'value' => 'NZD',
        ),
        array(
            'label' => __( 'Mexican Peso', 'dev-blog-example' ),
            'value' => 'MXN',
        ),
    );

    $data_registry = Automattic\WooCommerce\Blocks\Package::container()->get(
        Automattic\WooCommerce\Blocks\Assets\AssetDataRegistry::class
    );

    $data_registry->add( 'multiCurrency', $currencies );
}

add_action( 'init', 'add_currency_settings' );

function apply_currency_arg( $args ) {
    $currency = 'USD';

    if ( isset( $_GET['currency'] ) ) {
        $currency = sanitize_text_field( wp_unslash( $_GET['currency'] ) );
    }

    $args['currency'] = $currency;

    return $args;
}

add_filter( 'woocommerce_analytics_orders_query_args', 'apply_currency_arg' );
add_filter( 'woocommerce_analytics_orders_stats_query_args', 'apply_currency_arg' );

function add_join_subquery( $clauses ) {
    global $wpdb;

    $clauses[] = "JOIN {$wpdb->postmeta} currency_postmeta ON {$wpdb->prefix}wc_order_stats.order_id = currency_postmeta.post_id";

    return $clauses;
}

add_filter( 'woocommerce_analytics_clauses_join_orders_subquery', 'add_join_subquery' );
add_filter( 'woocommerce_analytics_clauses_join_orders_stats_total', 'add_join_subquery' );
add_filter( 'woocommerce_analytics_clauses_join_orders_stats_interval', 'add_join_subquery' );

function add_where_subquery( $clauses ) {
    $currency = 'USD';

    if ( isset( $_GET['currency'] ) ) {
        $currency = sanitize_text_field( wp_unslash( $_GET['currency'] ) );
    }

    $clauses[] = "AND currency_postmeta.meta_key = '_order_currency' AND currency_postmeta.meta_value = '{$currency}'";

    return $clauses;
}

add_filter( 'woocommerce_analytics_clauses_where_orders_subquery', 'add_where_subquery' );
add_filter( 'woocommerce_analytics_clauses_where_orders_stats_total', 'add_where_subquery' );
add_filter( 'woocommerce_analytics_clauses_where_orders_stats_interval', 'add_where_subquery' );

function add_select_subquery( $clauses ) {
    $clauses[] = ', currency_postmeta.meta_value AS currency';

    return $clauses;
}

add_filter( 'woocommerce_analytics_clauses_select_orders_subquery', 'add_select_subquery' );
add_filter( 'woocommerce_analytics_clauses_select_orders_stats_total', 'add_select_subquery' );
add_filter( 'woocommerce_analytics_clauses_select_orders_stats_interval', 'add_select_subquery' );