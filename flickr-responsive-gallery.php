<?php
/**
 * Plugin Name: Flickr Responsive Gallery
 * Plugin URI: https://github.com/leandrocunha/wp-flickr-responsive-gallery
 * Description: A brief description of the Plugin.
 * Version: 1.0
 * Author: Leandro Cunha aka. Frango
 * Author URI: http://frango.herokuapp.com/
 * License: MIT
 */

	defined('ABSPATH') or die("No script kiddies please!");



	/** 1) SETUP DATABASE BUILDER **/
	function frg_db_create() {
		global $wpdb;

		$wpdb->query("DROP TABLE IF EXISTS " . $wpdb->prefix . "frg_fields" );
		$sql = "CREATE TABLE IF NOT EXISTS `" . $wpdb->prefix . "frg_fields` (
			id int NOT NULL AUTO_INCREMENT,
			name CHAR(100) NOT NULL,
			gallery_id CHAR(100) NOT NULL,
			UNIQUE KEY id (id)
		);";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}


	/** 2) ADD MENU ON ADMIN SIDEBAR **/
	add_action( 'admin_menu', 'frg_menu' );

	function frg_menu() {
		add_menu_page( 'Flickr Responsive Gallery', 'Flickr Responsive Gallery', 'manage_options', 'flickr-responsive-gallery', 'frg_options', false, 58 );
		add_action( 'admin_init', 'register_mysettings' );
	}

	function frg_options() {
		if ( !current_user_can( 'manage_options' ) )  {
			wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
		}

		// show form
		echo '<div class="wrap">';
		echo '<h2>Flickr Responsive Gallery</h2>';
		echo '<div class="frg-content">';
		echo '<div class="frg-col-left">';
		global $wpdb;
		$db_name = $wpdb->prefix . "frg_fields";
		$retrieve_data = $wpdb->get_results("SELECT * FROM $db_name");

		echo '<ul>';
		foreach ($retrieve_data as $retrieved_data){
			echo '<li>' . $retrieved_data->name . ' | [flickr-responsive-gallery id="' . $retrieved_data->gallery_id . '"]</li>';
		}
		echo '</ul>';
		echo '</div>';
		echo '<div class="frg-col-right">';
		echo '<div class="wp-box">';
		echo '<form method="post" action="admin.php?page=flickr-responsive-gallery">';
		settings_fields( 'myoption-group' );
		do_settings_sections( 'myoption-group' );
		echo '<label for="name">Nome da galeria</label>';
		echo '<input name="name" type="text" />';
		echo '<label for="gallery_id">ID da galeria</label>';
		echo '<input name="gallery_id" type="text" />';
		echo '<input type="hidden" name="frg_form_submit" value="submit" />';
		submit_button();
		echo '</form>';
		echo '<div class="footer footer-blue"><ul class="hl"><li>Criado por Leandro Cunha aka. Frango</li></ul></div>';
		echo '</div>';
		echo '</div>';
		echo '</div>';
		echo '</div>';
	}

	function register_mysettings() {
		register_setting( 'myoption-group', 'name' );
		register_setting( 'myoption-group', 'gallery_id' );
	}


	function frg_shortcode($atts) {
		extract(shortcode_atts(array(
		      'id' => $atts
		   ), $atts));

		$tpl = '<div class="frg-wrapper" id="flickr-responsive-gallery">';
		$tpl .= '<p>Galeria de imagens do Flickr</p>';
		$tpl .= '<div class="frg-gallery" data-gid="' . $id . '"></div>';
		$tpl .= '</div>';

	  return $tpl;
	}
	add_shortcode('flickr-responsive-gallery', 'frg_shortcode');


	// save data
	if ( isset( $_POST['frg_form_submit'] ) ){
		add_option( 'name', $_POST['name']);
		add_option( 'gallery_id', $_POST['gallery_id']);
		$wpdb->insert(  $wpdb->prefix . "frg_fields", array( 'name' => $_POST['name'], 'gallery_id' => $_POST['gallery_id'] ) );
	}


	function frg_scripts() {
		wp_enqueue_style( 'frg-global', plugins_url('frg-global.css', __FILE__) );
		wp_enqueue_script( 'frg-script', plugins_url( 'script.js', __FILE__ ) );
	}

	add_action( 'wp_enqueue_scripts', 'frg_scripts' );


	function my_enqueue($hook) {
	   wp_enqueue_style( 'frg-global', plugins_url('frg-global.css', __FILE__) );
	}
	add_action( 'admin_enqueue_scripts', 'my_enqueue' );


	/** 3) UNINSTALL PLUGIN **/
	function frg_uninstall() {
		global $wpdb;

		$wpdb->query("DROP TABLE IF EXISTS " . $wpdb->prefix . "frg_fields" );

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}

	/** 4) REGISTER ACTIVATION/DEACTIVATION HOOK **/
	register_activation_hook( __FILE__, 'frg_db_create' );
	register_deactivation_hook( __FILE__, 'frg_uninstall' );

?>
