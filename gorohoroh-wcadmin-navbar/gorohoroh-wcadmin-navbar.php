<?php
/**
 * Plugin Name: gorohoroh-wcadmin-navbar
 *
 * @package WC_Admin
 */

/**
 * Register the JS.
 */
function add_gorohoroh_wcadmin_navbar_register_script()
{

    if (!class_exists('Automattic\WooCommerce\Admin\Loader') || !\Automattic\WooCommerce\Admin\Loader::is_admin_page()) {
        return;
    }

    $script_path = '/build/index.js';
    $script_asset_path = dirname(__FILE__) . '/build/index.asset.php';
    $script_asset = file_exists($script_asset_path)
        ? require($script_asset_path)
        : array('dependencies' => array(), 'version' => filemtime($script_path));
    $script_url = plugins_url($script_path, __FILE__);

    wp_register_script(
        'gorohoroh-wcadmin-navbar',
        $script_url,
        $script_asset['dependencies'],
        $script_asset['version'],
        true
    );

    wp_register_style(
        'gorohoroh-wcadmin-navbar',
        plugins_url('/build/style.css', __FILE__),
        // Add any dependencies styles may have, such as wp-components.
        array(),
        filemtime(dirname(__FILE__) . '/build/style.css')
    );

    wp_enqueue_script('gorohoroh-wcadmin-navbar');
    wp_enqueue_style('gorohoroh-wcadmin-navbar');
}

add_action('admin_enqueue_scripts', 'add_gorohoroh_wcadmin_navbar_register_script');

add_action('admin_menu', function () {
    add_submenu_page('edit.php',
        'Gorohoroh navbar test',
        'Gorohoroh navbar test',
        'administrator',
        'gorohoroh-navbar-test',
        'gorohoroh_navbar_sample'
    );
});

function gorohoroh_navbar_sample()
{
    ?>
    <div class="wrap">
        <h2><?php _e('Navbar test - header'); ?></h2>
        <p><?php _e('Navbar test - regular text'); ?></p>
    </div>
    <?php
}

add_filter('woocommerce_navigation_current_screen_id', function ($screen_id) {
//    error_log($screen_id);
    return $screen_id;
//    posts_page_gorohoroh-navbar-test
});

function add_woocommerce_navigation_bar()
{
    if (function_exists('wc_admin_connect_page')) {
        wc_admin_connect_page(
            array(
                'id' => 'gorohoroh-wcadmin-navbar',
                'screen_id' => 'posts_page_gorohoroh-navbar-test',
                'title' => 'Gorohoroh navbar test',

            )
        );
    }

}

add_action('admin_menu', 'add_woocommerce_navigation_bar');

//wc_admin_connect_page(
//    array(
//        'id'        => 'woocommerce-orders',
//        'screen_id' => 'edit-shop_order',
//        'title'     => __( 'Orders', 'woocommerce-admin' ),
//        'path'      => add_query_arg( 'post_type', 'shop_order', 'edit.php' ),
//    )
//);
/*
     *   @type string       id           Id to reference the page.
     *   @type string|array title        Page title. Used in menus and breadcrumbs.
     *   @type string|null  parent       Parent ID. Null for new top level page.
     *   @type string       screen_id    The screen ID that represents the connected page. (Not required for registering).
     *   @type string       path         Path for this page. E.g. admin.php?page=wc-settings&tab=checkout
     *   @type string       capability   Capability needed to access the page.
     *   @type string       icon         Icon. Dashicons helper class, base64-encoded SVG, or 'none'.
     *   @type int          position     Menu item position.
     *   @type boolean      js_page      If this is a JS-powered page.

 * */

