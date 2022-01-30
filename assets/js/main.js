function getStars(num) {
    num = num / 2;
    numFloor = Math.floor(num);
    let stars = "";
    for (let i = 0; i < numFloor; i++){ 
        stars += '<i class="fa-solid fa-star reviewStar"></i>';
    }
    let difference = num - numFloor;
    if (difference >= 0.5){
        stars += '<i class="fas fa-star-half  reviewStar"></i>';
    }
    return stars;
}
function getRating(num){
    return num/2; //5 max rating.
}
function getSplashData(htmlDataDestination, htmlDataDestination1) {
    $(htmlDataDestination).empty();
    $(htmlDataDestination1).empty();
    let getSplashContent = $.ajax({
        url: "./assets/services/splash.php",
        type: "POST",
        data: jQuery.param({ movie_count: 18}) , //number of movies requested.
        dataType: "json"
        });
        
        getSplashContent.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getSplash)" +
        textStatus);
        });

        getSplashContent.done(function (data) {
            let content = ``;
            let popular = ``;
            $.each(data, function (i, item) {
                let movie_id = item.movie_id;
                let movie_name = item.movie_name;
                let cover_id = item.cover_id;
                let cover_name = item.cover_name;
                let rating = item.rating;
                if (i%2==0){
                    content += `<div data-id="${movie_id}" class="card movie_card movie">
                    <div class="movie_poster">
                        <img class="movie_poster_img" src="./uploads/${cover_id}/${cover_name}" alt="${movie_name}">
                    </div>
                    <p class="movie_name">${movie_name}</p>
                    <p class="movie_details">${getStars(rating)} ${getRating(rating)} </p>
                </div>`;
                }
                else{
                    popular += `<div data-id="${movie_id}" class="card movie_card movie">
                                        <div class="movie_poster">
                                            <img class="movie_poster_img" src="./uploads/${cover_id}/${cover_name}" alt="${movie_name}">
                                        </div>
                                        <p class="movie_name">${movie_name}</p>
                                        <p class="movie_details">${getStars(rating)} ${getRating(rating)} </i></p>
                                    </div>`;
                }
            });
            $(htmlDataDestination).html(content);
            $(htmlDataDestination1).html(popular);
            $(".splash-container").show(); 
            initializeSplashSlider();
            });
}

