<?php


// NEED TO SEND POST OF movie_id




require_once("./inc/connect_pdo.php");

$movie_count = 24;

if(isset($_POST["movie_count"])){
	$movie_count= $_POST["movie_count"];
}

function get_cover ($movie_cover_id,$dbo) {
	$query = "SELECT name
	FROM image
	WHERE image_id = '$movie_cover_id' ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$image_name = stripslashes($row["0"]);
	}
	
	return $image_name;
}



$query = "SELECT movie_id, name, cover_id, date_me, rating
FROM movie
ORDER BY RAND() 
LIMIT 0,$movie_count";
//print("$query");
foreach($dbo->query($query) as $row) {
	$movie_id = stripslashes($row["0"]);
	$movie_name = stripslashes($row["1"]);
	$movie_cover_id = stripslashes($row["2"]);
	$movie_release_date = stripslashes($row["3"]);
	$movie_rating = stripslashes($row["4"]);
	
	$movie["movie_id"] = $movie_id;
	
	$movie["movie_name"] = $movie_name;
	$movie["cover_id"] = $movie_cover_id;
	$movie["rating"] = $movie_rating;
	$cover = get_cover($movie_cover_id,$dbo);
	$movie["cover_name"] = $cover;
	$movie["release_date"] = $movie_release_date;
	
	
	
	$movies[] = $movie;
}


$data = json_encode($movies);

header("Content-Type: application/json");

echo($data);




?>