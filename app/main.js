function formatRatings(ratings) {
    var out = '';

    ratings.forEach(function (element) {
        if (element.Value != 'N/A')
            if (out != '')
                out = out + ', ' + element.Source + ': ' + element.Value;
            else out = element.Source + ': ' + element.Value;
    });
    return out;
}

function searchHandler() {
    var query = $('#search-type-selector').val() + encodeURIComponent($('#search-field').val().trim().toLowerCase());
    // console.log(query);
    console.log(`/${query}`);
    if (`/${query}`.length > 4) {
        $.get(`/${query}`, function (data, status) {
            console.log(data.Response);
            if (data.Response == 'False') {
                console.log(`Error: The Search failed`)
                $('#output-div').html(`<p id='error-out'>
                Error: The search failed :( make sure you didn't mispell the title or use an invalid id!
                </p>`)
            }
            else $('#output-div').html(`
            <div id='output-first-block'>
                <div id='output-text'>
                    <div id='output-head'>
                        <h1 class='output-h' id='movie-title'>${data.Title}</h1>
                        <p class='output-p' id='Director'>Directed by: ${data.Director}</p>
                        <p class='output-p' id='movie-writers'>Writers: ${data.Writer}</p>
                        <p class='output-p' id='movie-production'>Production: ${data.Production}</p>
                        <p class='output-p' id='movie-clan'>Launguage: ${data.Language}, Country: ${data.Country}</p>
                        <p class='output-p' id='view-rating'>Rated: ${data.Rated}</p>
                    </div>
                    <div id='output-body'>
                        <a id='movie-link' href='${data.Website}'>Go to website</a>
                        <p class='output-p' id='movie-year'>Release: ${data.Released}, DVD Release: ${data.DVD}</p>
                        <p class='output-p' id='movie-runtime'>Runtime: ${data.Runtime}</p>
                        <p class='output-p' id='movie-genre'>Genre: ${data.Genre}</p>
                        <p class='output-p' id='movie-ratings'>${formatRatings(data.Ratings)}</p>
                        <p class='output-p' id='movie-awards'>Awards: ${data.Awards}</p>
                        <p class='output-p' id='movie-earnings'>Box Office Earnings: ${data.BoxOffice}</p>
                    </div>
                </div>
                <div id='output-poster'>
                    <img id='movie-poster' src='${data.Poster}' alt='The official poster for the movie'>
                </div>
            </div>
            <div id='output-plot'>
                <p class='output-p' id='movie-plot'>Plot Summary: ${data.Plot}</p>
            </div>
            `);
        })
    }
    else console.log(`Error: No query in the search field`);

};

$('#search-movie').click(function () {
    searchHandler()
});