function getMovieData(id, movieCastElement, movieImagesElement, relatedMoviesElement){
    $(movieCastElement).empty();
    $(movieImagesElement).empty();
    $(relatedMoviesElement).empty();
    let getMovie = $.ajax({
        url: "./assets/services/movie.php",
        type: "POST",
        data: {
            movie_id: id
        },
        dataType: "json"
    });

    getMovie.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });

    getMovie.done(function (data) {
        
        $('#movie_page_title').text(data.movie_name);
        let poster_path = `./uploads/${data.cover_image_id}/${data.cover_image_name}`;
        $(".movie_poster_img").attr("src", poster_path).attr("alt", data.movie_name);
        $("#videoContainer").empty(); //clear video child element.
        $("#videoContainer").append(
            `<iframe id="movie_video" width="100%" height="326px" src="https://www.youtube.com/embed/${data.youtube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        );
        $('#movie_description').text(data.description);
        let writers = [];
        $.each(data.writers, function(i, item){
            writers.push(item.name);
        });
        $('#movie_writers').text(writers.join(", "));
        $('#movie_duration').text(data.run_length);
        $('#movie_language').text(data.language);
        $('#movie_country').text(data.country);
        $('#movie_colour').text(data.colour);
        $('#movie_date').text(data.movie_date_me);
        $('#movie_rating').text( getRating(data.movie_rating));
        $('#movie_didyouknow').html(data.movie_didyouknow);
        if (!data.movie_didyouknow) {
            $('.didyouknowContents').attr("style", "display: none !important"); //Hide related items;
        }
        else{
            $('.didyouknowContents').attr("style", "display: block !important"); //show related items;
        }
        // $('#movie_audience').text(data.description);
        let movieCast = '';
        let movieCastCount = 0;
        $.each(data.cast, function (i, item) {
            movieCastCount++;
            let people_id = item.people_id;
            let name = item.name;
            let image_id = item.image_id;
            let image_name = item.image_name;
            let character_name = item.character_name;
            movieCast += ` <div data-id="${people_id}" class="card movie_card actor">
                            <div class="actor_photo">
                                <img class="actor_photo_img" src="./uploads/${image_id}/${image_name}" alt="${name}">
                            </div>
                            <p class="actor_name">${name}</p>
                            <p class="character_name">${character_name}</p>
                        </div>`;
        });
        $(movieCastElement).html(movieCast);

        let imageContent = '';
        let movieImagesCount = 0;
        $.each(data.movie_images, function (i, item) {
            movieImagesCount++;
            let image_id = item.id;
            let image_name = item.name;
            imageContent += `<div data-id="${image_id}" class="card image_card">
                            <div class="movie_image">
                                <img class="movie_image_img" src="./uploads/${image_id}/${image_name}" alt="${image_name}">
                            </div>
                        </div>`;
        });
        $(movieImagesElement).html(imageContent);

        let movieRelated = '';
        let movieRelatedCount = 0;
        $.each(data.related_movies, function (i, item) {
            movieRelatedCount++;
            let movie_id = item.movie_id;
            let movie_name = item.movie_name;
            let cover_id = item.id;
            let cover_name = item.name;
            let rating = item.rating;
            movieRelated += `<div data-id="${movie_id}" class="card movie_card movie">
                            <div class="movie_poster">
                                <img class="movie_poster_img" src="./uploads/${cover_id}/${cover_name}" alt="${movie_name}">
                            </div>
                            <p class="movie_name">${movie_name}</p>
                            <p class="movie_details">${getStars(rating)} ${getRating(rating)} </i></p>
                        </div>`;
        });
        $(relatedMoviesElement).html(movieRelated);

    $(".movie-container").show();
    initializeMoviePageSliders();

    if (movieCastCount > 0) {
        $('.movieCastContents').attr("style", "display: flex !important"); //Show as long as there is one;
    }
    else{
        $('.movieCastContents').attr("style", "display: none !important"); //Hide related items;
    }
    if (movieImagesCount > 0) {
        $('.movieImagesContent').attr("style", "display: flex !important"); //Show as long as there is one;
    }
    else{
        $('.movieImagesContent').attr("style", "display: none !important"); //Hide related items;
    }
    
    if (movieRelatedCount > 0) {
        $('.movieRelatedContents').attr("style", "display: flex !important"); //Show as long as there is one;
    }
    else{
        $('.movieRelatedContents').attr("style", "display: none !important"); //Hide related items;
    }
});
}

function getActorData(id, actorMoviesElement, actorPhotosElement){
    $(actorMoviesElement).empty();
    $(actorPhotosElement).empty();
    let getActor = $.ajax({
        url: "./assets/services/people.php",
        type: "POST",
        data: {
            people_id: id
        },
        dataType: "json"
    });

    getActor.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getActor)" +
            textStatus);
    });

    getActor.done(function (data) {
        
        $('#actor_page_title').text(data.people_name);
        let actorPhoto_path = `./uploads/${data.cover_image_id}/${data.cover_image_name}`;
        $("#actor_photo_img").attr("src", actorPhoto_path).attr("alt", data.people_name);
        $('#actor_biography').html(data.people_biography);
        $('#actor_born').text(`Born: ${data.born}`);
        if (!data.died.includes('live')){
            $('#actor_died').text(`Died: ${data.died}`);
        }
        // $('#movie_audience').text(data.description);
        let movieRelated = '';
        let actorMoviesCount = 0;
        $.each(data.movies, function (i, item) {
            actorMoviesCount++;
            let movie_id = item.movie_id;
            let movie_name = item.movie_name;
            let cover_id = item.image_id;
            let cover_name = item.image_name;
            let character_name = item.character_name;
            let rating = item.movie_rating;
            movieRelated += `<div data-id="${movie_id}" class="card movie_card movie">
                            <div class="movie_poster">
                                <img class="movie_poster_img" src="./uploads/${cover_id}/${cover_name}" alt="${movie_name}">
                            </div>
                            <p class="movie_name">${movie_name}</p>
                            <p class="movie_details"> ${character_name}</p>
                            <p class="movie_details">${getStars(rating)} ${getRating(rating)} </i></p>
                        </div>`;
        });
        $(actorMoviesElement).html(movieRelated);

        let actorPhotos = '';
        let actorPhotosCount = 0;
        $.each(data.people_images, function (i, item) {
            actorPhotosCount++;
            let image_id = item.id;
            let image_name = item.name;
            actorPhotos += `<div data-id="${image_id}" class="card image_card">
                                <div class="movie_image">
                                    <img class="movie_image_img" src="./uploads/${image_id}/${image_name}" alt="${image_name}">
                                </div>
                            </div>`;
        });
        $(actorPhotosElement).html(actorPhotos);

    $(".people-container").show();
    initializeActorPageSlider();

    if (actorPhotosCount > 0) {
        $('.actorPhotosContents').attr("style", "display: flex !important"); //Show as long as there is one;
    }
    else{
        $('.actorPhotosContents').attr("style", "display: none !important"); //Hide related items;
    }
    if (actorMoviesCount > 0) {
        $('.actorMoviesContents').attr("style", "display: flex !important"); //Show as long as there is one;
    }
    else{
        $('.actorMoviesContents').attr("style", "display: none !important"); //Hide related items;
    }
    });
}

function getSplash() {
    $(".hideAll").hide();
    //TODO: Sort by most recent
    getSplashData('.splash-grid-upcoming', '.splash-grid-popular'); //New and upcoming. I should sort this by new & upcoming
}

function getMovie(id) {
    $(".hideAll").hide();
    getMovieData(id,".movie_actors_grid",".movie_images_grid", ".related_movies_grid")
        
}

function getPerson(id) {
    $(".hideAll").hide();
    $(".actor-movies").empty();
    $(".actor-photos").empty();
    getActorData(id, ".actor-movies",".actor-photos");
}

function getSlidesToShow(className) {
    let numberOfCards = $(`${className}`).children().length;
    if (numberOfCards == 0){
        numberOfCards = 6;
    }
    console.log(`Number of cards to show for ${className}: ` + numberOfCards);
    if (numberOfCards>1){
        if(numberOfCards < 7){
            // return numberOfCards  - 1; //It doesn't 'scroll' if number is the same
            return numberOfCards;
        }
        else{
            return 6; //Return default max number of slides to show.
        }
    }
    else{
        return 1;
    } 
}
//Holds all sliders for splash page
function initializeSplashSlider() {
    let _slidesToShow = getSlidesToShow('.new-movies-slider');
    $('.new-movies-slider').slick({
        slidesToShow: _slidesToShow,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        dots: true,
        infinite: true,
        responsive: [
            {
            breakpoint: 960,
            settings: {
                slidesToShow: (_slidesToShow<5) ? _slidesToShow : 4,
                slidesToScroll: 1
            }
            },
            {
            breakpoint: 768,
            settings: {
                slidesToShow: (_slidesToShow<4)? _slidesToShow : 3,
                slidesToScroll: 1,
                autoplay: true,
                    }
            },
            {
                breakpoint: 468,
                settings: {
                    slidesToShow: (_slidesToShow > 1) ? 2 : 1,
                    slidesToScroll: 1
                },
            },
            {
                breakpoint: 328,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                },
            }
        ]
    });
    _slidesToShow = getSlidesToShow('.popular-movies-slider');
    $('.popular-movies-slider').slick({
        slidesToShow: _slidesToShow,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3500,
        dots: true,
        infinite: true,
        responsive: [
            {
            breakpoint: 960,
            settings: {
                slidesToShow: (_slidesToShow<5) ? _slidesToShow : 4,
                slidesToScroll: 1
            }
            },
            {
            breakpoint: 768,
            settings: {
                slidesToShow: (_slidesToShow<4)? _slidesToShow : 3,
                slidesToScroll: 1,
                autoplay: true,
                    }
            },
            {
                breakpoint: 468,
                settings: {
                    slidesToShow: (_slidesToShow > 1) ? 2 : 1,
                    slidesToScroll: 1
                },
            },
            {
                breakpoint: 328,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                },
            }
        ]
    });
}
//destroys all sliders for splash page
function destroySplashSlider() {
    try{
        $('.new-movies-slider').slick("unslick");
        $('.popular-movies-slider').slick("unslick");
    }
    catch(err){

    }
}

function initializeMoviePageSliders() {
    //Determine slides to show to fix bug
    let _slidesToShow = getSlidesToShow('.movie-cast-slider');
    $('.movie-cast-slider').slick({
        slidesToShow: _slidesToShow,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        dots: true,
        infinite: true,
        responsive: [
            {
            breakpoint: 960,
            settings: {
                slidesToShow: (_slidesToShow<5) ? _slidesToShow : 4,
                slidesToScroll: 1
            }
            },
            {
            breakpoint: 768,
            settings: {
                slidesToShow: (_slidesToShow<5)? _slidesToShow : 3,
                slidesToScroll: 1,
                autoplay: true,
                    }
            },
            {
                breakpoint: 468,
                settings: {
                    slidesToShow: (_slidesToShow > 1) ? 2 : 1,
                    slidesToScroll: 1
                },
            },
            {
                breakpoint: 328,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                },
            }
        ]
    });
    _slidesToShow = getSlidesToShow('.related-images-slider');
    console.log(`Initializing related-images-slider with ${_slidesToShow} slides`);
    $('.related-images-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3500,
        dots: true,
        infinite: true,
        variableWidth: true
    });
    _slidesToShow = getSlidesToShow('.related-movies-slider');
    $('.related-movies-slider').slick({
        slidesToShow: _slidesToShow,
        slidesToScroll: 1,
        autoplaySpeed: 3500,
        dots: true,
        infinite: true,
        responsive: [
            {
            breakpoint: 960,
            settings: {
                slidesToShow: (_slidesToShow<5) ? _slidesToShow : 4,
                slidesToScroll: 1
            }
            },
            {
            breakpoint: 768,
            settings: {
                slidesToShow: (_slidesToShow<4)? _slidesToShow : 3,
                slidesToScroll: 1,
                autoplay: true,
                    }
            },
            {
                breakpoint: 468,
                settings: {
                    slidesToShow: (_slidesToShow > 1) ? 2 : 1,
                    slidesToScroll: 1
                },
            },
            {
                breakpoint: 328,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                },
            }
        ]
    });
}

function destroyMoviePageSliders() {
    try{
        $('.movie-cast-slider').slick("unslick");
        $('.related-images-slider').slick("unslick");
        $('.related-movies-slider').slick("unslick");
    }
    catch(err){

    }

}

function initializeActorPageSlider() {
    let _slidesToShow = getSlidesToShow('.actor-movies-slider');
    $('.actor-movies-slider').slick({
        slidesToShow: _slidesToShow,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        dots: true,
        infinite: true,
        responsive: [
            {
            breakpoint: 960,
            settings: {
                slidesToShow: (_slidesToShow<5) ? _slidesToShow : 4,
                slidesToScroll: 1
            }
            },
            {
            breakpoint: 768,
            settings: {
                slidesToShow: (_slidesToShow<4) ? _slidesToShow : 3,
                slidesToScroll: 1,
                autoplay: true,
                    }
            },
            {
                breakpoint: 468,
                settings: {
                    slidesToShow: (_slidesToShow > 1) ? 2 : 1,
                    slidesToScroll: 1
                },
            },
            {
                breakpoint: 328,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                },
            }
        ]
    });
    _slidesToShow = getSlidesToShow('.actor-photos-slider');
    $('.actor-photos-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3500,
        dots: true,
        infinite: true,
        variableWidth: true
    });
}
//destroys all sliders for splash page
function destroyActorPageSlider() {
    try{
        $('.actor-movies-slider').slick("unslick");
        $('.actor-photos-slider').slick("unslick");
    }
    catch(err){

    }
}

function clearElements(){
    console.log('Destroying sliders');
    destroyActorPageSlider();
    destroySplashSlider();
    destroyMoviePageSliders();
}


function getSearch(search) {

    // call movie XHR
    let getSearch = $.ajax({
        url: "./assets/services/search.php",
        type: "POST",
        data: {
            search_text: search
        },
        dataType: "json"
    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getSearch)" +
            textStatus);
    });

    getSearch.done(function (data) {

        if (data == null) {
            $(".search-container").hide();
        } else {

            let content = ``;
            $.each(data, function (i, item) {

                if (item.type == "1") {
                    let movie_id = item.movie_id;
                    let movie_name = item.movie_name;
                    let cover_id = item.cover_id;
                    let cover_name = item.cover_name;

                    content += `<div class="clearFloat search-margin movie" data-id="${movie_id}">
                                <div class="search-image">
                                    <img src="./uploads/${cover_id}/${cover_name}" alt="${movie_name}">
                                </div>
                                <div class="search-text">${movie_name}</div>
                            </div>`;
                } else {
                    let people_id = item.people_id;
                    let name = item.name;
                    let cover_id = item.cover_id;
                    let cover_name = item.cover_name;

                    content += `<div class="clearFloat search-margin actor" data-id="${people_id}">
                                <div class="search-image">
                                    <img src="./uploads/${cover_id}/${cover_name}" alt="${name}">
                                </div>
                                <div class="search-text"><p>${name}</p></div>
                            </div>`;
                }

            });
            $(".search-container").html(content).show();
        }
    });
}

$(window).on("load", function () {
    console.log('Windows onload finished'); 
    $(".splash").click(function () {
        location.href = "#/splash/";
    });

    $(document).on('click', 'body .movie', function () {
        let id = $(this).attr("data-id");
        location.href = `#/movie/${id}`;
    });

    $(document).on('click', 'body .actor', function () {
        let id = $(this).attr("data-id");
        location.href = `#/people/${id}`;
    });

    $("#search").keyup(
        function () {
            let search = $(this).val();
            console.log(search);
            getSearch(search);
        }
    ).focus(function () {
        let search = $(this).val();
        console.log(search);
        getSearch(search);
    });

    let app = $.sammy(function () {

        this.get('#/splash/', function () {
            clearElements();
            getSplash();
            window.scrollTo(0,0);
        });

        this.get('#/movie/:id', function () {
            console.log('Navigating to specific movie');
            clearElements();
            let id = this.params["id"];
            getMovie(id);
            window.scrollTo(0,0);
        });

        this.get('#/people/:id', function () {
            clearElements();
            let id = this.params["id"];
            getPerson(id);
            window.scrollTo(0,0);
        });
        

    });
//Load Splash Page on load
    $(function () {
        app.run('#/splash/');
    });
});





