$(document).ready(function()  {
    if(window.hasOwnProperty('Handlebars')) {
        Handlebars.registerHelper('lt', function(value, test, options) {
            if(value < test) {
                return options.fn(this);
            }
        });
    }

    try {
        if(!window.hasOwnProperty('site')) return;
        if(!site.hasOwnProperty('calendar')) return;

        switch(site.calendar.type) {
            case 'shows':
                getCalendarData(renderShowsCalendar);
                break;
            case 'artist':
                getCalendarData(renderArtistCalendar);
                break;

        }
    }catch(e) {
        console.log('error', e)
        // calendar vars are not set
    }
});

function getCalendarData(callback) {
    console.log('getting cal data')
    var endpoint = 'http://www.google.com/calendar/feeds/iic5ug7r1r1gnncqsi46bh0pe8%40group.calendar.google.com/public/full?alt=json-in-script&sortorder=ascending&orderby=starttime&futureevents=true&max-results=10'
    $.ajax({
        url: endpoint,
        type: "GET",
        success: callback,
        dataType: 'jsonp'
    });
}


function cleanedData(data) {
    var cleaned = {artists:{}};
    var total = data.feed.entry.length-1;
    var shows = data.feed.entry;

    $.each(shows, function(index, show) {
        var name = show.title.$t;
        if(!cleaned.artists.hasOwnProperty(name)) {
            cleaned.artists[name] = {name:name}
            cleaned.artists[name].shows = new Array();
            if(window.hasOwnProperty('site')) {
                cleaned.artists[name].thumbnail = site.artists[name].small;
            }
        }

        var obj = {};
        var m = moment(show.gd$when[0].startTime, 'YYYY-MM-DD');

        obj.name = name;
        obj.artist = show.title.$t;
        obj.time = {};
        obj.time.long = m.format('MMMM D, YYYY');
        obj.time.date = m.format('D');
        obj.time.dateLong = m.format('DD');
        obj.time.shortDayOfWeek = m.format('ddd');
        obj.time.longMonth = m.format('MMMM');
        obj.time.shortMonth = m.format('MMM');
        obj.time.year = m.format('YYYY')
        obj.when = show.gd$when[0].startTime || 'TBD';
        obj.where = show.gd$where[0].valueString || 'TBD';
        obj.description = show.content.$t || '';
        cleaned.artists[name].shows.push(obj);
    })
    return cleaned;
}

function renderShowsCalendar(data) {
    var cleaned = cleanedData(data);
    var template = Handlebars.compile(getShowsTemplate());
    $('#calendar').html(template(cleaned));
}

function renderArtistCalendar(data) {
    var cleaned = cleanedData(data);
    var artistData = null;
    var template = Handlebars.compile(getArtistTemplate());
    var total = 0;
    var delay = 300;

    $.each(cleaned.artists, function(key, value) {
        if(key !== site.calendar.artist) {
            delete cleaned.artists[key];
        }
    })
    
    if(cleaned.artists.hasOwnProperty(site.calendar.artist)) {
        total = cleaned.artists[site.calendar.artist].shows.length-1;
    }
    
    if(total <= 0) {
        var el = $('#show_heading').fadeOut('fast');
        $('#calendar').fadeOut('fast');
        return;
    }

    $('#calendar').html(template(cleaned));

    for(i=0; i<= total; i++) {
        var element = $("#cal"+String(i));
        var hr = $("#hr"+String(i));
        element.hide();
        hr.hide();
        d = delay*i;
        element.delay(d).fadeIn('fast');
        hr.delay(d).fadeIn('fast');
    }
}

