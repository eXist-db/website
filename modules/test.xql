xquery version "3.0";

declare namespace output="http://www.w3.org/2010/xslt-xquery-serialization";
declare namespace wiki="http://exist-db.org/xquery/wiki";
declare namespace atom="http://www.w3.org/2005/Atom";
declare namespace xhtml="http://www.w3.org/1999/xhtml";

declare option output:method "html5";
declare option output:media-type "text/html";

declare variable $local:WIKI_ROOT := "http://exist-db.org/exist/apps/wiki";
declare variable $local:FEED := "/blogs/eXist/";
declare variable $local:LAST_ENTRIES := $local:WIKI_ROOT || "/atom" || $local:FEED || "?count=3";

response:set-header("Cache-Control", "no-cache"),
let $data := httpclient:get(xs:anyURI($local:LAST_ENTRIES), false(), ())
let $entries :=
    for $entry in $data/httpclient:body//atom:entry
    let $date := ($entry/atom:updated, $entry/atom:published)[1]
    order by xs:dateTime($date) descending
    return $entry
return
    <div class="row">
    {
        for $entry in subsequence($entries, 1, 3)
        let $dateStr := ($entry/atom:updated, $entry/atom:published)[1]
        let $date := xs:dateTime($dateStr/text())
        let $age := current-dateTime() - $date
        let $path := $local:WIKI_ROOT || $local:FEED || substring-after(util:collection-name($entry), "/db/apps/wiki/data")
        let $title := $entry/atom:title/text()
        let $abstract := subsequence($entry/atom:content//xhtml:p[1],1,1)
        let $image := subsequence($entry/atom:content//xhtml:img[1]/@src,1,1)
        let $category := data($entry/atom:category/@term)
        return
            $category
    }
</div>