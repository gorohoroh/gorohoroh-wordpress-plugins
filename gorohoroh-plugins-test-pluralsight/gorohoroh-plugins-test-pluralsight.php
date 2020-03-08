<?php
/**
 * Plugin Name: Gorohoroh plugins test Pluralsight
 */

defined( 'ABSPATH' ) || exit;

function google_font_webfont_loader() {
	if ( ! is_admin() ) {
		wp_enqueue_style( 'playfair', 'https://fonts.googleapis.com/css?family=Playfair+Display:400,700&display=swap&subset=cyrillic,latin-ext', array(), '1.0', 'screen' );
		wp_enqueue_style( 'fonts', plugins_url( 'css/fonts.css', __FILE__ ), array(), '1.0', 'screen' );
	}

}

add_action( 'wp_enqueue_scripts', 'google_font_webfont_loader', 100 );

function gorohoroh_options_page() {
	?>
    <div class="wrap">
        <h2><?php _e( 'Plugin options test - header' ); ?></h2>
        <p><?php _e( 'Plugin options test - regular text' ); ?></p>
    </div>
	<?php
}

function add_options_page_to_menu() {
	add_submenu_page( 'options-general.php',
		__( 'Gorohoroh plugins test', 'gorohoroh-test' ),
		__( 'Gorohoroh plugins test', 'gorohoroh-test' ),
		'administrator',
		'gorohoroh-test',
		'gorohoroh_options_page'
	);
}

add_action( 'admin_menu', 'add_options_page_to_menu' );