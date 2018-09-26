<?php

if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
		echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php') ) . '</a></p></div>';
	});
	
	add_filter('template_include', function($template) {
		return get_stylesheet_directory() . '/static/no-timber.html';
	});
	
	return;
}

Timber::$dirname = array('templates', 'views');

function cpt_gallery() {
  $labels = array(
    'name'               => _x( 'Gallery Images', 'post type general name' ),
    'singular_name'      => _x( 'Gallery Image', 'post type singular name' ),
    'add_new'            => _x( 'Add New', 'book' ),
    'add_new_item'       => __( 'Add New Product' ),
    'edit_item'          => __( 'Edit Gallery Image' ),
    'new_item'           => __( 'New Gallery Image' ),
    'all_items'          => __( 'All Gallery Images' ),
    'view_item'          => __( 'View Gallery Image' ),
    'search_items'       => __( 'Search Gallery Images' ),
    'not_found'          => __( 'No images found' ),
    'not_found_in_trash' => __( 'No images found in the Trash' ), 
    'parent_item_colon'  => ’,
    'menu_name'          => 'Gallery Images'
  );
  $args = array(
    'labels'        => $labels,
    'description'   => 'Holds gallery images and associated data',
    'public'        => true,
    'menu_position' => 5,
    'supports'      => array( 'title', 'editor', 'thumbnail' ),
    'has_archive'   => true,
  );
  register_post_type( 'gallery_image', $args ); 
}
add_action( 'init', 'cpt_gallery' );

class StarterSite extends TimberSite {

	function __construct() {
		add_theme_support( 'post-formats' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );
		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		parent::__construct();
	}

	function register_post_types() {
		//this is where you can register custom post types
	}

	function register_taxonomies() {
		//this is where you can register custom taxonomies
	}

	function add_to_context( $context ) {
		$context['foo'] = 'bar';
		$context['stuff'] = 'I am a value set in your functions.php file';
		$context['notes'] = 'These values are available everytime you call Timber::get_context();';
		$context['menu'] = new TimberMenu();
		$context['site'] = $this;
		$args = array(
			// Get post type project
			'post_type' => 'gallery_image',
			// Get all posts
			'posts_per_page' => -1,
			// Order by post date
			'orderby' => array(
					'date' => 'DESC'
			));
			
		$context['gallery'] = Timber::get_posts( $args );

		return $context;
	}

	function myfoo( $text ) {
		$text .= ' bar!';
		return $text;
	}

	function add_to_twig( $twig ) {
		/* this is where you can add your own functions to twig */
		$twig->addExtension( new Twig_Extension_StringLoader() );
		$twig->addFilter('myfoo', new Twig_SimpleFilter('myfoo', array($this, 'myfoo')));
		return $twig;
	}

}

new StarterSite();
