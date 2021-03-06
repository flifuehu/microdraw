<?php

$rootdir = "/webseg";

error_reporting(E_ALL);
ini_set('display_errors', 'On');

include $_SERVER['DOCUMENT_ROOT'].$rootdir."/php/base.php";
$connection=mysqli_connect($dbhost, $dbuser, $dbpass,$dbname) or die("MySQL Error 1: " . mysql_error());

if(isset($_GET["action"])) $action=$_GET;
if(isset($_POST["action"])) $action=$_POST;

switch($action["action"])
{
	case "save":
		save($action);
		break;
	case "load":
		load($action);
		break;
	case "load_last":
		loadLast($action);
		break;
	case "remote_address":
		remote_address();
		break;
}

function save($args)
{
	global $connection;
	global $dbname;
	global $rootdir;

	header("Access-Control-Allow-Origin: *");

	//file_put_contents('./test_microDraw.txt', serialize($args));

	$origin = json_decode($args['origin']);
	$slice = $origin->slice;
	$source = str_replace('images/', '', $origin->source);
	$user = (is_string($origin->user) == true) ? $origin->user : $origin->user->IP;
	$finished = (strcmp($args['finished'], 'true') == 0) ? 1 : 0;

	$value = json_decode($args['value']);
	$sliceName = str_replace($_SERVER['DOCUMENT_ROOT'].$rootdir.'/images/', '', $value->filename);
	$q="INSERT INTO ".$dbname.".KeyValue (myOrigin, myKey, myValue, mySlice, mySliceName, mySource, myUser, finished) VALUES('"
		.$args["origin"]."','"
		.$args["key"]."','"
		.mysqli_real_escape_string($connection,$args["value"])."',"
		.$slice.",'"
		.mysqli_real_escape_string($connection,$sliceName)."','"
		.mysqli_real_escape_string($connection,$source)."','"
		.mysqli_real_escape_string($connection,$user)."',"
		.mysqli_real_escape_string($connection,$finished).")";
		//die($q);
	$result = mysqli_query($connection,$q);

	header('Content-Type: application/json');
	if($result) {
		$response["result"]="success";
	} else {
		$response["result"]="error";
		$response["description"]=mysqli_error($connection);
	}
	echo json_encode($response);
}

function load($args)
{
	global $connection;
	global $dbname;
	$arr=array();

	header("Access-Control-Allow-Origin: *");

	$q="SELECT * FROM ".$dbname.".KeyValue WHERE "
		." myOrigin = '".$args["origin"]."' AND"
		." myKey = '".$args["key"]."'";
	$result = mysqli_query($connection,$q);

	while($row = mysqli_fetch_assoc($result)) {
		if($row["myValue"])
		{
			//$row["myValue"]=json_decode($row["myValue"]);
			array_push($arr,$row);
		}
	}

	header('Content-Type: application/text');
	echo json_encode($arr);

	mysqli_free_result($result);
}
function loadLast($args)
{
	global $connection;
	global $dbname;

	header("Access-Control-Allow-Origin: *");

	$q="SELECT * FROM ".$dbname.".KeyValue WHERE "
		." myOrigin = '".$args["origin"]."' AND"
		." myKey = '".$args["key"]."'"
		." ORDER BY myTimestamp DESC LIMIT 1";
	$result = mysqli_query($connection,$q);
	if(mysqli_num_rows($result)>0) {
		header('Content-Type: application/text');
		$row = mysqli_fetch_assoc($result);
		echo json_encode($row);
	}
	mysqli_free_result($result);
}
function remote_address()
{
	header("Access-Control-Allow-Origin: *");

	echo $_SERVER['REMOTE_ADDR'];
}
?>