// Get the shows page template
function getShowsTemplate() {
    return '{{#each artists}}'+
           '<h1 class="column grid_8 font_large">{{name}}</h1>'+
           '<hr class="column grid_8 section_hr">'+
           '<table style="width:640px;" class="cal_table">'+
           '  {{#each shows}}'+
           '  <tr id="cal{{@index}}">'+
           '    <td width="60" height="60">'+
           '      {{#lt @index 1}}'+
           '      <img src="{{../../thumbnail}}">'+
           '      {{/lt}}'+
           '    </td>'+
           '    <td width="60" class="cal_table_date">'+
           '      <p><span class="top_date">{{time.shortMonth}}</span></p>'+
           '      <p><span class="big_date">{{time.dateLong}}</span></p>'+
           '      <p><span class="bottom_date">{{time.shortDayOfWeek}}</span></p>'+
           '    </td>'+
           '    <td class="cal_table_description">'+
           '      {{where}}'+
           '       {{#if description}}'+
           '       <br><span class="font_tiny">{{description}}</span>'+
           '       {{/if}}'+
           '    </td>'+
           '  {{/each}}'+
           '  </tr>'+
           '</table>'+
           '{{/each}}';
}

function getArtistTemplate() {
    return '{{#each artists}}'+
           '  {{#each shows}}'+
           '    <div class="row release" id="cal{{@index}}" style="display: inline-block;">'+
           '      <div class="column grid_3" style="overflow:visible;">'+
           '        <div>'+
           '          <p class="font_small gray">{{time.long}}</p>'+
           '          <p>{{where}}<br><span class="event_description font_tiny"></span>'+
           '          </p>'+
           '        </div>'+
           '      </div>'+
           '    </div>'+
           '    <hr class="dotted_hr grid_3" id="hr{{@index}}" style="display: block;">'+
           '  {{/each}}'+
           '{{/each}}';
}
// Booking Calendar
function renderBookingCalendar(calData)
{
    var total = calData.feed.entry.length-1;
    var i = 0;
    var html = '';
    var obj;
    var header;
    var delay = 200;
    var element;
    var desc;
    
    html=
    '<div class="row release">'+
    '<ul class="column grid_5">';
    
    for(i; i<=total; i++)
    {
        obj = calData.feed.entry[i];
        header = (obj.link) ? '<a href="'+obj.link+'">'+obj.title+'</a>' : obj.title;
        description = obj.content.$t || '';
        where = obj.gd$where[0].valueString || 'TBD';
        startTime = obj.gd$when[0].startTime || 'TBD';
        if(startTime !== 'TBD') startTime = moment(startTime, 'YYYY-MM-DD').format('MMMM D, YYYY');
        /*
        obj = data.feed.entry[i];
        startTime = obj.gd$when[0].startTime || 'TBD';
        where = obj.gd$where[0].valueString || 'TBD';
        desc = obj.content.$t || '';
        if(startTime !== 'TBD') startTime = moment(startTime, 'YYYY-MM-DD').format('MMMM D, YYYY');
        */
        html+=
        '<li id="cal'+i+'">'+
        '<img class="cal_pic" width="60" height="60" src="'+obj.thumb+'" />'+
        '<div class="cal_list_description" id="desc'+i+'">'+
            '<h3 class="font_medium">'+header+'</h3>'+
            '<p class="font_small gray">'+obj.when+'</p>'+
            '<p>'+obj.where+'</p>'+
            '<p class="event_description font_tiny">'+description+'</p>'+
        '</div>';
        if(i<total) html+= '<hr class="dotted_hr grid_5" />';
        html += '</li>';
    }
    html+=
    '</ul>'+
    '</div>';
    
    $(calendar).html(html);

    for(i=0; i<= total; i++)
    {
        element = $("#cal"+String(i));
        desc = $("#desc"+String(i));
        
        element.hide();
        desc.hide();
        
        d = delay*i;
        
        element.delay(d).slideDown('fast');
        desc.delay(d+100).fadeIn('fast');
        
    }
    
}

