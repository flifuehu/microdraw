<?php
$dir = dirname(__FILE__);
echo "<p>Full path to this dir: " . $dir . "</p>";
echo "<p>Full path to a .htpasswd file in this dir: " . $dir . "/.htpasswd" . "</p>";
?>

<?php

$json = file_get_contents('test_Microdraw.txt');
$args = unserialize($json);

$origin = json_decode($args['origin']);
$slice = intval($origin->slice);
$source = str_replace('images/', '', $origin->source);
$user = (is_string($origin->user) == true) ? $origin->user : $origin->user->IP;

$value = json_decode($args['value']);
$filename = str_replace('http://ffuentes.medlab.upv.es/webseg/images/', '', $value->Regions[0]->filename);

echo '<pre>';
var_dump($slice, $source, $user, $filename);


?>
