<?php

$json = file_get_contents('test_Microdraw.txt');
$args = unserialize($json);

$origin = json_decode($args['origin']);
$slice = intval($origin->slice);
$source = str_replace('images/', '', $origin->source);
$user = (is_string($origin->user) == true) ? $origin->user : $origin->user->IP;

$value = json_decode($args['value']);
$filename = str_replace('http://ffuentes.medlab.upv.es/webseg_fran_github/images/', '', $value->Regions[0]->filename);

echo '<pre>';
var_dump($slice, $source, $user, $filename);


?>
