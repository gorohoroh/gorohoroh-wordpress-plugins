<?php
/**
 * Plugin Name: Gorohoroh plugins test Woocommerce
 * Developer: Jura Gorohovsky
 * Developer URI: https://www.twitter.com/gorohoroh
 *
 *
 * WC requires at least: 3.9
 * WC tested up to: 3.9.3
 */

defined( 'ABSPATH' ) || exit;

// check if WooCommerce is active:
if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {

	// check to ensure a class with the same name as your plugin doesn’t already exist
	if ( ! class_exists( 'Gorohoroh_plugins_test_Woocommerce' ) ) {

		// loading translated strings, if any
		load_plugin_textdomain( 'gorohoroh_plugins_test_woocommerce' );

		/* I prefer to define the bulk of my plugin functions within a class,
		which effectively scopes the functions you write and keeps you from having to worry about function name clashes
		with all the other WordPress core and plugin functions */
		class Gorohoroh_plugins_test_Woocommerce {

			public function __construct() {

				// called just before WC template functions are included
				add_action( 'init', array( $this, 'include_template_functions' ), 20 );

				// called only after WC has finished loading
				add_action( 'woocommerce_init', array( $this, 'woocommerce_loaded' ) );

				// called after all plugins have loaded
				add_action( 'plugins_loaded', array( $this, 'plugins_loaded' ) );

				if ( is_admin() ) {
				}

				if ( is_ssl() ) {
				}

				// take care of anything else that needs to be done immediately upon plugin instantiation, here in the constructor
			}

			/**
			 * Override any of the template functions from woocommerce/woocommerce-template.php
			 * with our own template functions file
			 */
			public function include_template_functions() {
				include( 'woocommerce-template.php' );
			}

			/**
			 * Take care of anything that needs woocommerce to be loaded.
			 * For instance, if you need access to the $woocommerce global
			 */
			public function woocommerce_loaded() {
			}

			/**
			 * Take care of anything that needs all plugins to be loaded
			 */
			public function plugins_loaded() {
			}
		}

		// finally instantiate our plugin class and add it to the set of globals
		$GLOBALS['gorohoroh_plugins_test_woocommerce'] = new Gorohoroh_plugins_test_Woocommerce();
	}
}

