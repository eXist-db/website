xquery version "3.0";

module namespace app="http://exist-db.org/apps/homepage/app";
import module namespace templates="http://exist-db.org/xquery/templates" ;
import module namespace config="http://existsolutions.com/homepage/config" at "config.xql";


import module namespace dbutil="http://exist-db.org/xquery/dbutil" at "xmldb:exist:///db/apps/shared-resources/content/dbutils.xql";


declare
    %templates:wrap
function app:github-account-verified($node as node(), $model as map(*)) {
    <span style="padding:5px;border:1px solid lightgray;color:darkred">not verified</span>
};

