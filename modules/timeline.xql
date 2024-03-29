xquery version "3.1";

declare namespace output="http://www.w3.org/2010/xslt-xquery-serialization";
declare namespace wiki="http://exist-db.org/xquery/wiki";
declare namespace atom="http://www.w3.org/2005/Atom";
declare namespace xhtml="http://www.w3.org/1999/xhtml";
declare namespace http="http://expath.org/ns/http-client";

declare option output:method "html5";
declare option output:media-type "text/html";

declare variable $local:WIKI_ROOT := "http://exist-db.org/exist/apps/wiki";

response:set-header("Cache-Control", "no-cache"),

let $start := request:get-parameter("start",1)
let $count := request:get-parameter("count",10)
let $timelineURLString := "https://exist-db.org/exist/apps/wiki/modules/feeds.xql?feed=eXist&amp;start=" || $start || "&amp;count=" || $count
let $data := http:send-request(
    <http:request method='get' />,$timelineURLString)
  let $entries :=
    for $entry in $data//atom:entry
    let $date := ($entry/atom:updated, $entry/atom:published)[1]
    order by xs:dateTime($date) descending
    return $entry

for $entry in $entries
let $dateStr := ($entry/atom:updated, $entry/atom:published)[1]
let $date := xs:dateTime($dateStr/text())
let $age := current-dateTime() - $date
let $minutesSince := minutes-from-duration($age)
let $hoursSince := hours-from-duration($age)
let $daysSince := days-from-duration($age)
let $path := $local:WIKI_ROOT ||substring-after($entry/atom:link[@type eq 'blog']/@href, "/db/apps/wiki/data")
let $title := $entry/atom:title/text()
let $abstract := head($entry//xhtml:p)
let $image := subsequence($entry/atom:content//xhtml:img[1]/@src,1,1)

let $header := 
    http:send-request(
      <http:request method='head' />,
      (concat($path,"/",$image))
    )
let $h := $header[1]

let $checkresult := $h/@status = 200


let $imgOut := if (string-length($image) != 0 and $checkresult) then
    <img src="{$path}/{$image}" class="wow zoomIn" />
else ()


let $category := (data($entry/atom:category/@term), "news")[1]
let $icon := switch($category)
    case "article" return "fa-quote-left"
    case "release" return "fa-paper-plane"
    case "LTSrelease" return "fa-space-shuttle"
    default return "fa-bullhorn"

let $output :=  if(exists($entry/atom:category)) then
    <div class="col-md-12 exist-timeline-block wow slideInDown">
        <div class="exist-timeline-img {$category}" title="{$category}">
            <i class="fa {$icon}"/>
        </div>
        <div class="exist-timeline-content">
            <h2>{$title}</h2>
            {$imgOut}
            <p>
                {$abstract || ' (...)'}
            </p>
            <a href="{$path}/{$entry/wiki:id/string()}" class="exist-read-more">Read more</a>
            <span class="exist-date">{
                
                if ($age < xs:dayTimeDuration("PT1H")) then
                    let $minutes := if ($minutesSince = 1) then ' minute' else ' minutes'
                        return $minutesSince || $minutes || " ago"
                    
                else if ($age < xs:dayTimeDuration("P1D")) then
                    let $hours := if ($hoursSince = 1) then ' hour' else ' hours'
                        return $hoursSince || $hours || " ago"
                    
                else if ($age < xs:dayTimeDuration("P14D")) then
                    let $days := if ($daysSince = 1) then ' day' else ' days'
                        return $daysSince || $days || " ago"
                        
                    else
                        format-dateTime($date, "[MNn] [D00] [Y0000]", "en", (), ())
            }</span>
        </div>
    </div>
else ()

return
    $output
