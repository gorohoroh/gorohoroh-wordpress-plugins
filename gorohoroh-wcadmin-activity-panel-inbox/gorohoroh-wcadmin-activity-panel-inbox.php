<?php
/**
 * Plugin Name: gorohoroh-wcadmin-activity-panel-inbox
 *
 * @package WC_Admin
 */

class Gorohoroh_WCAdmin_Activity_Panel_Inbox {
    const NOTE_NAME = 'wapi-example-plugin-one';

    /**
     * Adds a note to the merchant' inbox.
     */
    public static function add_activity_panel_inbox_welcome_note() {
        if ( ! class_exists( 'WC_Admin_Notes' ) ) {
            return;
        }

        if ( ! class_exists( 'WC_Data_Store' ) ) {
            return;
        }

        $data_store = WC_Data_Store::load( 'admin-note' );

        // First, see if we've already created this kind of note so we don't do it again.
        $note_ids = $data_store->get_notes_with_name( self::NOTE_NAME );
        foreach( (array) $note_ids as $note_id ) {
            $note         = WC_Admin_Notes::get_note( $note_id );
            $content_data = $note->get_content_data();
            if ( property_exists( $content_data, 'getting_started' ) ) {
                return;
            }
        }

        // Otherwise, add the note
        $activated_time = current_time( 'timestamp', 0 );
        $activated_time_formatted = date( 'F jS', $activated_time );
        $note = new WC_Admin_Note();
        $note->set_title( __( 'Getting Started', 'wapi-example-plugin-one' ) );
        $note->set_content(
            sprintf(
            /* translators: a date, e.g. November 1st */
                __( 'Plugin activated on %s.', 'wapi-example-plugin-one' ),
                $activated_time_formatted
            )
        );
        $note->set_content_data( (object) array(
            'getting_started'     => true,
            'activated'           => $activated_time,
            'activated_formatted' => $activated_time_formatted,
        ) );
        $note->set_type( WC_Admin_Note::E_WC_ADMIN_NOTE_INFORMATIONAL );
        // See https://automattic.github.io/gridicons/ for icon names.
        // Don't include the gridicons- part of the name.
        $note->set_icon( 'info' );
        $note->set_name( self::NOTE_NAME );
        $note->set_source( 'wapi-example-plugin-one' );
        // This example has two actions. A note can have 0 or 1 as well.
        $note->add_action(
            'settings',
            __( 'Open Settings', 'wapi-example-plugin-one' ),
            '?page=wc-settings&tab=general'
        );
        $note->add_action(
            'settings',
            __( 'Learn More', 'wapi-example-plugin-one' ),
            'https://github.com/woocommerce/woocommerce-admin/tree/master/docs'
        );
        $note->save();
    }

    /**
     * Removes any notes this plugin created.
     */
    public static function remove_activity_panel_inbox_notes() {
        if ( ! class_exists( 'WC_Admin_Notes' ) ) {
            return;
        }

        WC_Admin_Notes::delete_notes_with_name( self::NOTE_NAME );
    }
}

function wapi_example_one_activate() {
    Gorohoroh_WCAdmin_Activity_Panel_Inbox::add_activity_panel_inbox_welcome_note();
}
register_activation_hook( __FILE__, 'wapi_example_one_activate' );

function wapi_example_one_deactivate() {
    Gorohoroh_WCAdmin_Activity_Panel_Inbox::remove_activity_panel_inbox_notes();
}
register_deactivation_hook( __FILE__, 'wapi_example_one_deactivate' );