<?php

use Automattic\WooCommerce\Admin\Notes\WC_Admin_Notes;
use Automattic\WooCommerce\Admin\Notes\WC_Admin_Note;

/**
 * Plugin Name: gorohoroh-wcadmin-activity-panel-inbox
 *
 * @package WC_Admin
 */

function get_note_name() { return 'gorohoroh-wcadmin-activity-panel-inbox-note'; }
function get_note_property() { return 'getting_started'; }

/**
 * Adds a note to the merchant' inbox.
 */
function add_activity_panel_inbox_welcome_note() {
    if ( ! class_exists( 'WC_Admin_Notes' ) ) return;
    if ( ! class_exists( 'WC_Data_Store' ) ) return;

    $data_store = WC_Data_Store::load( 'admin-note' );
/*
 * So the examples in https://woocommerce.github.io/woocommerce-admin/#/examples/activity-panel-inbox are apparently outdated
 * (11 months ago) and use some APIs that WC no longer provides. It does make sense to investigate what's going on, and possibly
 * submit a PR. For an example of internal usage of notes, see class WC_Admin_Notes_New_Sales_Record, lines 75 and below.
 * Try setting up WP debugging in PhpStorm:
 * * https://www.jetbrains.com/help/phpstorm/zero-configuration-debugging.html
 * * https://stackoverflow.com/questions/27549460/how-to-debug-wordpress-theme-with-phpstorm
 * */

    // First, see if we've already created this kind of note so we don't do it again.
    $existing_note = WC_Admin_Notes::get_note( get_note_name() );
    if ($existing_note) {
        $content_data = $existing_note->get_content_data();
        if ( property_exists( $content_data, get_note_property() ) ) {
            return;

        }
    }

    // Otherwise, add the note
    $activated_time = current_time( 'timestamp', true );
    $activated_time_formatted = date( 'F jS', $activated_time );

    $note = new WC_Admin_Note();
    $note->set_title( __( 'Hey from Gorohoroh!', 'wapi-example-plugin-one' ) );
    $note->set_content(
        sprintf(
            __( 'Plugin activated on %s.', 'gorohoroh-wcadmin-activity-panel-inbox-note' ),
            $activated_time_formatted
        )
    );
    $note->set_content_data( (object) array(
        get_note_property() => true,
        'activated'           => $activated_time,
        'activated_formatted' => $activated_time_formatted,
    ) );
    $note->set_type( WC_Admin_Note::E_WC_ADMIN_NOTE_INFORMATIONAL );
    $note->set_icon( 'info' );
    $note->set_name( get_note_name() );
    $note->set_source( 'gorohoroh-wcadmin-activity-panel-inbox-note' );
    $note->add_action(
        'settings',
        __( 'Open Settings', 'gorohoroh-wcadmin-activity-panel-inbox-note' ),
        '?page=wc-settings&tab=general'
    );
    $note->add_action(
        'settings',
        __( 'Learn More', 'gorohoroh-wcadmin-activity-panel-inbox-note' ),
        'https://github.com/gorohoroh'
    );
    $note->save();
}

/**
 * Removes any notes this plugin created.
 */
function remove_activity_panel_inbox_notes() {
    if ( ! class_exists( 'WC_Admin_Notes' ) ) return;

    WC_Admin_Notes::delete_notes_with_name( get_note_name() );
}

register_activation_hook( __FILE__, 'add_activity_panel_inbox_welcome_note' );
register_deactivation_hook( __FILE__, 'remove_activity_panel_inbox_notes' );