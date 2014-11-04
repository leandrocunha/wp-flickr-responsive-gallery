<?php 

    if (!class_exists('WP_List_Table'))
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );

    
    class FRG_WP_List_Table extends WP_List_Table {

        public function prepare_items() {

            $columns = $this->get_columns();
            $hidden = $this->get_hidden_columns();
            $sortable = $this->get_sortable_columns();
            $data = $this->table_data();
            $perPage = 20;
            $currentPage = $this->get_pagenum();
            $totalItems = count($data);
            $this->_column_headers = array($columns, $hidden, $sortable);
            $this->items = $data;
        }
 
        public function get_columns() {
            $columns = array(
                'name'          => 'Nome',
                'gallery_id'    => 'ID da Galeria',
                'shortcode'     => 'Shortcode'
            );
     
            return $columns;
        }
 
        public function get_hidden_columns() {
            return array();
        }
        
        public function get_sortable_columns(){
            return array('title' => array('title', false));
        }
 
        private function table_data(){
            
            global $wpdb;

            $data = array();
            $data = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "frg_fields");
     
            return $data;
        }
 
        public function column_default( $item, $column_name ) {
            switch( $column_name ) {
                case 'name':
                case 'gallery_id':
                case 'shortcode':
                    return $item->$column_name;

                default:
                    return print_r( $item, true ) ;
            }
        }
 
    private function sort_data( $a, $b ) {}
}