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

function checkForLink(link) {
    if (link != 'N/A') return `<a id='movie-link' href='${link}'>Go to website</a>`;
    else return `<p class='output-p' id='movie-no-link'>This movie has no homepage on OMDB</p>`
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
            <div id='output-container-div'>
                <div class='row'>
                    <div id='output-text'>
                        <div id='output-head'>
                            <h1 class='output-h' id='movie-title'>${data.Title}</h1>
                            <p class='output-p' id='Director'><b>Directed by:</b> ${data.Director}</p>
                            <p class='output-p' id='movie-writers'><b>Writers:</b> ${data.Writer}</p>
                            <p class='output-p' id='movie-production'><b>Production:</b> ${data.Production}</p>
                            <p class='output-p' id='movie-clan'><b>Launguage:</b> ${data.Language}, Country: ${data.Country}</p>
                            <p class='output-p' id='view-rating'><b>Rated:</b> ${data.Rated}</p>
                        </div>
                        <div id='output-body'>
                            <p class='output-p' id='movie-year'><b>Release:</b> ${data.Released}, DVD Release: ${data.DVD}</p>
                            <p class='output-p' id='movie-runtime'><b>Runtime:</b> ${data.Runtime}</p>
                            <p class='output-p' id='movie-genre'><b>Genre:</b> ${data.Genre}</p>
                            <p class='output-p' id='movie-ratings'>${formatRatings(data.Ratings)}</p>
                            <p class='output-p' id='movie-awards'><b>Awards:</b> ${data.Awards}</p>
                            <p class='output-p' id='movie-earnings'><b>Box Office Earnings:</b> ${data.BoxOffice}</p>
                            <p class='output-p' id='movie-plot'><b>Plot Summary:</b> ${data.Plot}</p>
                            ${checkForLink(data.Website)}
                        </div>
                    </div>
                    <div id='output-poster'>
                        <img id='movie-poster' src='${data.Poster}' alt='The official poster for the movie'>
                    </div>
                </div>
            </div>`);
        })
    }
    else console.log(`Error: No query in the search field`);

};

$('#search-movie').click(function () {
    searchHandler()
});