/*
Artist Only Calendar
*/
function _renderArtistCalendar(data) {
    var total = data.feed.entry.length-1;
    var i = 0;
    var html = '';
    var obj;
    var delay = 300;
    
    if(total < 0)
    {
        element = $("#show_heading");
        element.fadeOut('fast');
        $(calendar).fadeOut('fast');
        $(calendar).html(html);
    }
    
    for(i; i<= total; i++)
    {
        obj = data.feed.entry[i];
        startTime = obj.gd$when[0].startTime || 'TBD';
        where = obj.gd$where[0].valueString || 'TBD';
        desc = obj.content.$t || '';
        if(startTime !== 'TBD') startTime = moment(startTime, 'YYYY-MM-DD').format('MMMM D, YYYY');

        html += '<div class="row release" id="cal'+String(i)+'">'+
            '<div class="column grid_3" style="overflow:visible;">'+
                '<div>'+
                    '<p class="font_small gray">'+startTime+'</p>'+
                    '<p>'+where+'<br />'+
                    '<span class="event_description font_tiny">'+
                        desc+
                    '</span>'+
                    '</p>'+
                '</div>'+
            '</div>'+
        '</div>';
        if(i < total) html+= '<hr class="dotted_hr grid_3" id="hr'+i+'"/>';
    }
    
    $(calendar).html(html);
    
    for(i=0; i<= total; i++) {
        element = $("#cal"+String(i));
        hr = $("#hr"+String(i));
        element.hide();
        hr.hide();
        d = delay*i;
        element.delay(d).fadeIn('fast');
        hr.delay(d).fadeIn('fast');
    }
}


// 
// Shows Page

function renderShowsPage(data) {
    console.log('rendering shows page')
    cleanedData(data);
    var total = data.feed.entry.length-1;
    var i = 0;
    var html = '';
    var obj;
    var delay = 500;
    var artists = new Array();
    var desc;
    var lastThumb = '';
    var image = '';
    var newArtist = false;
    var lastHeader = ''//data[0].title;
    var newHeader = false;
    console.log(total);
    //sortByArtist(data);
        /*
        obj = data.feed.entry[i];
        startTime = obj.gd$when[0].startTime || 'TBD';
        where = obj.gd$where[0].valueString || 'TBD';
        desc = obj.content.$t || '';
        if(startTime !== 'TBD') startTime = moment(startTime, 'YYYY-MM-DD').format('MMMM D, YYYY');
        */
     
    for(var j=0; j<=total; ++j)
    {
        obj = data.feed.entry[i];
        startTime = obj.gd$when[0].startTime || 'TBD';
        where = obj.gd$where[0].valueString || 'TBD';
        desc = obj.content.$t || '';
        if(startTime !== 'TBD') startTime = moment(startTime, 'YYYY-MM-DD')

        description = desc;//(data[j].description)  ? data[j].description : '';
        newArtist   = 'Artist'//(lastThumb != data[j].thumb) ? true : false;
        newHeader   = 'Hi' //(lastHeader != data[j].title) ? true : false;
        image       = ''//(newArtist) ? '<img src="'+data[j].thumb+'" />' : '';
        html        += //(newArtist) ? getArtistNameHTML(data[j].title) : '';
        html        += //(newArtist) ? '<table style="width:640px;" class="cal_table">' : '';
        html        += '<tr id="cal'+j+'">';
        html        += '<td width="60" height="60">'+image+'</td>';
        html        += '<td width="60" class="cal_table_date">'+
                            '<p><span class="top_date">'+startTime.format('MMM')+'</span></p>'+
                            '<p><span class="big_date">'+startTime.format('D')+'</span></p>'+
                            '<p><span class="bottom_date">'+startTime.format('ddd')+'</span></p>'+
                        '</td>';
        html        += '<td class="cal_table_description">'+where+'<br /><span class="font_tiny">'+description+'</span></td>';
        html        += '</tr>';
        if(data[j+1])
        {
            if(data[j+1].thumb != data[j].thumb) html += '</table>';
        }
        //lastHeader = data[j].title;
        //lastThumb = data[j].thumb;
    }

    $(calendar).html(html);
}


function sortByArtist(data)
{
    data.sort(function(a, b){
        var nameA=a.title.toLowerCase();
        var nameB=b.title.toLowerCase();
        //sort string ascending
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;//default return value (no sorting)
    });
    return data;
}