xquery version "3.0";

declare namespace output="http://www.w3.org/2010/xslt-xquery-serialization";
declare namespace wiki="http://exist-db.org/xquery/wiki";
declare namespace atom="http://www.w3.org/2005/Atom";

declare option output:method "html5";
declare option output:media-type "text/html";

import module namespace http = "http://expath.org/ns/http-client";

declare variable $local:WIKI_ROOT := "https://exist-db.org/exist/apps/wiki";
declare variable $local:FEED := "/blogs/eXist/";
declare variable $local:LAST_ENTRIES := $local:WIKI_ROOT || "/atom" || $local:FEED || "?count=3";

response:set-header("Cache-Control", "no-cache"),
let $request := <http:request method="GET" href="{$local:LAST_ENTRIES}"/>
let $response := http:send-request($request)
let $entries :=
    for $entry in $response[2]//atom:entry
    let $date := ($entry/atom:updated, $entry/atom:published)[1]
    order by xs:dateTime($date) descending
    return $entry
return
    <ul class="news" style="display:none;">
    {
        for $entry in subsequence($entries, 1, 3)
        let $dateStr := ($entry/atom:updated, $entry/atom:published)[1]
        let $date := xs:dateTime($dateStr/text())
        let $age := current-dateTime() - $date
        let $minutesSince := minutes-from-duration($age)
        let $hoursSince := hours-from-duration($age)
        let $daysSince := days-from-duration($age)
        let $path := $local:WIKI_ROOT || $local:FEED || substring-after(util:collection-name($entry), "/db/apps/wiki/data")
        return
            <li>
                <div class="date">
                {
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
                }
                </div>
                <a href="{$path}{$entry/wiki:id/string()}">{ $entry/atom:title/string() }</a>
            </li>
    }
    </ul>
