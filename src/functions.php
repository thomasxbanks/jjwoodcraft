<?php

if (! class_exists('Timber') ) {
    add_action(
        'admin_notices', function () {
            echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url(admin_url('plugins.php#timber')) . '">' . esc_url(admin_url('plugins.php')) . '</a></p></div>';
        }
    );
    
    add_filter(
        'template_include', function ($template) {
            return get_stylesheet_directory() . '/static/no-timber.html';
        }
    );
    
    return;
}

Timber::$dirname = array('templates', 'views');

function cpt_gallery()
{
    $labels = array(
    'name'               => _x('Gallery', 'post type general name'),
    'singular_name'      => _x('Image', 'post type singular name'),
    'add_new'            => _x('Add New', 'book'),
    'add_new_item'       => __('Add New Product'),
    'edit_item'          => __('Edit Gallery Image'),
    'new_item'           => __('New Gallery Image'),
    'all_items'          => __('All Gallery Images'),
    'view_item'          => __('View Gallery Image'),
    'search_items'       => __('Search Gallery Images'),
    'not_found'          => __('No images found'),
    'not_found_in_trash' => __('No images found in the Trash'), 
    'parent_item_colon'  => '',
    'menu_name'          => 'Gallery',
    );
    $args = array(
    'labels'        => $labels,
    'description'   => 'Holds gallery images and associated data',
    'public'        => true,
    'menu_position' => 5,
    'supports'      => array( 'title', 'editor', 'thumbnail' ),
    'has_archive'   => true,
    'taxonomies'  => array( 'category' ),
    'rewrite' => array(
        'slug' => 'gallery'
    )
    );
    register_post_type('gallery_image', $args); 
}
add_action('init', 'cpt_gallery');


/* This will add the text fields to the General Settings page */
$cta_copy = new call_to_action(
    array(
    'slug'       => 'cta_copy',
    'field_name' => 'cta_copy_field',
    'title'      => 'Call to action text',
    'type'       => 'text',
    )
);

class Call_to_action
{
    function __construct( $args )
    {
        $this->slug       = $args['slug'];
        $this->field_name = $args['field_name'];
        $this->title      = $args['title'];
        $this->type       = $args['type'];
        add_filter('admin_init', array( &$this, 'register_fields' ));
    }

    function register_fields()
    {
        register_setting('general', $this->slug, 'esc_attr');
        add_settings_field($this->field_name, '<label for="' . $this->slug . '">' . __($this->title, $this->slug) . '</label>', array( &$this, 'fields_html'), 'general');
    }

    function fields_html()
    {
        $value = get_option($this->slug, '');
        echo '<input type="' . $this->type . '" id="' . $this->slug . '" name="' . $this->slug . '" value="' . $value . '" />';
    }
}


class StarterSite extends TimberSite
{

    function __construct()
    {
        add_theme_support('post-formats');
        add_theme_support('post-thumbnails');
        add_theme_support('menus');
        add_theme_support('html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ));
        add_filter('timber_context', array( $this, 'add_to_context' ));
        add_filter('get_twig', array( $this, 'add_to_twig' ));
        add_action('init', array( $this, 'register_post_types' ));
        add_action('init', array( $this, 'register_taxonomies' ));
        parent::__construct();
    }

    function register_post_types()
    {
        //this is where you can register custom post types
    }

    function register_taxonomies()
    {
        //this is where you can register custom taxonomies
    }

    function add_to_context( $context )
    {
        $context['foo'] = 'bar';
        $context['stuff'] = 'I am a value set in your functions.php file';
        $context['notes'] = 'These values are available everytime you call Timber::get_context();';
        $context['menu'] = new TimberMenu();
        $context['primaryNavigation'] = new TimberMenu('Primary Navigation');
        $context['categoryNavigation'] = new TimberMenu('Category Navigation');
        $context['site'] = $this;
        $context['ctaCopy'] = get_option( 'cta_copy' );

        $args = array(
        // Get post type project
        'post_type' => 'gallery_image',
        // Get all posts
        'posts_per_page' => -1,
        // Order by post date
        'orderby' => array(
        'date' => 'DESC'
        ));
            
        $context['gallery'] = Timber::get_posts($args);

        return $context;
    }

    function myfoo( $text )
    {
        $text .= ' bar!';
        return $text;
    }

    function add_to_twig( $twig )
    {
        /* this is where you can add your own functions to twig */
        $twig->addExtension(new Twig_Extension_StringLoader());
        $twig->addFilter('myfoo', new Twig_SimpleFilter('myfoo', array($this, 'myfoo')));
        return $twig;
    }

}

new StarterSite();
