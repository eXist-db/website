xquery version "3.0";

declare namespace output="http://www.w3.org/2010/xslt-xquery-serialization";
declare namespace wiki="http://exist-db.org/xquery/wiki";
declare namespace atom="http://www.w3.org/2005/Atom";
declare namespace xhtml="http://www.w3.org/1999/xhtml";
declare namespace httpclient = "http://exist-db.org/xquery/httpclient";

declare option output:method "html5";
declare option output:media-type "text/html";

declare variable $local:WIKI_ROOT := "http://exist-db.org/exist/apps/wiki";

response:set-header("Cache-Control", "no-cache"),

let $start := request:get-parameter("start",1)
let $count := request:get-parameter("count",10)
let $timelineURLString := "http://exist-db.org/exist/apps/wiki/modules/feeds.xql?feed=eXist;lts&amp;start=" || $start || "&amp;count=" || $count
let $data := httpclient:get(xs:anyURI($timelineURLString), false(), ())
let $entries :=
    for $entry in $data/httpclient:body//atom:entry
    let $date := ($entry/atom:updated, $entry/atom:published)[1]
    order by xs:dateTime($date) descending
    return $entry

for $entry in $entries
let $dateStr := ($entry/atom:updated, $entry/atom:published)[1]
let $date := xs:dateTime($dateStr/text())
let $age := current-dateTime() - $date
let $path := $local:WIKI_ROOT ||substring-after($entry/atom:link[@type eq 'blog']/@href, "/db/apps/wiki/data")
let $title := $entry/atom:title/text()
let $abstract := subsequence($entry/atom:content//xhtml:div/xhtml:p[1],1,1)
let $image := subsequence($entry/atom:content//xhtml:img[1]/@src,1,1)

let $yeah := httpclient:head(xs:anyURI(concat($path,"/",$image)),false(),())
let $checkresult := data($yeah/@statusCode) = 200

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
                if ($age < xdt:dayTimeDuration("PT1H")) then
                    minutes-from-duration($age) || " minutes ago"
                else if ($age < xdt:dayTimeDuration("P1D")) then
                    hours-from-duration($age) || " hours ago"
                else if ($age < xdt:dayTimeDuration("P14D")) then
                        days-from-duration($age) || " days ago"
                    else
                        format-dateTime($date, "[MNn] [D00] [Y0000]")
            }</span>
        </div>
    </div>
else ()

return
    $output

