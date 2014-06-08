function getCalendar(t,e){var a="http://www.google.com/calendar/feeds/iic5ug7r1r1gnncqsi46bh0pe8%40group.calendar.google.com/public/full?alt=json-in-script&sortorder=ascending&orderby=starttime&futureevents=true&max-results=10";t||(t="booking"),e||(e="Bruno Pronsato");var r="booking"==t?renderBookingCalendar:renderArtistCalendar;"all"==t&&(r=renderShowsPage),$.ajax({url:a,type:"GET",success:cleanedData,dataType:"jsonp"})}function cleanedData(t){var e={artists:{}},a=(t.feed.entry.length-1,t.feed.entry);$.each(a,function(t,a){var r=a.title.$t;e.artists.hasOwnProperty(r)||(e.artists[r]={name:r},e.artists[r].shows=new Array,window.hasOwnProperty("site")&&(e.artists[r].thumbnail=site.artists[r].small));var s={},n=moment(a.gd$when[0].startTime,"YYYY-MM-DD");s.name=r,s.artist=a.title.$t,s.time={},s.time.long=n.format("MMMM D, YYYY"),s.time.date=n.format("D"),s.time.dateLong=n.format("DD"),s.time.shortDayOfWeek=n.format("ddd"),s.time.longMonth=n.format("MMMM"),s.time.shortMonth=n.format("MMM"),s.time.year=n.format("YYYY"),s.when=a.gd$when[0].startTime||"TBD",s.where=a.gd$where[0].valueString||"TBD",s.description=a.content.$t||"",e.artists[r].shows.push(s)});var r=Handlebars.compile(getShowsTemplate());return $(calendar).html(r(e)),e}function getShowsTemplate(){return'{{#each artists}}<h1 class="column grid_8 font_large">{{name}}</h1><hr class="column grid_8 section_hr"><table style="width:640px;" class="cal_table">  {{#each shows}}  <tr id="cal{{@index}}">    <td width="60" height="60">      {{#lt @index 1}}      <img src="{{../../thumbnail}}">      {{/lt}}    </td>    <td width="60" class="cal_table_date">      <p><span class="top_date">{{time.shortMonth}}</span></p>      <p><span class="big_date">{{time.dateLong}}</span></p>      <p><span class="bottom_date">{{time.shortDayOfWeek}}</span></p>    </td>    <td class="cal_table_description">      {{where}}       {{#if description}}       <br><span class="font_tiny">{{description}}</span>       {{/if}}    </td>  {{/each}}  </tr></table>{{/each}}'}function renderBookingCalendar(t){var e,a,r,s,n=t.feed.entry.length-1,i=0,l="",o=200;for(l='<div class="row release"><ul class="column grid_5">',i;n>=i;i++)e=t.feed.entry[i],a=e.link?'<a href="'+e.link+'">'+e.title+"</a>":e.title,description=e.content.$t||"",where=e.gd$where[0].valueString||"TBD",startTime=e.gd$when[0].startTime||"TBD","TBD"!==startTime&&(startTime=moment(startTime,"YYYY-MM-DD").format("MMMM D, YYYY")),l+='<li id="cal'+i+'"><img class="cal_pic" width="60" height="60" src="'+e.thumb+'" /><div class="cal_list_description" id="desc'+i+'"><h3 class="font_medium">'+a+'</h3><p class="font_small gray">'+e.when+"</p><p>"+e.where+'</p><p class="event_description font_tiny">'+description+"</p></div>",n>i&&(l+='<hr class="dotted_hr grid_5" />'),l+="</li>";for(l+="</ul></div>",$(calendar).html(l),i=0;n>=i;i++)r=$("#cal"+String(i)),s=$("#desc"+String(i)),r.hide(),s.hide(),d=o*i,r.delay(d).slideDown("fast"),s.delay(d+100).fadeIn("fast")}function renderArtistCalendar(t){var e,a=t.feed.entry.length-1,r=0,s="",n=300;for(0>a&&(element=$("#show_heading"),element.fadeOut("fast"),$(calendar).fadeOut("fast"),$(calendar).html(s)),r;a>=r;r++)e=t.feed.entry[r],startTime=e.gd$when[0].startTime||"TBD",where=e.gd$where[0].valueString||"TBD",desc=e.content.$t||"","TBD"!==startTime&&(startTime=moment(startTime,"YYYY-MM-DD").format("MMMM D, YYYY")),s+='<div class="row release" id="cal'+String(r)+'"><div class="column grid_3" style="overflow:visible;"><div><p class="font_small gray">'+startTime+"</p><p>"+where+'<br /><span class="event_description font_tiny">'+desc+"</span></p></div></div></div>",a>r&&(s+='<hr class="dotted_hr grid_3" id="hr'+r+'"/>');for($(calendar).html(s),r=0;a>=r;r++)element=$("#cal"+String(r)),hr=$("#hr"+String(r)),element.hide(),hr.hide(),d=n*r,element.delay(d).fadeIn("fast"),hr.delay(d).fadeIn("fast")}function renderShowsPage(t){console.log("rendering shows page"),cleanedData(t);var e,a,r=t.feed.entry.length-1,s=0,n="",i=(new Array,""),d=!1,l=!1;console.log(r);for(var o=0;r>=o;++o)e=t.feed.entry[s],startTime=e.gd$when[0].startTime||"TBD",where=e.gd$where[0].valueString||"TBD",a=e.content.$t||"","TBD"!==startTime&&(startTime=moment(startTime,"YYYY-MM-DD")),description=a,d="Artist",l="Hi",i="",n+=n+=n+='<tr id="cal'+o+'">',n+='<td width="60" height="60">'+i+"</td>",n+='<td width="60" class="cal_table_date"><p><span class="top_date">'+startTime.format("MMM")+'</span></p><p><span class="big_date">'+startTime.format("D")+'</span></p><p><span class="bottom_date">'+startTime.format("ddd")+"</span></p></td>",n+='<td class="cal_table_description">'+where+'<br /><span class="font_tiny">'+description+"</span></td>",n+="</tr>",t[o+1]&&t[o+1].thumb!=t[o].thumb&&(n+="</table>");$(calendar).html(n)}function sortByArtist(t){return t.sort(function(t,e){var a=t.title.toLowerCase(),r=e.title.toLowerCase();return r>a?-1:a>r?1:0}),t}$(document).ready(function(){Handlebars.registerHelper("lt",function(t,e,a){return e>t?a.fn(this):void 0});try{}catch(t){console.log("error",t)}var e=e||"",a=a?a:!1;getCalendar(e,a)});